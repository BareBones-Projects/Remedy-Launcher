'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Midnight Blue theme includes navigation, search, catalog, and legal link',()=>{
 const html=read('public/index.html');
 for(const view of ['home','library','updates','repositories','extensions','tools','themes','settings'])assert.ok(html.includes('data-view="'+view+'"'),'view missing: '+view);
 for(const id of ['globalSearch','catalogGroups','viewTitle','notice','openFiles','folder','filelist','ticket','settingsPanel','notifications'])assert.ok(html.includes('id="'+id+'"'),'missing '+id);
 assert.match(html,/aria-live="polite"/);
 assert.match(html,/https:\/\/github.com\/BareBones-Projects\/legal-page/);
 assert.match(html,/type="module" src="\.\/app.js"/);
});
test('theme is responsive with dark-blue tokens and reduced-motion support',()=>{
 const css=read('public/style.css');
 for(const token of ['--primary:#0788f9','--bg:#030b14','.download-dock','.catalog-card','@media(max-width:540px)','prefers-reduced-motion'])assert.ok(css.includes(token),'missing '+token);
 assert.ok(fs.statSync(path.join(root,'public/assets/remedy-mark.svg')).size>200);
 assert.ok(fs.statSync(path.join(root,'public/assets/hero-landscape.svg')).size>200);
});
test('preview never claims installed versions or native updater support',()=>{
 const html=read('public/index.html'),app=read('public/app.js');
 assert.doesNotMatch(html,/Installed v\d/);
 assert.doesNotMatch(app,/Installed v\d/);
 assert.match(html,/Installer integration pending/);
 assert.match(app,/noopener noreferrer/);
});
