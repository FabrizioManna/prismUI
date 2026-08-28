# Code Style, TypeScript & Documentation

1. **Strict TypeScript**:
   - Do not use `any`. Always define proper interfaces or types for complex objects, event details, and component properties.
   - Use early returns to avoid deep nesting (e.g., `if (!this.isOpen) return html``;`).

2. **JSDoc & Custom Elements Manifest**:
   - Every component class, public property, and custom event MUST have a JSDoc comment. This is mandatory because VitePress/Storybook will parse these comments to auto-generate the documentation UI.
   - Example format:
     ```typescript
     /**
      * A glassmorphism styled button component.
      * 
      * @fires prism-click - Dispatched when the button is clicked.
      * @slot - The default slot for button text.
      * @slot icon - The slot for leading icons.
      */
     @customElement('prism-button')
     export class PrismButton extends LitElement {
       /**
        * The visual variant of the button.
        */
       @property({ type: String }) variant: 'primary' | 'secondary' | 'ghost' = 'primary';
     }
     ```

3. **File Naming Conventions**:
   - Component files: Kebab-case, matching the tag name (e.g., `prism-button.ts`).
   - Interfaces/Types: PascalCase (e.g., `PrismButtonProps.ts`).
   - Do not use default exports for components; always use named exports to facilitate tree-shaking.