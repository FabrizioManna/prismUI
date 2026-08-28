# Rule: Documentation Updates

Whenever a new component is created or an existing component is significantly modified, you **MUST** automatically update the corresponding documentation files in the `docs/components/` directory without waiting for explicit user prompts.

## Guidelines
1. **Identify the Category**: Determine if the component belongs to Form (`form.md`), Navigation (`navigation.md`), or Layout/Overlays (`layout.md`).
2. **Update the List**: Ensure the component name is added to the "Available Components" list.
3. **Keep it Synced**: The VitePress documentation (`docs/`) must always reflect the current state of the `src/components/` directory and the main `README.md`.
