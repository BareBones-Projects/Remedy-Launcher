#!/usr/bin/env node
'use strict';
// Local-only static preview. No API proxy, installer execution, or upload endpoint.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
function resolveAsset(raw){
 if(typeof raw!=='string')throw Error('Invalid path');
 const decoded=decodeURIComponent(raw.split('?')[0]);
 if(!decoded.startsWith('/')||decoded.includes('\\')||decoded.includes('\0')||decoded.split('/').includes('..'))throw Error('Invalid path');
 const abs=path.resolve(root,(decoded==='/'?'/index.html':decoded).slice(1));
 if(!abs.startsWith(root+path.sep)||!Object.hasOwn(types,path.extname(abs)))throw Error('Asset outside public directory');
 return abs;
}
function createPreviewServer(){return http.createServer((req,res)=>{
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end('Method not allowed');return}
 let file;try{file=resolveAsset(req.url||'/');if(!fs.statSync(file).isFile())throw Error('Not file')}catch{res.writeHead(404).end('Not found');return}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]});
 if(req.method==='HEAD'){res.end();return}
 fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
})}
if(require.main===module){
 const port=Number(process.env.PORT||8765);
 createPreviewServer().listen(port,'127.0.0.1',()=>console.log('Remedy UI preview: http://127.0.0.1:'+port+'/ (catalog only)'));
}
module.exports={createPreviewServer,resolveAsset};
