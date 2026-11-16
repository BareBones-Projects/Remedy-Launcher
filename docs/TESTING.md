# Testing and evidence

## Repeatable checks
```sh
node --version
npm --version
npm run check
npm test
npm run start -- status
npm pack --dry-run
```
Run on clean x64/arm64 Windows, macOS and Linux hosts where available, retaining stdout/stderr, exact runtime versions, commit SHA and exit codes. GitHub matrix CI tests Node 20/22 on Windows/macOS/Linux runners, but do **not** substitute for native package installation tests.

## Negative paths
Tests must reject unsupported OS/architecture, arbitrary release hosts/repos, mismatched release tag and filename, prerelease when stable is expected, unexpected bridge protocol, invalid signatures, unsigned payloads, tampered artifacts, wrong channel/platform, missing explicit consent and corrupted rollback payloads. Run managed-install filesystem tests in temporary directories only. Add regression tests for symlink parents, rollback state corruption, interrupted installs, permission denial and concurrent updates before release.

## Current limitations
- Automated Node tests validate a narrow managed-file state machine, **not** OS installer/uninstaller semantics.
- No clean-machine notarization, Authenticode, AppImage/DEB installer run, uninstall or rollback evidence is included in this documentation.
- A passing source-packaging job confirms a tarball and checksum, not origin signing or malware safety.
- Screenshot acceptance requires a real served UI capture and explicit browser/version; the existing SVG is a design preview.

Check [workflow runs](https://github.com/BareBones-Projects/Remedy-Launcher/actions) and the individual commit's jobs rather than assuming all changes passed.

BareBones Projects, Designed by: Justin Levesque-Welsch.
