# Managed installation CLI (alpha)
This tool stores a **verified file** in a user-scoped version store. It is not a native package installer and does not execute the file.

## Run
```sh
npm run check
npm test
npm run manage -- status
npm run manage -- install --manifest ./release.json --keys ./trusted-keys.json --artifact ./remedy.bin --channel beta --yes
npm run manage -- update --manifest ./release2.json --keys ./trusted-keys.json --artifact ./remedy.bin --channel beta --yes
npm run manage -- rollback --yes
npm run manage -- uninstall --yes
```
`--yes` explicitly authorizes the named mutation. Omit it for guaranteed refusal. `--root` overrides the default managed directory for test environments. Verify public signing keys by an independent trusted source; do not download keys from the same untrusted location as a manifest and call them trusted.

No signed artifacts or trusted release keys are currently published by this PR. Do not treat example values as genuine release material. For production, maintain a locked trust store, enforce update monotonicity and scope directory permissions before enabling unattended or remotely fetched content. Rollback currently changes only the active managed-version pointer; it does not roll back native operating-system packages or application data schema migrations.

## Tests
Run `node --test tests` for signing, tamper detection, consent, channel checks, install/update/uninstall and rollback. CI builds an **unsigned source tarball**, not an executable installer.
BareBones Projects, Designed by: Justin Levesque-Welsch.
