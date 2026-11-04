# Remedy Launcher // Alpha CLI

Companion to [Tuna Browser](https://github.com/BareBones-Projects/Tuna-Browser).

This repository now contains an **initial executable Node.js CLI**, with read-only release URL discovery and platform identification. It is not yet a GUI installer, updater, or package manager.

## Run
```sh
npm run check
npm test
npm run start -- status
npm run start -- releases-url
npm run start -- browser-bridge
```

`browser-bridge` fetches and validates Tuna Browser’s pinned bridge manifest from its public repository. It only reports the supported protocol and argument contract; it does not launch or install the browser. No GitHub token is required. No downloads, installations, updates, or privileged operations are performed by this command. Cross-platform CI checks are in `.github/workflows/verify.yml`.

## Security boundary
The launcher must never request browser vault keys, cookies, tokens, or browsing history. Future release downloads must verify hashes/signatures before execution and require user confirmation.

License: Apache-2.0 (see LICENSE).

---

## // Alpha readiness · 2026-10-31

This repository is undergoing pre-alpha verification. The presence of source files, illustrative screenshots, or release notes is **not** evidence that every platform build, deployment, security property, or runtime feature has passed testing.

See [the repository-specific alpha audit](docs/ALPHA_READINESS_AUDIT.md) for verified source-inventory findings, unresolved gaps, suggested pull requests, testing requirements, packaging criteria, and related project conversation topics. Review the checked-in implementation and passing test results before promoting the current work to an alpha release.

**Contribution workflow:** work on review branches, attach test evidence and sample artifacts to pull requests, and merge only after acceptance. Avoid committing credentials, transient databases, real personal information, or generated caches.

---

## // Alpha readiness · 2026-10-31

Current documentation and source are **not proof of production or cross-platform release readiness**. See [the repository-specific alpha audit](docs/ALPHA_READINESS_AUDIT.md) for known gaps, priority work, test gates, package validation and related project context. All build, packaging, privacy and security claims must be verified with actual tests before tagging an alpha release.

Contribute through review branches and PRs; attach reproducible commands, CI results, screenshots and artifact checksums where applicable. Never commit credentials, personal records, generated caches or transient database files.
