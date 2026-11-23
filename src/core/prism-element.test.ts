import { describe, expect, it } from 'vitest';
import { html } from 'lit';
import { PrismElement } from './prism-element.js';
import { hoistPropertyRules, hoistedPropertyCount } from './global-styles.js';
import { fixture } from '../../test/helpers/index.js';
import '../../test/fixtures/prism-test-field.js';

class PrismSmokeElement extends PrismElement {
  static override tagName = 'prism-smoke-element';
}

describe('PrismElement', () => {
  it('define() registers once and is idempotent', () => {
    const first = PrismSmokeElement.define();
    expect(customElements.get('prism-smoke-element')).toBe(PrismSmokeElement);
    expect(() => PrismSmokeElement.define()).not.toThrow();
    expect(PrismSmokeElement.define()).toBe(first);
  });

  it('define() accepts a custom tag', () => {
    class PrismOther extends PrismElement {
      static override tagName = 'prism-other-element';
    }
    PrismOther.define('acme-other-element');
    expect(customElements.get('acme-other-element')).toBe(PrismOther);
  });

  it('adopts the shared base stylesheet in an open shadow root', async () => {
    const el = await fixture(html`<prism-test-field label="Name"></prism-test-field>`);
    expect(el.shadowRoot).not.toBeNull();
    const css = [...el.shadowRoot!.adoptedStyleSheets].flatMap((s) => [...s.cssRules].map((r) => r.cssText)).join('\n');
    expect(css).toContain('.sr-only');
    expect(css).toContain('--prism-focus-ring-outer');
  });

  it('compiles Tailwind per component, mapped on --prism-* tokens (spike F0-a)', async () => {
    const el = await fixture(html`<prism-test-field label="Name"></prism-test-field>`);
    const css = [...el.shadowRoot!.adoptedStyleSheets].flatMap((s) => [...s.cssRules].map((r) => r.cssText)).join('\n');
    expect(css).toContain('var(--prism-glass-surface-solid-1)'); // @utility glass-1
    expect(css).toMatch(/\.gap-1\s*\{[^}]*var\(--prism-space-unit\)/); // --spacing -> token
    expect(css).not.toMatch(/\.grid\s*\{/); // utilities not used by this component are not shipped
    expect(css).not.toMatch(/--color-blue-500/); // default palette is reset
  });

  it('hoists @property rules to the document once (tailwindcss#15005 mitigation)', () => {
    const rule = '@property --tw-test-x { syntax: "*"; inherits: false; initial-value: 0; }';
    const before = hoistedPropertyCount();
    expect(hoistPropertyRules(`a{} ${rule} b{}`)).toBe(1);
    expect(hoistPropertyRules(rule)).toBe(0);
    expect(hoistedPropertyCount()).toBe(before + 1);
  });
});
