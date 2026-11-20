'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createPreviewServer,resolveAsset}=require('../scripts/preview-server.cjs');
test('preview refuses traversal and unsupported file types',()=>{
 assert.throws(()=>resolveAsset('/../SECURITY.md'));
 assert.throws(()=>resolveAsset('/%2e%2e%2fSECURITY.md'));
 assert.throws(()=>resolveAsset('/package.json'));
});
test('serves real UI and module assets, not repository secrets or write endpoints',async()=>{
 const server=createPreviewServer();
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const home=await fetch(base+'/');assert.equal(home.status,200);assert.match(await home.text(),/Remedy Launcher/);
  assert.match(home.headers.get('content-security-policy'),/default-src 'self'/);
  const module=await fetch(base+'/catalog-model.mjs');assert.equal(module.status,200);assert.match(await module.text(),/filterEntries/);
  assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
