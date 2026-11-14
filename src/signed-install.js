'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {selectPlatform}=require('./manifest');
const CHANNELS=new Set(['stable','beta','nightly']);
function canonical(value){
 if(Array.isArray(value)) return '['+value.map(canonical).join(',')+']';
 if(value!==null&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
 return JSON.stringify(value);
}
function verifyManifest(doc,keys,host=selectPlatform()){
 if(!doc||!doc.payload||!doc.signature||typeof doc.keyId!=='string')throw Error('Missing signed manifest fields');
 const p=doc.payload;
 if(p.schema!==1||p.product!=='Remedy Launcher'||!CHANNELS.has(p.channel)||!/^v?\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/.test(p.version))throw Error('Invalid product, channel or version');
 if(p.platform!==host.os||p.arch!==host.arch)throw Error('Manifest does not match platform');
 if(!p.artifact||!/^[-a-zA-Z0-9._]+$/.test(p.artifact.file)||p.artifact.file==='.'||p.artifact.file==='..'||!/^[a-f0-9]{64}$/.test(p.artifact.sha256)||!Number.isSafeInteger(p.artifact.size)||p.artifact.size<1)throw Error('Invalid artifact metadata');
 if(!keys||typeof keys[doc.keyId]!=='string')throw Error('Untrusted signing key');
 if(!/^[A-Za-z0-9+/]+={0,2}$/.test(doc.signature)||doc.signature.length%4!==0)throw Error('Invalid signature encoding');
 const publicKey=crypto.createPublicKey(keys[doc.keyId]);
 if(publicKey.asymmetricKeyType!=='ed25519')throw Error('Only Ed25519 signing keys are accepted');
 const message=Buffer.from(canonical(p));
 if(!crypto.verify(null,message,publicKey,Buffer.from(doc.signature,'base64')))throw Error('Invalid manifest signature');
 return p;
}
function defaultRoot(){return path.join(os.homedir(),'.remedy-launcher','managed');}
function safeRoot(root){
 const dest=path.resolve(root);
 if(dest===path.parse(dest).root)throw Error('Root directory is unsafe');
 if(fs.existsSync(dest)&&fs.lstatSync(dest).isSymbolicLink())throw Error('Symlink install root rejected');
 return dest;
}
function sha256(buffer){return crypto.createHash('sha256').update(buffer).digest('hex');}
function stateFile(root){return path.join(root,'state.json');}
function readState(root){try{return JSON.parse(fs.readFileSync(stateFile(root),'utf8'));}catch(e){if(e.code==='ENOENT')return {active:null,previous:null,history:[]};throw e;}}
function atomicJSON(file,value){
 const tmp=file+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';
 fs.writeFileSync(tmp,JSON.stringify(value,null,2),{flag:'wx',mode:0o600});
 try{fs.renameSync(tmp,file);}catch(e){fs.rmSync(tmp,{force:true});throw e;}
}
function assertConsent(consent){if(consent!==true)throw Error('Explicit --yes consent required');}
function install({manifest,keys,artifactPath,root=defaultRoot(),consent=false,channel,host}){
 assertConsent(consent);
 const payload=verifyManifest(manifest,keys,host||selectPlatform());
 if(channel&&payload.channel!==channel)throw Error('Update channel mismatch');
 root=safeRoot(root);
 const src=path.resolve(artifactPath);
 if(fs.lstatSync(src).isSymbolicLink()||!fs.statSync(src).isFile())throw Error('Artifact must be a regular file');
 const bytes=fs.readFileSync(src);
 if(bytes.length!==payload.artifact.size||sha256(bytes)!==payload.artifact.sha256)throw Error('Artifact integrity check failed');
 if(path.basename(src)!==payload.artifact.file)throw Error('Artifact name mismatch');
 fs.mkdirSync(root,{recursive:true,mode:0o700});
 const versions=path.join(root,'versions');
 fs.mkdirSync(versions,{recursive:true,mode:0o700});
 const key=payload.channel+'-'+payload.version+'-'+payload.platform+'-'+payload.arch;
 const destination=path.join(versions,key);
 const stage=path.join(versions,'.stage-'+crypto.randomBytes(8).toString('hex'));
 if(fs.existsSync(destination))throw Error('Version already installed');
 fs.mkdirSync(stage,{mode:0o700});
 try{
  fs.writeFileSync(path.join(stage,payload.artifact.file),bytes,{flag:'wx',mode:0o700});
  atomicJSON(path.join(stage,'receipt.json'),{payload,sha256:sha256(bytes),installedAt:new Date().toISOString()});
  fs.renameSync(stage,destination);
  try{
   const old=readState(root);
   atomicJSON(stateFile(root),{active:key,previous:old.active,history:[...(old.history||[]),key]});
  }catch(e){fs.rmSync(destination,{recursive:true,force:true});throw e;}
 }catch(e){fs.rmSync(stage,{recursive:true,force:true});throw e;}
 return {active:key,previous:readState(root).previous,root};
}
function rollback({root=defaultRoot(),consent=false}){
 assertConsent(consent);root=safeRoot(root);
 const old=readState(root);
 if(!old.previous)throw Error('No prior installation to restore');
 const dest=path.join(root,'versions',old.previous);
 const receipt=JSON.parse(fs.readFileSync(path.join(dest,'receipt.json'),'utf8'));
 const data=fs.readFileSync(path.join(dest,receipt.payload.artifact.file));
 if(sha256(data)!==receipt.sha256)throw Error('Rollback artifact integrity check failed');
 atomicJSON(stateFile(root),{...old,active:old.previous,previous:old.active});
 return readState(root);
}
function uninstall({root=defaultRoot(),consent=false}){
 assertConsent(consent);root=safeRoot(root);
 const old=readState(root);
 if(!old.active)return {uninstalled:false};
 const versions=path.join(root,'versions');
 const target=path.join(versions,old.active);
 if(!fs.existsSync(target))throw Error('Active installation is missing');
 if(fs.lstatSync(target).isSymbolicLink())throw Error('Refusing to delete symlink');
 const history=(old.history||[]).filter(k=>k!==old.active);
 atomicJSON(stateFile(root),{active:null,previous:null,history});
 fs.rmSync(target,{recursive:true,force:true});
 return {uninstalled:true,removed:old.active};
}
module.exports={canonical,verifyManifest,install,rollback,uninstall,readState,defaultRoot,sha256};
