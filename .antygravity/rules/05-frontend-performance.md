# Frontend Performance & Memory Management

1. **Efficient Re-rendering (Lit)**:
   - Avoid passing complex objects directly to inline event handlers in the `render()` method, as this creates new function references on every render.
   - Use Lit's `@query()` and `@queryAsync()` decorators to cache DOM references instead of calling `this.shadowRoot.querySelector()` manually.
   - Mutating an array or object does not trigger a re-render in Lit. ALWAYS return a new reference (e.g., `this.items = [...this.items, newItem]`) to trigger updates.

2. **Event Listener Cleanup**:
   - If you attach a global event listener (e.g., `window.addEventListener('resize', handler)` or `document.addEventListener('click', handler)`), you MUST remove it in the `disconnectedCallback()` lifecycle method to prevent memory leaks.

3. **CSS Performance**:
   - Use Tailwind utility classes instead of inline `style="..."` attributes. Inline styles cause unnecessary browser reflows/repaints.
   - Avoid deep CSS nesting inside the Shadow DOM; rely on utility classes applied directly to elements.

4. **Lazy Loading**:
   - If a component uses heavy external assets (like charting libraries or heavy SVGs), implement dynamic imports `import()` to lazy-load the dependency only when the component is connected to the DOM.