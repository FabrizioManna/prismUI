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

4. **Stateless Design by Default**:
   - Components should be as stateless (presentational) as possible. Avoid maintaining internal state for things that can be passed down as parameters.
   - Rely strictly on `@property()` to read data from the parent, and dispatch events to let the parent handle the logic.

5. **CSS Class Injection**:
   - Always provide a way to pass external classes to the component's internal elements. Use a property like `@property({ type: String }) customClass = '';` and apply it to the main inner wrapper using `classMap` or template literals, or expose CSS `part` attributes on key elements.