# Lit Best Practices

1. **Reactivity**: Use `@property` and `@state` decorators to manage reactive state. Only primitive types or immutable objects should be used to ensure changes are detected.
2. **Lifecycle**: Use `firstUpdated` or `updated` for DOM manipulations that can't be handled by the template. Avoid overriding `render()` with side effects.
3. **Events**: Use custom events for component communication. Dispatch `CustomEvent` with composed and bubbles set to true when the event needs to cross the shadow DOM boundary.
4. **Shadow DOM**: Keep styles encapsulated. Rely on the injected Tailwind CSS (`sharedStyles`) and use host contexts (`:host`, `:host([active])`) to style the component wrapper itself.
5. **Slots**: Use `<slot>` elements to allow consumers to pass custom content into the components.
6. **Accessibility (a11y)**: Ensure standard ARIA attributes are reflected or set properly within the shadow DOM or on the host element.