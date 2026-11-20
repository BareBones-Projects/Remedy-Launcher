# Development

## Requirements
Node.js 20 or 22, npm matching the installed Node distribution, Git; network optional for local tests. No third-party npm runtime dependencies are declared in the current package manifest.

```sh
git clone https://github.com/BareBones-Projects/Remedy-Launcher.git
cd Remedy-Launcher
node --version
npm --version
git rev-parse HEAD
npm run check
npm test
node src/cli.js status
node src/cli.js releases-url
node src/manage-cli.js help
npm pack --dry-run
```

Do not use `npm install` with arbitrary remote package scripts or execute downloaded build artifacts as an untrusted user. Record commit SHA, exact Node/npm versions, platform and full CI job URL in any release report.

The `public/` files are a static browser preview. If running a local HTTP server, use a local-only interface; the UI's support endpoint may not be implemented. Do not claim OAuth or installation works just because controls appear on screen.

## Contributing
Use feature branches and PR reviews. Never commit credentials, signing private keys, personal records, caches or temporary installation state. Document signed manifest schema changes and add rejection tests before promoting a new format.

BareBones Projects, Designed by: Justin Levesque-Welsch.
