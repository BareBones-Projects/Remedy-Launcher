import test from 'node:test';
import assert from 'node:assert/strict';
import {filterEntries,groupEntries,viewMeta,repositoryURL} from '../public/catalog-model.mjs';
import {catalog} from '../public/catalog-data.js';
test('all 13 BareBones catalog links resolve to the authorized organization',()=>{
 assert.equal(catalog.length,13);
 for(const entry of catalog){assert.equal(entry.url,repositoryURL(entry.slug));assert.match(entry.url,/^https:\/\/github.com\/BareBones-Projects\//)}
});
test('search filters case-insensitively and by slug',()=>{
 assert.deepEqual(filterEntries(catalog,{view:'library',search:' CUBE '}).map(x=>x.slug),['BareCube']);
 assert.deepEqual(filterEntries(catalog,{view:'home',search:'obsidian-plugins'}).map(x=>x.slug),['obsidian-plugins-alt-atlas']);
});
test('extensions select extensions without the Tuna browser',()=>{
 assert.deepEqual(filterEntries(catalog,{view:'extensions'}).map(x=>x.slug),['dark-search-extention','TruthMeta','obsidian-plugins-alt-atlas']);
});
test('theme and tool categories follow the requested groups',()=>{
 assert.equal(filterEntries(catalog,{view:'themes'}).length,3);
 assert.equal(filterEntries(catalog,{view:'tools'}).length,6);
});
test('updates and settings never assert an install state',()=>{
 assert.equal(filterEntries(catalog,{view:'updates'}).length,0);
 assert.equal(filterEntries(catalog,{view:'settings'}).length,0);
 assert.match(viewMeta('updates').notice,/unavailable/);
});
test('grouping preserves source group order',()=>assert.deepEqual(groupEntries(catalog).map(x=>x.name),['Browse & Extensions','BareBones Tools & Services','BareBones Themes','Plugins']));
test('malicious repository identifiers are rejected',()=>{
 assert.throws(()=>repositoryURL('../evil'));
 assert.throws(()=>repositoryURL('https://evil.example'));
});
