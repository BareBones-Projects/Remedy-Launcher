// Remedy Launcher browser-preview catalog model. No native install side effects.
export const GROUPS=['Browse & Extensions','BareBones Tools & Services','BareBones Themes','Plugins'];
const metadata={
home:['Featured projects','BAREBONES ECOSYSTEM','Explore project repositories. No verified native install or automatic update is available in this preview.'],
library:['Project library','FULL DIRECTORY','All cards are repository links, not verified installers.'],
updates:['Updates','RELEASE CENTER','Automatic updates are unavailable. Inspect official releases manually.'],
repositories:['Repositories','SOURCE DIRECTORY','Repository cards open their GitHub project pages.'],
extensions:['Extensions & plugins','EXTENSIONS','Installation is not implemented in this preview.'],
tools:['BareBones tools','TOOLS & SERVICES','Browse tools on their official repositories.'],
themes:['BareBones themes','APPEARANCE','Theme installation is not performed here.'],
settings:['Settings','PREFERENCES','Midnight Blue 01 is the locked visual theme. Sign-in is not configured.']
};
export function viewMeta(view){const a=metadata[view]||metadata.home;return {title:a[0],eyebrow:a[1],notice:a[2]}}
export function repositoryURL(slug){
 if(typeof slug!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)||slug.includes('..'))throw Error('Invalid repository identifier');
 return 'https://github.com/BareBones-Projects/'+slug;
}
export function filterEntries(entries,{view='home',search=''}={}){
 const query=String(search??'').trim().toLocaleLowerCase();
 return entries.filter(item=>{
  if(view==='updates'||view==='settings')return false;
  if(view==='extensions'&&!['dark-search-extention','TruthMeta','obsidian-plugins-alt-atlas'].includes(item.slug))return false;
  if(view==='tools'&&item.group!=='BareBones Tools & Services')return false;
  if(view==='themes'&&item.group!=='BareBones Themes')return false;
  return !query||[item.name,item.slug,item.group].some(x=>String(x||'').toLocaleLowerCase().includes(query));
 });
}
export function groupEntries(items){return GROUPS.map(name=>({name,items:items.filter(item=>item.group===name)})).filter(x=>x.items.length)}
