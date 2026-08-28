# Architecture Rule: PrismUI

PrismUI is a framework-agnostic UI component library built for modern Admin Panels and Dashboards.
- **Core Technology**: Lit (`lit`) with TypeScript.
- **Styling**: Tailwind CSS v3 via Vite inline imports.
- **Build Tool**: Vite (library mode).
- **Design System**: Glassmorphism.

## Component Structure
Each component must:
1. Extend `LitElement`.
2. Apply the `@customElement` decorator with prefix `prism-`.
3. Import and inject `sharedStyles` which contains Tailwind utilities.
4. Export the class and potentially its types.

## Styling Injection (Tailwind in Shadow DOM)
We use Vite's `?inline` capability to import Tailwind CSS as a string and wrap it in Lit's `unsafeCSS`.
Components should always include `sharedStyles` in their static styles array:
```ts
static styles = [sharedStyles, css`...`];
```