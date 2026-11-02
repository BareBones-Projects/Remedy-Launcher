#!/usr/bin/env node
'use strict';
const {BROWSER_REPO,LAUNCHER_REPO,selectPlatform,releasesEndpoint,fetchBrowserBridge}=require('./manifest');
const cmd=process.argv[2]||'help';
if(cmd==='help'){
 console.log('Remedy Launcher alpha CLI\nCommands: help, status, releases-url\nNo installation or updates are performed by this alpha.');
}else if(cmd==='status'){
 console.log(JSON.stringify({launcher:LAUNCHER_REPO,browser:BROWSER_REPO,platform:selectPlatform(),installerEnabled:false},null,2));
}else if(cmd==='releases-url'){
 console.log(releasesEndpoint());
}else if(cmd==='browser-bridge'){
 fetchBrowserBridge().then(manifest=>console.log(JSON.stringify(manifest,null,2))).catch(error=>{console.error(error.message);process.exitCode=1;});
}else{
 console.error('Unknown command');process.exitCode=2;
}
