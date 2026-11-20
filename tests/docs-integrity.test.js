// Documentation and catalog integrity gate.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const docs=['README.md','SECURITY.md','CHANGELOG.md','INSTALLATION.md','docs/ARCHITECTURE.md','docs/DEVELOPMENT.md','docs/TESTING.md','docs/RELEASE.md','docs/DECISIONS.md'];
for(const p of docs)assert.ok(fs.statSync(path.join(root,p)).isFile(),p+' missing');
const readme=read('README.md');for(const p of docs.filter(x=>x!=='README.md'&&x!=='INSTALLATION.md'))assert.ok(readme.includes(p),'README missing '+p);
const catalog=JSON.parse(read('config/ecosystem.json'));
assert.equal(catalog.items.length,13);
assert.deepEqual([...new Set(catalog.items.map(x=>x.group))],['Browse & Extensions','BareBones Tools & Services','BareBones Themes','Plugins']);
const data=read('public/catalog-data.js');
for(const item of catalog.items){
 assert.match(item.url,/^https:\/\/github\.com\/BareBones-Projects\/[A-Za-z0-9._-]+$/);
 assert.ok(data.includes(item.slug),'catalog JS missing '+item.slug);
 assert.ok(data.includes(item.name),'catalog JS missing '+item.name);
}
const html=read('public/index.html');
assert.ok(html.includes('https://github.com/BareBones-Projects/legal-page'),'Legal text link missing');
assert.ok(!html.includes('href="/API.md"'),'broken API link');
console.log('Documentation and 13 catalog entries verified');
