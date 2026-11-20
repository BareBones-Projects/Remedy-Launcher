# Security policy

## Supported versions and branches
| Version / branch | Security support | Notes |
| --- | --- | --- |
| `main` | Best-effort development fixes | Not a production release |
| `feat/signed-managed-installs-20261114` | Review only | Experimental signed-manifest and managed-file workflow |
| `0.10.3-alpha.1` (source) | Pre-release, no production security guarantee | Inspect matching CI run and commit |
| Historical Bones Launcher builds | Unsupported / unverified | No verified migration path |
| Future stable / beta / nightly packages | Not yet released by this PR | No supported native installer claim |

## Vulnerability reporting
Use the repository's [private security advisory flow](https://github.com/BareBones-Projects/Remedy-Launcher/security/advisories/new) if enabled. If it is unavailable, contact maintainers privately through an established project contact. **Do not publish exploit details, credentials, private tokens or personal data in public issues.** We do not promise a response SLA without a staffed security program.

## Threat model and requirements
- Ed25519 signed manifest protects manifest provenance only when the trust root was independently pinned and authenticated. Never accept an arbitrary downloaded key as trusted.
- SHA-256 verifies artifact bytes and expected size, not absence of malware. Signed malicious code remains malicious.
- Explicit `--yes` consent is required for local managed operations; no elevation, OS installer execution or silent updates are supported.
- Validate product, channel, OS, architecture, artifact name, checksum, size, version and signing key. Reject traversal, symlinks and inconsistent rollback receipts; security review of nested symlink paths and race conditions remains necessary.
- Scope operations to user-owned managed directories. No browser tokens, cookies, vault secrets or history may be collected.
- Production key rotation/revocation, downgrade/replay prevention, trusted release infrastructure, software signing/notarization, SBOM, clean-VM validation and supply-chain checks remain release blockers.

## Branch / release security gate
Changes flow through reviewed pull requests into `main`; successful **current-commit** CI plus negative-path and clean-machine evidence are required before any release. Branch names are not update channels: `stable`, `beta` and `nightly` are **manifest fields**, and shipping them requires separately signed, tested artifacts. Do not merge or publish based on source presence alone.

See [release checklist](docs/RELEASE.md), [test plan](docs/TESTING.md), and [decisions](docs/DECISIONS.md).

BareBones Projects, Designed by: Justin Levesque-Welsch.
