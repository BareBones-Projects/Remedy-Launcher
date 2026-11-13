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
function selectReleaseAsset(release, target=selectPlatform()){
  if(!release||release.draft||release.prerelease) throw new Error('No stable published release available');
  const assets=Array.isArray(release.assets)?release.assets:[];
  const expectedRepo=BROWSER_REPO;
  const releaseTag=String(release.tag_name||'');
  if(!/^v?[0-9][a-zA-Z0-9._+-]*$/.test(releaseTag)) throw new Error('Release tag is missing or invalid');
  const normalizedArch=target.arch || '';
  const matchesPlatform=(name)=>{
    const low=name.toLowerCase();
    if(!target.extensions.some(ext=>low.endsWith(ext.toLowerCase())))return false;
    // Only accept a named architecture when it matches the selected host.
    if(normalizedArch==='x64'&&/(?:^|[-_.])(arm64|aarch64)(?:[-_.]|$)/i.test(name))return false;
    if(normalizedArch==='arm64'&&/(?:^|[-_.])(x64|amd64|x86_64)(?:[-_.]|$)/i.test(name))return false;
    return true;
  };
  const asset=assets.find(item=>{
    if(typeof item.name!=='string'||!matchesPlatform(item.name)||typeof item.browser_download_url!=='string')return false;
    let parsed;try{parsed=new URL(item.browser_download_url)}catch{return false}
    if(parsed.protocol!=='https:'||parsed.hostname!=='github.com'||parsed.username||parsed.password||parsed.search||parsed.hash)return false;
    const segments=parsed.pathname.split('/').filter(Boolean);
    if(segments.length!==6||segments[2]!=='releases'||segments[3]!=='download')return false;
    if(segments[0]!==expectedRepo.split('/')[0]||segments[1]!==expectedRepo.split('/')[1])return false;
    return decodeURIComponent(segments[4])===releaseTag&&decodeURIComponent(segments[5])===item.name;
  });
  if(!asset) throw new Error(`No supported ${target.os} installer asset in latest stable release`);
  return Object.freeze({tag:release.tag_name,name:asset.name,url:asset.browser_download_url,size:asset.size||null});
}
async function fetchLatestRelease(repo=LAUNCHER_REPO,fetchImpl=globalThis.fetch,target=selectPlatform()){
  const response=await fetchImpl(releasesEndpoint(repo)+'/latest',{headers:{accept:'application/vnd.github+json'}});
  if(!response.ok) throw new Error(`Release request failed (${response.status})`);
  return selectReleaseAsset(await response.json(),target);
}
module.exports={BROWSER_REPO,LAUNCHER_REPO,selectPlatform,releasesEndpoint,BROWSER_BRIDGE_MANIFEST,validateBrowserBridge,fetchBrowserBridge,selectReleaseAsset,fetchLatestRelease};
