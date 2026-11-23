import { html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PrismElement } from '../../core/prism-element.js';
import { FormAssociatedMixin } from '../../core/mixins/form-associated.js';
import { FocusableMixin } from '../../core/mixins/focusable.js';
import { HasSlotController } from '../../core/controllers/has-slot-controller.js';
import { IdController } from '../../core/controllers/id-controller.js';
import { LocalizeController } from '../../core/i18n/localize-controller.js';
import { PrismAnnouncer } from '../../core/a11y/announcer.js';
import type { PrismStrings } from '../../core/i18n/i18n.js';
import type { PrismSize } from '../../core/types.js';
import '../spinner/define.js';
import styles from './prism-button.css?inline';

export type PrismButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type PrismButtonType = 'button' | 'submit' | 'reset';

/**
 * Button (APG button). Renders a native `<button>`, or an `<a href>` with `href`.
 *
 * - `variant="primary"` by default; use `secondary` / `ghost` for the other actions of a view.
 * - `loading`: stays focusable, `aria-disabled` + `aria-busy`, ignores activation, width locked.
 * - `toggle` (controlled): activation emits `prism-change` with `{ value, pressed, previousValue, reason }`
 *   proposing `!pressed`; `aria-pressed` changes only when the owner sets `pressed`.
 * - `disabled-reason`: focusable `aria-disabled` button with the reason in `aria-describedby`.
 * - `type="submit" | "reset"` submits/resets the owning form (name/value included in FormData).
 *
 * @summary Accessible glass button.
 * @slot - Label.
 * @slot prefix - Leading icon (hidden while loading).
 * @slot suffix - Trailing icon.
 * @fires prism-change - Toggle only: proposed `pressed` (not cancelable).
 * @csspart base - The `<button>` or `<a>`.
 * @csspart label - Label wrapper.
 * @csspart prefix - Prefix wrapper.
 * @csspart suffix - Suffix wrapper.
 * @csspart spinner - Loading spinner.
 * @cssprop --prism-button-bg - Background.
 * @cssprop --prism-button-bg-hover - Hover background.
 * @cssprop --prism-button-color - Text colour.
 * @cssprop --prism-button-border-color - Border colour.
 * @cssprop --prism-button-radius - Corner radius (default --prism-radius-lg).
 * @cssprop --prism-button-height - Height (default --prism-control-height-*).
 * @cssprop --prism-button-padding-inline - Inline padding.
 * @cssprop --prism-button-gap - Gap between icon and label.
 * @cssprop --prism-button-glow - Glow shadow.
 */
export class PrismButton extends FocusableMixin(FormAssociatedMixin(PrismElement)) {
  static override tagName = 'prism-button';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  @property({ reflect: true }) variant: PrismButtonVariant = 'primary';
  @property({ reflect: true }) size: PrismSize = 'md';
  @property({ reflect: true }) type: PrismButtonType = 'button';
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ attribute: 'loading-label' }) loadingLabel = '';
  @property({ type: Boolean, attribute: 'announce-loading' }) announceLoading = false;
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly = false;
  /** Accessible name; required with `icon-only`. */
  @property() label = '';
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean, reflect: true }) toggle = false;
  /** Controlled pressed state (with `toggle`). Never changed by the component. */
  @property({ type: Boolean, reflect: true }) pressed = false;
  @property() href = '';
  @property() target = '';
  @property() rel = '';
  @property() download?: string;
  @property() value = '';
  @property({ attribute: 'disabled-reason' }) disabledReason = '';
  @property({ attribute: 'formaction' }) formAction?: string;
  @property({ attribute: 'formmethod' }) formMethod?: string;
  @property({ type: Boolean, attribute: 'formnovalidate' }) formNoValidate = false;
  @property({ attribute: 'formtarget' }) formTarget?: string;
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};

  private readonly slots = new HasSlotController(this, ['prefix', 'suffix']);
  private readonly ids = new IdController(this);
  private readonly localize = new LocalizeController(this);
  private warnedIconOnly = false;

  constructor() {
    super();
    // A disabled host must never emit `click` (even when clicked programmatically on the host).
    this.addEventListener('click', this.guardHostClick, { capture: true });
  }

  private readonly guardHostClick = (event: Event) => {
    if (this.isDisabled && !this.disabledReason) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  /** Activation is blocked (but focus is kept): loading or disabled with a reason. */
  private get activationBlocked(): boolean {
    return this.loading || (this.isDisabled && !!this.disabledReason);
  }

  protected override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed as never);
    if (this.iconOnly && !this.label && !this.warnedIconOnly) {
      this.warnedIconOnly = true;
      console.warn('[prismUI] <prism-button icon-only> needs a `label` (accessible name).', this);
    }
    if (changed.has('loading') && this.loading && this.announceLoading) {
      PrismAnnouncer.announce(this.loadingLabel || this.localize.term('loading'));
    }
  }

  private onClick(event: MouseEvent) {
    if (this.activationBlocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.toggle) {
      this.emitChange('pressed', !this.pressed, {
        reason: event.detail === 0 ? 'keyboard' : 'click',
        detail: { pressed: !this.pressed },
        native: false,
      });
    }
    if (this.href) return;
    const form = this.form;
    if (!form) return;
    if (this.type === 'submit') this.submit(form);
    else if (this.type === 'reset') form.reset();
  }

  /** Submits through a temporary native submitter so name/value and form* overrides apply. */
  private submit(form: HTMLFormElement) {
    const submitter = document.createElement('button');
    submitter.type = 'submit';
    submitter.hidden = true;
    if (this.name) submitter.name = this.name;
    submitter.value = this.value;
    if (this.formAction) submitter.formAction = this.formAction;
    if (this.formMethod) submitter.formMethod = this.formMethod;
    if (this.formNoValidate) submitter.formNoValidate = true;
    if (this.formTarget) submitter.formTarget = this.formTarget;
    form.append(submitter);
    try {
      form.requestSubmit(submitter);
    } finally {
      submitter.remove();
    }
  }

  private renderContent() {
    return html`<span part="prefix" class="prefix" ?hidden=${!this.slots.test('prefix') || this.loading}
        ><slot name="prefix"></slot
      ></span>
      <span part="label" class=${this.iconOnly ? 'label sr-only' : 'label'}
        ><slot></slot>${this.iconOnly ? this.label : nothing}</span
      >
      <span part="suffix" class="suffix" ?hidden=${!this.slots.test('suffix')}><slot name="suffix"></slot></span> ${
        this.loading
          ? html`<prism-spinner part="spinner" class="spinner" decorative size="sm"></prism-spinner>`
          : nothing
      }
      ${
        this.disabledReason
          ? html`<span id=${this.ids.id('reason')} class="sr-only">${this.disabledReason}</span>`
          : nothing
      } `;
  }

  override render() {
    const ariaDisabled = this.activationBlocked ? 'true' : undefined;
    const describedBy = this.disabledReason ? this.ids.id('reason') : undefined;
    const label = this.iconOnly && this.label ? this.label : undefined;
    const classes = 'base prism-button prism-control focus-ring';
    if (this.href) {
      return html`<a
        part="base"
        class=${classes}
        data-focus-target
        href=${ifDefined(this.isDisabled && !this.disabledReason ? undefined : this.href)}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(this.rel || (this.target === '_blank' ? 'noreferrer noopener' : undefined))}
        download=${ifDefined(this.download)}
        aria-label=${ifDefined(label)}
        aria-disabled=${ifDefined(ariaDisabled ?? (this.isDisabled ? 'true' : undefined))}
        aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
        aria-describedby=${ifDefined(describedBy)}
        @click=${this.onClick}
        >${this.renderContent()}</a
      >`;
    }
    return html`<button
      part="base"
      class=${classes}
      data-focus-target
      type="button"
      ?disabled=${this.isDisabled && !this.disabledReason}
      aria-label=${ifDefined(label)}
      aria-disabled=${ifDefined(ariaDisabled)}
      aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
      aria-pressed=${ifDefined(this.toggle ? String(this.pressed) : undefined)}
      aria-describedby=${ifDefined(describedBy)}
      @click=${this.onClick}
    >
      ${this.renderContent()}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-button': PrismButton;
  }
}
