# Language and Commenting Standards

To maintain a professional, accessible, and highly readable codebase for PrismUI, the following rules MUST be strictly adhered to when generating or refactoring code:

## 1. English-Only Policy
- **Code**: All variable names, function names, class names, file names, and string literals (unless specific to a localized UI) must be written in **English**.
- **Comments and Documentation**: All inline comments, JSDoc blocks, PR descriptions, and markdown documentation MUST be written in **English**.

## 2. Mandatory and Extensive Commenting
PrismUI is intended to be read and used by other developers. Therefore, the code must be self-explanatory and heavily documented.
- **JSDoc for Public APIs**: Every exported class, method, type, interface, and property MUST have a complete JSDoc comment explaining its purpose, parameters, and return types.
- **Inline Comments**: Use inline comments to explain *why* a specific approach was taken, especially for complex UI logic, state management, or Tailwind utility combinations.
- **Component Documentation**: Each component file should start with a block comment describing what the component is, its use cases in an Admin Panel context, and any specific behaviors (like Glassmorphism quirks).

Example:
```typescript
/**
 * Represents the primary action button for PrismUI forms.
 * Designed with a glassmorphism aesthetic suitable for admin dashboards.
 */
@customElement('prism-button')
export class PrismButton extends LitElement {
  // ...
}
```
