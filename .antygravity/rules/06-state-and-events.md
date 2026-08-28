# State Management & Data Flow

1. **"Data Down, Events Up" Principle**:
   - Components should be "dumb" whenever possible. They receive data via `@property()` and communicate user actions to the outside world via Custom Events.
   - Do not mutate a `@property()` from inside the component. Instead, dispatch an event to request the parent to change it.

2. **Standardized Custom Events**:
   - All custom events dispatched by PrismUI components must be prefixed with `prism-` to avoid naming collisions (e.g., `prism-change`, `prism-click`, `prism-close`).
   - Boilerplate for dispatching events:
     ```typescript
     this.dispatchEvent(new CustomEvent('prism-action', {
       detail: { value: this.currentValue },
       bubbles: true,     // Allows event to bubble up the DOM tree
       composed: true,    // CRITICAL: Allows event to pierce the Shadow DOM boundary
       cancelable: true   // Allows consumers to call e.preventDefault()
     }));
     ```

3. **Boolean Properties**:
   - For boolean attributes (e.g., `disabled`, `loading`, `checked`), always configure the property as `@property({ type: Boolean, reflect: true })`. This ensures the HTML attribute is updated alongside the JavaScript state, which is crucial for CSS attribute selectors.