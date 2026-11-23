import { describe, expect, it } from 'vitest';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { PrismElement } from './prism-element.js';
import { PrismAnnouncer } from './a11y/announcer.js';
import { AriaMirror } from './a11y/aria-mirror.js';
import { LocalizeController } from './i18n/localize-controller.js';
import { HasSlotController } from './controllers/has-slot-controller.js';
import { IdController } from './controllers/id-controller.js';
import { MediaQueryController } from './controllers/media-query-controller.js';
import { fixture, settle } from '../../test/helpers/index.js';
import type { PrismStrings } from './i18n/i18n.js';

class PrismInfraProbe extends PrismElement {
  static override tagName = 'prism-infra-probe';
  static formAssociated = true;
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};
  readonly internals = this.attachInternals();
  readonly localize = new LocalizeController(this);
  readonly slots = new HasSlotController(this, ['label', '[default]']);
  readonly ids = new IdController(this);
  readonly reducedMotion = new MediaQueryController(this, '(prefers-reduced-motion: reduce)');
  readonly mirror = new AriaMirror(this, () => this.internals);
  override render() {
    return html`<span id=${this.ids.id('label')}>${this.localize.term('close')}</span><slot name="label"></slot
      ><slot></slot>`;
  }
}
PrismInfraProbe.define();

describe('PrismAnnouncer', () => {
  it('creates polite and assertive live regions in the light DOM on first connect', async () => {
    await fixture(html`<prism-infra-probe></prism-infra-probe>`);
    const polite = document.querySelector('[data-prism-announcer="polite"]')!;
    const assertive = document.querySelector('[data-prism-announcer="assertive"]')!;
    expect(polite.getAttribute('role')).toBe('status');
    expect(assertive.getAttribute('role')).toBe('alert');
    PrismAnnouncer.announce('3 results');
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(polite.textContent).toBe('3 results');
  });
});

describe('LocalizeController', () => {
  it('uses the closest [lang] and re-renders when it changes', async () => {
    const wrap = await fixture(html`<div lang="it"><prism-infra-probe></prism-infra-probe></div>`);
    const probe = wrap.querySelector<PrismInfraProbe>('prism-infra-probe')!;
    await settle(probe);
    expect(probe.shadowRoot!.textContent).toContain('Chiudi');
    wrap.setAttribute('lang', 'en');
    await new Promise((r) => setTimeout(r, 0));
    await settle(probe);
    expect(probe.shadowRoot!.textContent).toContain('Close');
  });

  it('`strings` overrides the dictionary', async () => {
    const probe = await fixture<PrismInfraProbe>(
      html`<prism-infra-probe .strings=${{ close: 'Dismiss' }}></prism-infra-probe>`,
    );
    expect(probe.shadowRoot!.textContent).toContain('Dismiss');
  });
});

describe('controllers', () => {
  it('HasSlotController detects slotted content', async () => {
    const probe = await fixture<PrismInfraProbe>(html`<prism-infra-probe><b slot="label">L</b></prism-infra-probe>`);
    expect(probe.slots.test('label')).toBe(true);
    expect(probe.slots.test('[default]')).toBe(false);
  });

  it('IdController produces unique stable ids', async () => {
    const a = await fixture<PrismInfraProbe>(html`<prism-infra-probe></prism-infra-probe>`);
    const b = await fixture<PrismInfraProbe>(html`<prism-infra-probe></prism-infra-probe>`);
    expect(a.ids.id('label')).not.toBe(b.ids.id('label'));
    expect(a.ids.id('label')).toBe(a.ids.id('label'));
  });

  it('MediaQueryController reflects matchMedia', async () => {
    const probe = await fixture<PrismInfraProbe>(html`<prism-infra-probe></prism-infra-probe>`);
    expect(probe.reducedMotion.matches).toBe(matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  it('AriaMirror moves aria-label from the host and reads external labels', async () => {
    const probe = await fixture<PrismInfraProbe>(html`<prism-infra-probe aria-label="Search"></prism-infra-probe>`);
    expect(probe.mirror.hostLabel).toBe('Search');
    expect(probe.hasAttribute('aria-label')).toBe(false);
    const wrap = await fixture(
      html`<div><label for="probe-x">Tax code</label><prism-infra-probe id="probe-x"></prism-infra-probe></div>`,
    );
    const p2 = wrap.querySelector<PrismInfraProbe>('prism-infra-probe')!;
    await new Promise((r) => setTimeout(r, 0));
    expect(p2.mirror.hostLabel).toBe('Tax code');
  });
});
