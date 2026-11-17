# Architecture

## Implemented components
- `src/cli.js`: read-only status, latest-release metadata discovery and browser bridge inspection.
- `src/manifest.js`: allowlisted GitHub release URL and Tuna Browser bridge contract validation.
- `src/signed-install.js`: Ed25519 manifest validation, SHA-256, user-scoped managed artifact staging, state rollback, and uninstall of active staged artifact.
- `src/manage-cli.js`: explicit-consent CLI for the experimental managed artifact workflow.
- `public/index.html`, `public/app.js`, `public/style.css`: web preview, outbound catalog links, user-selected local folder listing and support form.
- `config/ecosystem.json`: canonical grouped catalog inventory (mirrored into browser JavaScript for standalone static hosting); keep both in sync.
- `config/repositories.json`, `api/openapi.yaml`: server/repository metadata contracts, not proof that a hosted backend is available.
- `tests/`: Node's built-in test runner; `.github/workflows/`: CI.

## Boundaries
There is no privileged native installer executor in the current application. The managed installer stages a verified artifact in a versioned user directory; it does not execute it, register an app with the OS, create system services or install a browser extension. The web catalog only navigates to GitHub repository pages.

The UI uses GitHub Open Graph preview images loaded from GitHub at runtime. Broken/unavailable thumbnails degrade to text cards; there is no bundled screenshot set or validated publisher media.

BareBones Projects, Designed by: Justin Levesque-Welsch.
