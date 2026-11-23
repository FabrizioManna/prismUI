import { describe, it } from 'vitest';
import { html } from 'lit';
import { expectNoA11yViolations, fixture } from '../helpers/index.js';
import '../fixtures/prism-test-field.js';

describe('axe smoke (infrastructure)', () => {
  it('a labelled test field has no serious/critical violations in light and dark', async () => {
    const form = await fixture(
      html`<form><prism-test-field name="n" label="Name" value="x"></prism-test-field></form>`,
    );
    await expectNoA11yViolations(form);
    document.documentElement.classList.add('dark');
    await expectNoA11yViolations(form);
  });
});
