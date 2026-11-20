# Remedy Launcher visual theme: Midnight Blue 01

**Status:** approved visual direction, implemented as browser-preview UI, awaiting PR verification. This is not a native Windows/macOS/Linux launcher distribution.

## Design lock
Selected visual direction: the dark-blue Remedy Launcher desktop concept. Retain these core properties through alpha unless a new visual review approves changes.

| Token / component | Specification |
| --- | --- |
| Base background | `#030b14` |
| Panel background | `#081726` |
| Deep surface | `#0b1d30` |
| Accent blue | `#0788f9` |
| Cyan focus | `#42caff` |
| Text | `#edf6ff` |
| Typography | System UI / Inter fallback, large clear hero title, compact card metadata |
| Shell | 222px desktop sidebar, responsive icon rail on narrower widths |
| Hero | Local `hero-landscape.svg` and custom `remedy-mark.svg`, no remote image dependencies |
| Cards | Raised navy panels, subtle cyan edge, title, description, external repository action |
| Bottom dock | Persistent visual download-status region, explicitly zero active transfers |

### Actual interactions
- Section navigation: Home, Library, Updates, Repositories, Extensions, Tools, Themes, Settings.
- Search filters the 13 known repository cards; Ctrl/Cmd+K focuses search; Escape clears.
- Cards open the correct `BareBones-Projects` GitHub repository using safe external links.
- Folder selection only lists names and sizes in the user's browser; no file upload is made.
- A support form posts only if the deployment provides the corresponding API endpoint. Local preview does not offer the endpoint.

### Not shipped
No installed-version detection, automatic updater, arbitrary application launch, download queue, package installation, provider sign-in, rollback button or privileged operation exists in this UI. The download dock and project status are informational, not simulated progress. No release is certified merely by previewing cards.

## Run for review
```sh
node --version
npm run check
npm test
npm run preview
# open http://127.0.0.1:8765/
```
Requires Node.js >=20 and a modern desktop browser. The preview server binds loopback only and does not provide an upload or write API.

## Acceptance checks
- At 1600×900, hero, sidebar, first project row and dock should be immediately visible.
- At 840px/540px breakpoints, navigation collapses into an icon rail; all 13 cards remain accessible.
- All cards remain keyboard-focusable and external links use `noopener noreferrer`.
- Search, filters, direct repository navigation and local folder preview work without external API calls.
- Reduce-motion preference disables visual transitions.
- The only footer legal control is a text link to the BareBones legal-page repository.
- CI tests must pass for the exact pull request commit; manual browser screenshots and native OS tests are separate release evidence.

BareBones Projects, Designed by: Justin Levesque-Welsch.
