// BareBones Projects, Designed by: Justin Levesque-Welsch.
const groupNames=['Browse & Extensions','BareBones Tools & Services','BareBones Themes','Plugins'];
const catalog=[{"group":"Browse & Extensions","name":"Tuna Browser","slug":"Tuna-Browser","url":"https://github.com/BareBones-Projects/Tuna-Browser"},{"group":"Browse & Extensions","name":"Dark Search Extension","slug":"dark-search-extention","url":"https://github.com/BareBones-Projects/dark-search-extention"},{"group":"Browse & Extensions","name":"TruthMeta","slug":"TruthMeta","url":"https://github.com/BareBones-Projects/TruthMeta"},{"group":"BareBones Tools & Services","name":"BareGreyscale UV Wrapper","slug":"BareGreyscale-UV-Wrapper","url":"https://github.com/BareBones-Projects/BareGreyscale-UV-Wrapper"},{"group":"BareBones Tools & Services","name":"Bare Icon3","slug":"Bare-Icon3","url":"https://github.com/BareBones-Projects/Bare-Icon3"},{"group":"BareBones Tools & Services","name":"BareKit","slug":"BareKit","url":"https://github.com/BareBones-Projects/BareKit"},{"group":"BareBones Tools & Services","name":"BareMark","slug":"BareMark","url":"https://github.com/BareBones-Projects/BareMark"},{"group":"BareBones Tools & Services","name":"BareCube","slug":"BareCube","url":"https://github.com/BareBones-Projects/BareCube"},{"group":"BareBones Tools & Services","name":"Bare UV Wrapper","slug":"Bare-UV-Wrapper","url":"https://github.com/BareBones-Projects/Bare-UV-Wrapper"},{"group":"BareBones Themes","name":"Obsidian Bruth","slug":"BareThemes-Obsidian-Bruth","url":"https://github.com/BareBones-Projects/BareThemes-Obsidian-Bruth"},{"group":"BareBones Themes","name":"macOS Tahoe","slug":"BareThemes-macOS-Tahoe","url":"https://github.com/BareBones-Projects/BareThemes-macOS-Tahoe"},{"group":"BareBones Themes","name":"Blender Active","slug":"BareThemes-Blender-Active","url":"https://github.com/BareBones-Projects/BareThemes-Blender-Active"},{"group":"Plugins","name":"ALT Atlas Obsidian Plugin","slug":"obsidian-plugins-alt-atlas","url":"https://github.com/BareBones-Projects/obsidian-plugins-alt-atlas"}];
const catalogRoot=document.querySelector('#catalogGroups');
for(const group of groupNames){
 const section=document.createElement('section');section.className='catalog-section';
 const header=document.createElement('div');header.className='section-head';
 const title=document.createElement('h3');title.textContent=group;
 const subtitle=document.createElement('span');subtitle.className='muted';subtitle.textContent='Open repository · inspect releases before downloading';
 header.append(title,subtitle);section.append(header);
 const grid=document.createElement('div');grid.className='catalog-grid';
 for(const item of catalog.filter(item=>item.group===group)){
  const link=document.createElement('a');link.className='catalog-card';link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Open '+item.name+' repository');
  const image=document.createElement('img');image.loading='lazy';image.alt=item.name+' repository preview';image.src='https://opengraph.githubassets.com/1/BareBones-Projects/'+encodeURIComponent(item.slug);image.onerror=()=>{image.remove();link.classList.add('no-image')};
  const detail=document.createElement('div');detail.className='catalog-card-body';
  const heading=document.createElement('strong');heading.textContent=item.name;
  const label=document.createElement('small');label.textContent='View source / releases ↗';
  detail.append(heading,label);link.append(image,detail);grid.append(link);
 }
 section.append(grid);catalogRoot.append(section);
}
const free=document.createElement('a');free.className='free-tools';free.href='https://github.com/BareBones-Projects/BareTools';free.target='_blank';free.rel='noopener noreferrer';free.textContent='Explore free tools · BareTools ↗';catalogRoot.append(free);
const folder=document.querySelector('#folder');document.querySelector('#openFiles').onclick=()=>folder.click();
folder.onchange=()=>{const list=document.querySelector('#filelist');list.replaceChildren();const selected=[...folder.files];if(!selected.length){list.textContent='No files selected.';return}for(const file of selected){const row=document.createElement('div');row.className='file';row.textContent=(file.webkitRelativePath||file.name)+' · '+Math.ceil(file.size/1024)+' KB';list.append(row)}};
document.querySelector('#login').onclick=()=>document.querySelector('#providers').scrollIntoView({behavior:'smooth'});
const providers=document.querySelector('#providers');const disabled=document.createElement('button');disabled.disabled=true;disabled.textContent='Sign-in unavailable in preview';providers.append(disabled);
document.querySelector('#ticket').onsubmit=async event=>{event.preventDefault();const status=document.querySelector('#ticketStatus');status.textContent='Submitting…';try{const response=await fetch('/api/support/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });const data=await response.json();status.textContent=response.ok?'Ticket submitted.':(data.error||'Support is unavailable.')}catch{status.textContent='Support service unavailable; please open a GitHub issue.'}};
