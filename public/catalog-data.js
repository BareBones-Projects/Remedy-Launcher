// This catalog mirrors config/ecosystem.json. It contains navigation links, not installers.
import {repositoryURL} from './catalog-model.mjs';
const records=[
['Browse & Extensions','Tuna Browser','Tuna-Browser','Browse the web with Tuna'],
['Browse & Extensions','Dark Search Extension','dark-search-extention','Search companion extension'],
['Browse & Extensions','TruthMeta','TruthMeta','Metadata and verification tools'],
['BareBones Tools & Services','BareGreyscale UV Wrapper','BareGreyscale-UV-Wrapper','UV workflow utilities'],
['BareBones Tools & Services','Bare Icon3','Bare-Icon3','Icon creation toolkit'],
['BareBones Tools & Services','BareKit','BareKit','Production toolkit'],
['BareBones Tools & Services','BareMark','BareMark','Writing and markup tools'],
['BareBones Tools & Services','BareCube','BareCube','3D creation utilities'],
['BareBones Tools & Services','Bare UV Wrapper','Bare-UV-Wrapper','3D UV mapping workflow'],
['BareBones Themes','Obsidian Bruth','BareThemes-Obsidian-Bruth','Obsidian workspace theme'],
['BareBones Themes','macOS Tahoe','BareThemes-macOS-Tahoe','Desktop appearance theme'],
['BareBones Themes','Blender Active','BareThemes-Blender-Active','Blender workspace theme'],
['Plugins','ALT Atlas Obsidian Plugin','obsidian-plugins-alt-atlas','ALT Atlas workflow plugin']
];
export const catalog=Object.freeze(records.map(([group,name,slug,description])=>Object.freeze({group,name,slug,description,url:repositoryURL(slug)})));
