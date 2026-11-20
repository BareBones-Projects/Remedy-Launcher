// BareBones Projects, Designed by: Justin Levesque-Welsch.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const docs=['README.md','SECURITY.md','CHANGELOG.md','INSTALLATION.md','docs/ARCHITECTURE.md','docs/DEVELOPMENT.md','docs/TESTING.md','docs/RELEASE.md','docs/DECISIONS.md'];
for(const p of docs)assert.ok(fs.statSync(path.join(root,p)).isFile(),p+' missing');
const readme=read('README.md');for(const p of docs.filter(x=>x!=='README.md'&&x!=='INSTALLATION.md'))assert.ok(readme.includes(p),'README missing '+p);
const catalog=JSON.parse(read('config/ecosystem.json'));
assert.equal(catalog.items.length,13);
assert.deepEqual([...new Set(catalog.items.map(x=>x.group))],['Browse & Extensions','BareBones Tools & Services','BareBones Themes','Plugins']);
for(const item of catalog.items){
 assert.match(item.url,/^https:\/\/github\.com\/BareBones-Projects\/[A-Za-z0-9._-]+$/);
 assert.ok(read('public/app.js').includes(item.url),'catalog JS missing '+item.url);
}
const indexHtml=read('public/index.html');
const hrefs=[...indexHtml.matchAll(/href\s*=\s*["']([^"']+)["']/g)].map(m=>m[1]);
assert.ok(hrefs.includes('https://github.com/BareBones-Projects/legal-page'),'Legal footer link missing');
assert.ok(!indexHtml.includes('href="/API.md"'),'broken legacy API link');
console.log('Docs, catalog parity and legal link verified: '+catalog.items.length+' repository cards');
