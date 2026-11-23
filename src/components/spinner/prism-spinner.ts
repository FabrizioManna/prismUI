import { html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { PrismElement } from '../../core/prism-element.js';
import { LocalizeController } from '../../core/i18n/localize-controller.js';
import type { PrismStrings } from '../../core/i18n/i18n.js';
import styles from './prism-spinner.css?inline';

export type PrismSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Indeterminate loading indicator.
 *
 * Standalone it is a `role="status"` with a localized label ("Loading…"); with `decorative` it is hidden
 * from assistive technology (use it inside a component that already exposes `aria-busy`).
 * With reduced motion the rotation becomes a slow opacity pulse.
 *
 * @summary Loading spinner.
 * @csspart base - Container (role status).
 * @csspart track - Background circle.
 * @csspart indicator - Rotating arc.
 * @csspart label - Label (visually hidden unless `label-visible`).
 * @cssprop --prism-spinner-size - Size.
 * @cssprop --prism-spinner-color - Arc colour (default `currentColor`).
 * @cssprop --prism-spinner-track-color - Track colour.
 * @cssprop --prism-spinner-thickness - Stroke width.
 * @cssprop --prism-spinner-duration - Rotation duration.
 */
export class PrismSpinner extends PrismElement {
  static override tagName = 'prism-spinner';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  @property({ reflect: true }) size: PrismSpinnerSize = 'md';
  /** Accessible label (default: localized "Loading…"). */
  @property() label = '';
  @property({ type: Boolean, attribute: 'label-visible' }) labelVisible = false;
  /** Hidden from assistive technology (the container already says it is busy). */
  @property({ type: Boolean, reflect: true }) decorative = false;
  /** Delay in ms before showing (avoids flicker on short loads). */
  @property({ type: Number }) delay = 0;
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};

  private readonly localize = new LocalizeController(this);
  @state() private shown = true;
  private timer: ReturnType<typeof setTimeout> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.schedule();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('delay') && changed.get('delay') !== undefined) this.schedule();
  }

  private schedule() {
    clearTimeout(this.timer);
    this.shown = this.delay <= 0;
    if (!this.shown) this.timer = setTimeout(() => (this.shown = true), this.delay);
  }

  override render() {
    const label = this.label || this.localize.term('loading');
    return html`<span
      part="base"
      class="base"
      role=${this.decorative ? nothing : 'status'}
      aria-hidden=${this.decorative ? 'true' : nothing}
      ?data-hidden=${!this.shown}
    >
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle part="track" class="track" cx="12" cy="12" r="10"></circle>
        <circle part="indicator" class="indicator" cx="12" cy="12" r="10" pathLength="100"></circle>
      </svg>
      ${
        this.decorative
          ? nothing
          : html`<span part="label" class=${this.labelVisible ? 'label' : 'label sr-only'}
              >${this.shown ? label : ''}</span
            >`
      }
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-spinner': PrismSpinner;
  }
}
