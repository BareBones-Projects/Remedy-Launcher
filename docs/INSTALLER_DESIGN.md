# Remedy Launcher: installer and identity design
Status: implementation foundation, not a certified native installer. 2026-11-14.

## Recovery of former Bones Launcher sources
Searched known GitHub accounts/organization for a distinct BonesLauncher repository and referenced existing Remedy Launcher pull requests. No standalone BonesLauncher repository was confirmed. A search result is not proof that no local archives, releases, remote branches, or backups exist. Do not manufacture or overwrite legacy identity data; import it only after a verifiable archive has been located and inspected.

## Targets and install policy
- Linux x64/arm64: AppImage (portable) and DEB (system package), subject to native packaging tests.
- Windows x64/arm64: signed installer EXE, subject to Authenticode/SmartScreen testing.
- macOS x64/arm64: signed and notarized DMG or ZIP, subject to Gatekeeper testing.
- Managed CLI foundation: user-scoped versioned files under `~/.remedy-launcher/managed`; no elevation, package manager commands, installer execution, or autostart.
- Native package deployment is not implemented by the managed CLI. The CLI stages one authenticated, local regular file and switches an active-version state record. External package managers must be integrated separately after review.

## Channels and update policy
stable is default public release policy, beta is opt-in preview, nightly is opt-in development. Each signed manifest explicitly carries the chosen channel. No unattended updates, downgrade, or channel switching. Pin a release identity, inspect release notes, confirm permissions and request explicit consent before applying. Stable is not implied by the GitHub latest tag alone.

## App identity and legacy migration
New display name: Remedy Launcher. Proposed desktop identifiers: `org.barebones.remedylauncher` for Linux, `org.barebones.RemedyLauncher` for macOS, `BareBonesProjects.RemedyLauncher` for Windows. These are proposals; preserve any existing IDs already shipped to users until verified. Do not silently move, delete, or read old Bones Launcher profiles. Migration requires source-version detection, copy-only dry run, user confirmation, and reversible mapping; legacy discovery is currently unresolved.

## Signed manifest contract
JSON envelope: `{ "payload": { "schema":1, "product":"Remedy Launcher", "version":"1.0.0", "channel":"beta", "platform":"linux", "arch":"x64", "artifact": { "file":"remedy.bin", "size":123, "sha256":"<64 lowercase hex>" } }, "keyId":"release-2026", "signature":"<base64>" }`.
The signature is Ed25519 over UTF-8 bytes of canonical JSON encoding of `payload`: recursively sorted object keys, array order unchanged, no whitespace. Only checked-in, independently approved public signing keys should be trusted in production. The CLI takes a local public-key mapping for testability; user-supplied key paths are **not** a secure distribution trust anchor on their own. Never bundle private signing keys into releases. Key rotation and revocation require an approved policy.

Hash matching is not malware scanning. Signature verification establishes origin from a configured trusted key, not whether the signed payload is benign. Do not automatically execute verified payloads.

## Transaction boundaries
For user-scoped managed files, verify signature, target and entire artifact before writing; stage in a temporary directory; rename to versioned directory; atomically switch state; retain previous version for rollback. Rollback checks the prior stored hash before switching. Uninstall removes only the active version directory and resets active state; it does not remove other versions, profiles or user data. Never delete outside a controlled path.

## Release gates still open
- Full legacy source/backup inventory, identity verification and migration test fixtures.
- Define pinned production trust root and key revocation; test forged manifests, replay/downgrade and TOCTOU threats.
- Signed Windows EXE, macOS notarized package, and Linux AppImage/DEB builds.
- Real clean-VM package install/uninstall and rollback tests, including OS permission prompts.
- End-to-end functional Tuna Browser integration and explicit UX permissions.
- Security review and CI evidence before promoting this foundation beyond alpha.
BareBones Projects, Designed by: Justin Levesque-Welsch.
