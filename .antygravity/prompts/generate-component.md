# Generate PrismUI Component

Please generate a new PrismUI component using the provided template (`.antygravity/templates/prism-component.ts`).
Make sure to:
1. Inherit from `LitElement` and use the `@customElement` decorator.
2. Include `sharedStyles` in the static styles array to enable Tailwind CSS styling.
3. Use Glassmorphism utility classes (`backdrop-blur-*`, `bg-white/30`, `border-white/20`, etc.).
4. Support dark mode with `dark:` variants.
5. Create a comprehensive implementation focusing on robust admin panel UI requirements.
6. Design components to be as **stateless** as possible. They should be "dumb" presentational components that receive data via `@property()` parameters and emit state changes via `CustomEvent`.
7. Always expose a way to pass custom CSS classes to the component's inner elements (e.g., via a `customClass` property or `part` attributes).