# Accessibility (A11y) & WCAG 2.1 AA Standards

Every PrismUI component MUST be fully accessible. Do not generate a component without implementing the following rules:

1. **Semantic HTML inside Shadow DOM**:
   - Always use native semantic tags (`<button>`, `<dialog>`, `<nav>`, `<ul>`, `<li>`) instead of generic `<div>` elements with click handlers.
   
2. **Keyboard Navigation & Focus Management**:
   - All interactive elements must be reachable via the `Tab` key.
   - Use `delegatesFocus: true` in the `@customElement` shadow root configuration if the component wraps a native focusable element (like an input).
   - Never remove `outline` without providing a visible focus fallback (e.g., Tailwind's `focus-visible:ring-2`).
   - Complex components (Modals, Dropdowns) must implement "Focus Trapping" (preventing focus from leaving the modal while open) and close on `Escape` key press.

3. **ARIA Attributes**:
   - Use `aria-expanded="true/false"` for accordions, dropdowns, and sidebars.
   - Use `aria-hidden="true"` for purely decorative icons.
   - Use `aria-label` or `aria-labelledby` when a button or input lacks visible text (e.g., an icon-only button).
   - Use `aria-invalid="true"` and `aria-describedby` for form inputs with validation errors.

4. **Glassmorphism Contrast**:
   - Ensure text over glass backgrounds maintains a minimum contrast ratio of 4.5:1. 
   - Rely on the design tokens in `03-glass-design-system.md` to ensure contrast compliance in both light and dark modes.