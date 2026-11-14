const api = async path => (await fetch(path)).json();
const repos = await api('/api/repositories');
document.querySelector('#repos').innerHTML = repos.items.map(r => `<article class="repo"><span class="status">${r.status}</span><h3>${r.name}</h3><p>${r.owner} · ${r.description}</p></article>`).join('');
const providers = await api('/api/auth/providers');
document.querySelector('#providers').innerHTML = providers.providers.map(p => `<button disabled title="OAuth client is not configured">Continue with ${p === 'x' ? 'X' : p[0].toUpperCase()+p.slice(1)}</button>`).join('');
const folder = document.querySelector('#folder');
document.querySelector('#openFiles').onclick = () => folder.click();
folder.onchange = () => {
  const filelist = document.querySelector('#filelist');
  filelist.textContent = '';
  const files = [...folder.files];
  if (!files.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No files selected.';
    filelist.appendChild(empty);
    return;
  }
  files.forEach(f => {
    const row = document.createElement('div');
    row.className = 'file';
    row.appendChild(document.createTextNode(`${f.webkitRelativePath || f.name} `));
    const muted = document.createElement('span');
    muted.className = 'muted';
    muted.textContent = `· ${Math.ceil(f.size/1024)} KB`;
    row.appendChild(muted);
    filelist.appendChild(row);
  });
};
document.querySelector('#install').onclick = () => alert('Local installation will be enabled by the signed RemedyOS desktop companion.');
document.querySelector('#login').onclick = () => document.querySelector('#providers').scrollIntoView({behavior:'smooth'});
document.querySelector('#ticket').onsubmit = async e => { e.preventDefault(); const status = document.querySelector('#ticketStatus'); try { const r = await fetch('/api/support/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))}); const data=await r.json(); status.textContent=data.error || 'Ticket created.'; } catch { status.textContent='Could not reach the support service.'; } };
