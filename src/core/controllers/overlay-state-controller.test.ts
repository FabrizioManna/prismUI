import { describe, expect, it } from 'vitest';
import { html } from 'lit';
import { fixture, recordEvents, settle } from '../../../test/helpers/index.js';
import '../../../test/fixtures/prism-test-overlay.js';
import type { PrismTestOverlay } from '../../../test/fixtures/prism-test-overlay.js';

describe('OverlayStateController (controlled open/close)', () => {
  it('emits prism-open-request without opening by itself', async () => {
    const el = await fixture<PrismTestOverlay>(html`<prism-test-overlay></prism-test-overlay>`);
    const events = recordEvents(el, ['prism-open-request', 'prism-open']);
    el.shadowRoot!.querySelector<HTMLButtonElement>('[part=trigger]')!.click();
    await settle(el);
    expect(events.types()).toEqual(['prism-open-request']);
    expect((events.log[0]!.event as CustomEvent).detail).toEqual({ reason: 'trigger' });
    expect(el.open).toBe(false);
  });

  it('emits prism-open / prism-close only when `open` really changes, with the last reason', async () => {
    const el = await fixture<PrismTestOverlay>(html`<prism-test-overlay></prism-test-overlay>`);
    const events = recordEvents(el, ['prism-open-request', 'prism-close-request', 'prism-open', 'prism-close']);
    el.addEventListener('prism-open-request', () => (el.open = true));
    el.shadowRoot!.querySelector<HTMLButtonElement>('[part=trigger]')!.click();
    await settle(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('[part=close]')!.click(); // ignored request
    await settle(el);
    expect(el.open).toBe(true);
    el.open = false; // API change
    await settle(el);
    expect(events.log.map((e) => `${e.type}:${(e.event as CustomEvent).detail.reason}`)).toEqual([
      'prism-open-request:trigger',
      'prism-open:trigger',
      'prism-close-request:close-button',
      'prism-close:close-button',
    ]);
  });
});
