# Rule: Commit Conventions

All git commits must strictly follow the **Conventional Commits** specification and be written entirely in **English**.

## Guidelines
1. **Language**: All commit messages (subject and body) must be in English.
2. **Format**: `<type>[optional scope]: <description>`
3. **Types**:
   - `feat:` for new features (e.g., adding a new UI component).
   - `fix:` for bug fixes.
   - `docs:` for documentation changes (e.g., updating README or Storybook MDX).
   - `style:` for formatting, missing semi-colons, etc. (no code change).
   - `refactor:` for refactoring production code.
   - `test:` for adding missing tests or correcting existing tests.
   - `chore:` for updating build tasks, package manager configs, etc.
4. **Best Practices**:
   - The description must be in the imperative, present tense ("add feature" not "added feature" or "adds feature").
   - Do not capitalize the first letter of the description.
   - No dot (`.`) at the end of the description.
