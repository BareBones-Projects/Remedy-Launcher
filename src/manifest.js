'use strict';
const BROWSER_REPO='BareBones-Projects/Tuna-Browser';
const LAUNCHER_REPO='BareBones-Projects/Remedy-Launcher';
const API_BASE='https://api.github.com/repos/';
const BROWSER_BRIDGE_MANIFEST='https://raw.githubusercontent.com/BareBones-Projects/Tuna-Browser/main/launcher/bridge-manifest.json';
function selectPlatform(platform=process.platform,arch=process.arch){
  if(!['x64','arm64'].includes(arch)) throw new Error('Unsupported architecture');
  if(platform==='win32') return {os:'windows',arch,extensions:['.exe']};
  if(platform==='darwin') return {os:'macos',arch,extensions:['.dmg','.zip']};
  if(platform==='linux') return {os:'linux',arch,extensions:['.AppImage','.deb']};
  throw new Error('Unsupported operating system');
}
function releasesEndpoint(repo=BROWSER_REPO){
  if(![BROWSER_REPO,LAUNCHER_REPO].includes(repo)) throw new Error('Repository not allowed');
  return API_BASE+repo+'/releases';
}
function validateBrowserBridge(manifest){
  if(!manifest||manifest.schema!==1||manifest.product!=='Tuna Browser'||manifest.launcher!=='Remedy Launcher'||manifest.protocol!=='tunabrowser://') throw new Error('Unsupported browser bridge manifest');
  if(!Array.isArray(manifest.args)||!manifest.args.includes('--launcher-ping')||!manifest.args.includes('--launcher-open <https-url>')) throw new Error('Unsupported browser launch arguments');
  if(!Array.isArray(manifest.permissions)||!manifest.permissions.includes('launch')||!manifest.permissions.includes('open_http_https')) throw new Error('Unsupported browser bridge permissions');
  return Object.freeze({product:manifest.product,protocol:manifest.protocol,args:Object.freeze([...manifest.args]),permissions:Object.freeze([...manifest.permissions])});
}
async function fetchBrowserBridge(fetchImpl=globalThis.fetch){
  if(typeof fetchImpl!=='function') throw new Error('Fetch is unavailable');
  const response=await fetchImpl(BROWSER_BRIDGE_MANIFEST,{headers:{accept:'application/json'}});
  if(!response.ok) throw new Error(`Browser bridge manifest request failed (${response.status})`);
  return validateBrowserBridge(await response.json());
}
module.exports={BROWSER_REPO,LAUNCHER_REPO,selectPlatform,releasesEndpoint,BROWSER_BRIDGE_MANIFEST,validateBrowserBridge,fetchBrowserBridge};
