'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {canonical,verifyManifest,install,rollback,uninstall,readState,sha256}=require('../src/signed-install');
const host={os:'linux',arch:'x64'};
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'remedy-test-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const {publicKey,privateKey}=crypto.generateKeyPairSync('ed25519');
 const keys={release:publicKey.export({type:'spki',format:'pem'})};
 function make(version,content){
  const file='remedy.bin', artifactPath=path.join(root,file), bytes=Buffer.from(content);
  fs.writeFileSync(artifactPath,bytes);
  const payload={schema:1,product:'Remedy Launcher',version,channel:'beta',platform:'linux',arch:'x64',artifact:{file,size:bytes.length,sha256:sha256(bytes)}};
  const manifest={payload,keyId:'release',signature:crypto.sign(null,Buffer.from(canonical(payload)),privateKey).toString('base64')};
  return {manifest,keys,artifactPath};
 }
 return {root:path.join(root,'managed'),make};
}
test('signature binds all fields and rejects tampering',t=>{
 const f=fixture(t),v=f.make('1.0.0','release');
 assert.equal(verifyManifest(v.manifest,v.keys,host).version,'1.0.0');
 assert.throws(()=>verifyManifest({...v.manifest,payload:{...v.manifest.payload,version:'1.0.1'}},v.keys,host),/signature/);
 assert.throws(()=>verifyManifest(v.manifest,{},host),/Untrusted/);
 assert.throws(()=>verifyManifest(v.manifest,v.keys,{os:'windows',arch:'x64'}),/platform/);
});
test('permission required, integrity enforced, rollback restores previous',t=>{
 const f=fixture(t),one=f.make('1.0.0','first');
 assert.throws(()=>install({...one,root:f.root,host}),/consent/);
 assert.throws(()=>install({...one,root:f.root,host,channel:'stable',consent:true}),/channel/);
 const s1=install({...one,root:f.root,host,consent:true});
 assert.match(s1.active,/1.0.0/);
 const two=f.make('1.1.0','second');
 fs.appendFileSync(two.artifactPath,'tamper');
 assert.throws(()=>install({...two,root:f.root,host,consent:true}),/integrity/);
 fs.writeFileSync(two.artifactPath,'second');
 const s2=install({...two,root:f.root,host,consent:true});
 assert.equal(s2.previous,s1.active);
 assert.equal(rollback({root:f.root,consent:true}).active,s1.active);
 assert.throws(()=>uninstall({root:f.root}),/consent/);
 assert.equal(uninstall({root:f.root,consent:true}).uninstalled,true);
 assert.equal(readState(f.root).active,null);
});
test('reject malicious filenames',t=>{
 const f=fixture(t),v=f.make('1.0.0','bytes');
 v.manifest.payload.artifact.file='../escape';
 assert.throws(()=>verifyManifest(v.manifest,v.keys,host),/metadata/);
});
