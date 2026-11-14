#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {install,rollback,uninstall,readState,defaultRoot}=require('./signed-install');
const [action,...args]=process.argv.slice(2);
const value=(flag)=>{const i=args.indexOf(flag);return i<0?undefined:args[i+1];};
const yes=args.includes('--yes');
const root=value('--root')||defaultRoot();
try{
 let result;
 if(action==='install'||action==='update'){
  const manifest=JSON.parse(fs.readFileSync(path.resolve(value('--manifest')),'utf8'));
  const keys=JSON.parse(fs.readFileSync(path.resolve(value('--keys')),'utf8'));
  result=install({manifest,keys,artifactPath:value('--artifact'),root,channel:value('--channel'),consent:yes});
 }else if(action==='rollback')result=rollback({root,consent:yes});
 else if(action==='uninstall')result=uninstall({root,consent:yes});
 else if(action==='status')result=readState(root);
 else throw Error('Usage: manage-cli.js status|install|update|rollback|uninstall [--manifest FILE --keys FILE --artifact FILE --channel stable|beta|nightly] [--root DIR] [--yes]');
 console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
