/** Returns the focused element, descending into open shadow roots. */
export function deepActiveElement(root: Document | ShadowRoot = document): Element | null {
  let active = root.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}
