'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {selectPlatform,releasesEndpoint,validateBrowserBridge,BROWSER_BRIDGE_MANIFEST}=require('../src/manifest');
test('windows package target',()=>assert.equal(selectPlatform('win32','x64').os,'windows'));
test('linux package target',()=>assert.ok(selectPlatform('linux','x64').extensions.includes('.deb')));
test('macOS package target',()=>assert.equal(selectPlatform('darwin','arm64').arch,'arm64'));
test('reject unknown architecture',()=>assert.throws(()=>selectPlatform('linux','mips')));
test('allowlisted repository endpoint',()=>assert.match(releasesEndpoint(),/Tuna-Browser\/releases$/));
test('reject arbitrary repo',()=>assert.throws(()=>releasesEndpoint('attacker/repo')));
test('browser bridge manifest URL is pinned to Tuna repository',()=>assert.match(BROWSER_BRIDGE_MANIFEST,/BareBones-Projects\/Tuna-Browser\/main\/launcher\/bridge-manifest\.json$/));
test('validates the documented Tuna bridge contract',()=>assert.equal(validateBrowserBridge({schema:1,product:'Tuna Browser',launcher:'Remedy Launcher',protocol:'tunabrowser://',args:['--launcher-ping','--launcher-open <https-url>'],permissions:['launch','open_http_https']}).protocol,'tunabrowser://'));
test('rejects bridge manifests with unsupported protocol',()=>assert.throws(()=>validateBrowserBridge({schema:1,product:'Tuna Browser',launcher:'Remedy Launcher',protocol:'file://',args:['--launcher-ping','--launcher-open <https-url>'],permissions:['launch','open_http_https']})));
const {selectReleaseAsset}=require('../src/manifest');
test('selects a supported stable Linux installer',()=>assert.equal(selectReleaseAsset({tag_name:'v1',assets:[{name:'app.deb',browser_download_url:'https://github.com/BareBones-Projects/Tuna-Browser/releases/download/v1/app.deb',size:12}]},{os:'linux',extensions:['.deb']}).name,'app.deb'));
test('rejects drafts and prereleases',()=>assert.throws(()=>selectReleaseAsset({draft:true,assets:[]})));
test('rejects unsupported or non-GitHub installer URLs',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[{name:'app.deb',browser_download_url:'https://evil.test/app.deb'}]},{os:'linux',extensions:['.deb']})));

// Release assets are metadata from a remote API and must not redirect the user
// to unrelated repositories, misleading architecture or unexpected URL hosts.
test('rejects a release asset from a different GitHub repository',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[{name:'app.deb',browser_download_url:'https://github.com/attacker/fake/releases/download/v1/app.deb'}]},{os:'linux',arch:'x64',extensions:['.deb']})));
test('rejects deceptive github.com hostnames',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[{name:'app.deb',browser_download_url:'https://github.com.evil.invalid/BareBones-Projects/Tuna-Browser/releases/download/v1/app.deb'}]},{os:'linux',arch:'x64',extensions:['.deb']})));
test('rejects a mismatch between published asset name and URL path',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[{name:'app.deb',browser_download_url:'https://github.com/BareBones-Projects/Tuna-Browser/releases/download/v1/malware.deb'}]},{os:'linux',arch:'x64',extensions:['.deb']})));
test('rejects arm64 installer for x64 host',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[{name:'app-arm64.deb',browser_download_url:'https://github.com/BareBones-Projects/Tuna-Browser/releases/download/v1/app-arm64.deb'}]},{os:'linux',arch:'x64',extensions:['.deb']})));
test('allows same-repo tagged x64 download',()=>assert.equal(selectReleaseAsset({tag_name:'v1',assets:[{name:'app-x64.deb',browser_download_url:'https://github.com/BareBones-Projects/Tuna-Browser/releases/download/v1/app-x64.deb'}]},{os:'linux',arch:'x64',extensions:['.deb']}).name,'app-x64.deb'));
test('rejects unsupported third-party release repository',()=>assert.throws(()=>selectReleaseAsset({tag_name:'v1',assets:[]},{os:'linux',arch:'x64',extensions:['.deb']},'attacker/fake')));
