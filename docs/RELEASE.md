# Release and packaging plan

## Target matrix (planned, not shipped)
| OS | Architectures | Planned artifact | External requirements |
| --- | --- | --- | --- |
| Windows | x64, arm64 | signed EXE | publisher certificate, Authenticode, installer + rollback VM |
| macOS | x64, arm64 | signed/notarized DMG or ZIP | Developer ID, notarization, Gatekeeper |
| Linux | x64, arm64 | AppImage and DEB | runtime compatibility and package-manager install/remove tests |

The current CI produces an unsigned **npm source tarball** plus SHA256SUMS.txt. No native OS installer has been verified.

## Channels and identity
`stable` is for reviewed production, `beta` for opt-in previews and `nightly` for opt-in development. No silent switching, auto-elevation, unattended installation, or downgrade. See [decisions](DECISIONS.md).

## Manifest and distribution
Build artifacts for each OS/arch, calculate exact SHA-256 and byte length, sign canonical manifest payload with an approved offline-protected Ed25519 key, publish the signed envelope and pinned public trust root separately, and only then permit user-confirmed install. Checksums do not scan malware. Generate SBOM and audit dependencies. A missing signature, wrong host, or untrusted key must hard-fail.

## Required acceptance gates before alpha
1. Fix all YAML parsing and verify jobs; attach passing run URLs for the **head commit**.
2. Complete negative-path threat assessment, static audit, supply-chain review, version rollback/replay controls and trust-root/key rotation plan.
3. Build platform-specific installers on clean pinned environments. Record commands, OS image, tooling exact versions, failures and logs.
4. Test explicit consent and install/update/uninstall/rollback in clean VMs per platform; verify no unexpected system-wide privilege.
5. Publish release notes, real screenshots, signed manifests and SHA256SUMS.txt for actual artifacts.
6. Promote via reviewed PR only when all gates pass; otherwise remain draft.

Source staging and state rollback are **not** proof of native installer rollback.

BareBones Projects, Designed by: Justin Levesque-Welsch.
