# Decisions and pending approvals

## Proposed application identity
Display: **Remedy Launcher**. Linux desktop ID: `org.barebones.remedylauncher`; macOS bundle ID: `org.barebones.RemedyLauncher`; Windows application ID: `BareBonesProjects.RemedyLauncher`. These are **proposals** until confirmed against any previously shipped Bones Launcher IDs and signed release inventory.

## Legacy migration
Never automatically read, rename, delete or overwrite Bones Launcher configuration. Only offer dry-run discovery followed by explicit consent and copy-only backups when a verifiable archive / installed version exists. Migration code and fixtures are not yet available; this blocks any migration claim.

## Permission model
Default to per-user, least-privilege managed data under `~/.remedy-launcher/managed`. Explicit `--yes` applies to each managed operation. Native package execution is a separate privileged OS-specific flow that does not exist in this PR.

## Update channels and authenticity
Stable default policy; beta/nightly opt-in. Treat key IDs as identifiers, not trust roots. Production signing trust must be pinned independently; define rotation/revocation, minimum supported versions and anti-rollback before release. A correct SHA-256 digest does not establish that bytes are safe.

## Directory UX
Use image-backed **outbound GitHub repository cards** for all user-requested sections, not fake install buttons. A repo page is not a verified package installer. Broken Open Graph images use text fallback. The sole footer legal reference is an ordinary text link.

BareBones Projects, Designed by: Justin Levesque-Welsch.
