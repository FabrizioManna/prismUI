# Rule: NPM Audit Policy

Running `npm audit fix --force` is **STRICTLY FORBIDDEN** unless you are targeting a single, fully isolated package with no peer dependencies.

## Guidelines
1. **Never use `--force` on monorepos**: Libraries like Storybook, Vite, and Lit have complex peer-dependency webs. Running `npm audit fix --force` will forcefully downgrade or upgrade major versions (e.g., Storybook 8 to 7), causing critical build failures and destroying the `node_modules` ecosystem.
2. **Accept DevDependency Vulnerabilities**: Security vulnerabilities in `devDependencies` (like `esbuild` or `babel/traverse` used inside Storybook or Vite) are extremely common and rarely exploitable in a production frontend, as these tools run on the developer's local machine or CI/CD pipelines, not in the browser. You must ignore these or only use `npm audit fix` (without `--force`).
3. **Use Overrides**: If a vulnerability in a dependency absolutely must be fixed, use the `"overrides"` or `"resolutions"` field in `package.json` to safely patch the sub-dependency without wrecking the main framework.
