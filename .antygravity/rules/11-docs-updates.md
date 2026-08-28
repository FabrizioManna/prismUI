# Rule: Storybook Documentation Updates

Whenever a new component is created, you **MUST** automatically create a `.stories.ts` file alongside it (e.g. `prism-button.stories.ts`) without waiting for explicit user prompts.

## Guidelines
1. **Custom Elements Manifest**: We use `@custom-elements-manifest/analyzer` which runs automatically before Storybook starts. This parses all `@property`, `@state`, and JSDoc comments to generate API tables.
2. **Write Good JSDoc**: Because of the analyzer, it is strictly mandatory to write detailed JSDoc comments for the class, and every `@property`.
3. **Basic Story**: Every component must have a default story that exports its typical usage. You do not need to document the API manually in the story, Storybook does it automatically via `custom-elements.json`.
4. **Auto-Scaffolding**: Always check if a component is missing its `.stories.ts` file. If multiple are missing, you can run `npm run scaffold:stories` to generate boilerplate stories for all undocumented components automatically.
