# Rule: Dependency Cleanup

Whenever a library or dependency is uninstalled or removed from the project, you **MUST** actively search for and remove all remaining references to that library across the entire codebase.

## Guidelines
1. **Search**: Use global search to find any lingering imports, configuration files, or mentions of the library.
2. **Scripts & CI/CD**: Check `package.json` scripts and GitHub Actions workflows (e.g., `.github/workflows/deploy.yml`) to ensure no commands related to the removed library are still being executed.
3. **Leftover Files**: Delete any configuration files specific to that library (e.g., if VitePress is removed, delete the `docs/` folder).
