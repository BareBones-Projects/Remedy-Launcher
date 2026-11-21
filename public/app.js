// Remedy Launcher / Midnight Blue 01. Browser UI only, never executes packages.
import {catalog} from './catalog-data.js';
import {filterEntries,groupEntries,viewMeta,repositoryURL} from './catalog-model.mjs';
const el=id=>document.getElementById(id);
const search=el('globalSearch'),root=el('catalogGroups');
let view='home';
const iconPaths={
fish:'<path d="M3 12c5-7 12-7 17 0-5 7-12 7-17 0ZM3 12l-2-4v8l2-4Zm12 0h.01"/>',
search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 6 6"/>',
cube:'<path d="m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10"/>',
layers:'<path d="m12 3 10 6-10 6L2 9l10-6Zm-10 11 10 6 10-6"/>',
tool:'<path d="M20 8a6 6 0 0 1-8 6l-8 8-3-3 8-8a6 6 0 0 1 7-8l-4 4 3 3 5-4Z"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-4c-2-1 0-3 2-3h2a3 3 0 0 0 3-3 9 9 0 0 0-10-8Z"/>',
puzzle:'<path d="M9 3h3c0 3 4 3 4 0h5v7c-3-1-5 3-2 4 1 0 2 0 2-1v8H3v-7c3 1 5-3 2-4V3h6Z"/>'
};
function icon(kind){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','fallback-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=iconPaths[kind]||iconPaths.cube;return svg;
}
function makeCard(item){
 const link=document.createElement('a');link.className='catalog-card';link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','View '+item.name+' repository on GitHub');
 const header=document.createElement('div');header.className='catalog-card-top';
 const tile=document.createElement('span');tile.className='app-avatar';
 const slug=item.slug.toLowerCase();
 const kind=slug.includes('tuna')?'fish':slug.includes('search')?'search':slug.includes('truth')?'layers':slug.includes('theme')?'palette':slug.includes('plugin')?'puzzle':slug.includes('mark')?'layers':slug.includes('kit')?'tool':'cube';
 tile.classList.add('tile-'+kind);tile.append(icon(kind));
 const detail=document.createElement('span');detail.className='catalog-card-details';
 const title=document.createElement('strong');title.textContent=item.name;
 const desc=document.createElement('small');desc.textContent=item.description;detail.append(title,desc);header.append(tile,detail);
 const footer=document.createElement('span');footer.className='card-footer';
 const status=document.createElement('span');status.className='card-status';status.textContent='● Repository';
 const action=document.createElement('span');action.className='card-action';action.textContent='View project ↗';footer.append(status,action);
 link.append(header,footer);return link;
}
function render(){
 const meta=viewMeta(view),results=filterEntries(catalog,{view,search:search.value});
 el('viewTitle').textContent=search.value.trim()?'Search · '+meta.title:meta.title;
 el('viewEyebrow').textContent=meta.eyebrow;el('notice').textContent=meta.notice;
 el('viewCount').textContent=results.length+' repository link'+(results.length===1?'':'s');
 root.replaceChildren();
 if(!results.length){
  const empty=document.createElement('div');empty.className='empty-result';empty.textContent=view==='updates'||view==='settings'?meta.notice:'No matching projects. Search again or open Library.';root.append(empty);
 }else{
  for(const group of groupEntries(results)){
   const section=document.createElement('section');section.className='catalog-section';section.setAttribute('aria-label',group.name);
   const h=document.createElement('div');h.className='section-head';const title=document.createElement('h3');title.textContent=group.name;const count=document.createElement('small');count.textContent=group.items.length+' projects · external links';h.append(title,count);
   const grid=document.createElement('div');grid.className='catalog-grid';group.items.forEach(item=>grid.append(makeCard(item)));section.append(h,grid);root.append(section);
  }
  if(['home','library','repositories','tools'].includes(view)){
   const free=document.createElement('a');free.className='free-tools';free.href=repositoryURL('BareTools');free.target='_blank';free.rel='noopener noreferrer';free.textContent='◫   Explore free tools · BareTools   ↗';root.append(free);
  }
 }
 el('hero').hidden=!['home','library'].includes(view);
 el('workspace').hidden=['settings','updates'].includes(view);
 el('support').hidden=['settings','updates'].includes(view);
 el('settingsPanel').hidden=view!=='settings';
}
function setView(next){
 view=next;
 document.querySelectorAll('.nav-item').forEach(b=>{let active=b.dataset.view===view;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 render();
}
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
search.addEventListener('input',render);
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus();search.select()}else if(e.key==='Escape'&&document.activeElement===search){search.value='';search.blur();render()}});
el('notifications').addEventListener('click',()=>setView('updates'));
el('login').addEventListener('click',()=>setView('settings'));
const folder=el('folder');el('openFiles').addEventListener('click',()=>folder.click());
folder.addEventListener('change',()=>{const list=el('filelist');list.replaceChildren();for(const f of folder.files){const row=document.createElement('div');row.className='file';row.textContent=(f.webkitRelativePath||f.name)+' · '+Math.ceil(f.size/1024)+' KB';list.append(row)}if(!folder.files.length)list.textContent='No files selected.'});
el('ticket').addEventListener('submit',async e=>{e.preventDefault();const status=el('ticketStatus');status.textContent='Submitting…';try{const response=await fetch('/api/support/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))});const body=await response.json();status.textContent=response.ok?'Ticket submitted.':body.error||'Support unavailable.'}catch{status.textContent='Support unavailable. Open a GitHub issue instead.'}});
render();
