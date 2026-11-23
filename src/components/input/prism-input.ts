import { html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { PrismElement } from '../../core/prism-element.js';
import { FormAssociatedMixin, type PrismValidationResult } from '../../core/mixins/form-associated.js';
import { FocusableMixin } from '../../core/mixins/focusable.js';
import { HasSlotController } from '../../core/controllers/has-slot-controller.js';
import { IdController } from '../../core/controllers/id-controller.js';
import { ValidationController } from '../../core/controllers/validation-controller.js';
import { LocalizeController } from '../../core/i18n/localize-controller.js';
import { AriaMirror } from '../../core/a11y/aria-mirror.js';
import { PrismAnnouncer } from '../../core/a11y/announcer.js';
import type { PrismStrings } from '../../core/i18n/i18n.js';
import type { PrismSize } from '../../core/types.js';
import '../icon/define.js';
import '../spinner/define.js';
import styles from './prism-input.css?inline';

export type PrismInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

const DERIVED_MODE: Partial<Record<PrismInputType, string>> = {
  email: 'email',
  number: 'decimal',
  tel: 'tel',
  url: 'url',
  search: 'search',
};

const COPIED_FLAGS = [
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
] as const;

/**
 * Text field with label, help and error text (controlled, form-associated).
 *
 * Typing is an ephemeral draft: each change emits `prism-input` and the native `input` (while they are
 * dispatched, `el.value` reads the draft, so `v-model` / `ngModel` work). On commit (blur or Enter)
 * it emits `prism-change` (`reason: 'commit' | 'enter'`) and the native `change`. If the owner does not
 * update `value`, the field shows `value` again. Clearing (`clearable` + Esc or the clear button)
 * emits `prism-change` with `value: ''` and `reason: 'clear'`.
 *
 * @summary Accessible glass text input.
 * @slot label - Label (instead of `label`).
 * @slot prefix - Leading content.
 * @slot suffix - Trailing content.
 * @slot help-text - Help text (instead of `help-text`).
 * @fires prism-input - Draft while typing.
 * @fires prism-change - Proposed value (commit, enter, clear, reset, restore).
 * @fires prism-invalid - Validation failed on submit or reportValidity.
 * @csspart form-control - Outer wrapper.
 * @csspart label - Label.
 * @csspart required-indicator - Required asterisk.
 * @csspart input-wrapper - Box around the input.
 * @csspart input - Native input.
 * @csspart prefix - Prefix wrapper.
 * @csspart suffix - Suffix wrapper.
 * @csspart clear-button - Clear button.
 * @csspart password-toggle - Show/hide password button.
 * @csspart counter - Character counter.
 * @csspart help-text - Help text.
 * @csspart error-text - Error text.
 * @cssprop --prism-input-bg - Background (default --prism-glass-surface-solid-1).
 * @cssprop --prism-input-border-color - Border colour.
 * @cssprop --prism-input-border-color-focus - Focus border colour.
 * @cssprop --prism-input-radius - Radius.
 * @cssprop --prism-input-height - Height.
 * @cssprop --prism-input-color - Text colour.
 * @cssprop --prism-input-placeholder-color - Placeholder colour.
 */
export class PrismInput extends FocusableMixin(FormAssociatedMixin(PrismElement)) {
  static override tagName = 'prism-input';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  /** Controlled value. While `prism-*` / native events are dispatched it reads the proposed value. */
  @property() value = '';
  @property({ attribute: 'default-value' }) defaultValue = '';
  @property({ reflect: true }) type: PrismInputType = 'text';
  @property() label = '';
  @property({ attribute: 'help-text' }) helpText = '';
  @property({ attribute: 'error-text' }) errorText = '';
  @property() placeholder = '';
  @property({ reflect: true }) size: PrismSize = 'md';
  @property({ reflect: true }) appearance: 'outlined' | 'filled' = 'outlined';
  @property({ reflect: true, attribute: 'label-position' }) labelPosition: 'top' | 'start' = 'top';
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() min?: string;
  @property() max?: string;
  @property() step?: string;
  @property() pattern?: string;
  @property() autocomplete = '';
  /** Virtual keyboard (`inputmode` of the inner input); derived from `type` when empty. */
  @property({ attribute: 'input-mode' }) override inputMode = '';
  /** Enter key label (`enterkeyhint` of the inner input). */
  @property({ attribute: 'enter-key-hint' }) override enterKeyHint = '';
  @property() capitalize?: string;
  @property({ attribute: 'spell-check' }) spellCheck?: 'true' | 'false';
  @property({ type: Boolean }) clearable = false;
  @property({ type: Boolean, attribute: 'password-toggle' }) passwordToggle = false;
  @property({ type: Boolean, attribute: 'show-counter' }) showCounter = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};

  readonly validation = new ValidationController(this, () => this.internals);
  private readonly slots = new HasSlotController(this, ['label', 'help-text', 'prefix', 'suffix']);
  private readonly ids = new IdController(this);
  private readonly localize = new LocalizeController(this);
  private readonly mirror = new AriaMirror(this, () => this.internals);

  /** Ephemeral: uncommitted text. */
  @state() private draft: string | null = null;
  /** Ephemeral presentation state (not data). */
  @state() private passwordVisible = false;
  private lastCounterThreshold = 0;

  private get inputEl(): HTMLInputElement | null {
    return this.renderRoot?.querySelector('input') ?? null;
  }
  private get text(): string {
    return this.draft ?? this.value;
  }

  // Methods forwarded to the inner input (no state change).
  select(): void {
    this.inputEl?.select();
  }
  setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void {
    this.inputEl?.setSelectionRange(start, end, direction);
  }
  get valueAsNumber(): number {
    return this.value === '' ? NaN : Number(this.value);
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override validate(): PrismValidationResult {
    const anchor = this.inputEl ?? undefined;
    if (this.required && !this.value) {
      return { flags: { valueMissing: true }, message: this.inputEl?.validationMessage || 'Required', anchor };
    }
    const flags: ValidityStateFlags = {};
    const inner = this.inputEl;
    if (inner && this.draft === null) for (const f of COPIED_FLAGS) if (inner.validity[f]) flags[f] = true;
    return { flags, message: inner?.validationMessage ?? '', anchor };
  }

  protected override resetToDefault(): void {
    this.draft = null;
    this.validation.reset();
    this.emitChange('value', this.defaultValue, { reason: 'reset', native: false });
  }

  protected override restoreFrom(state: FormDataEntryValue | FormData | null, mode: 'restore' | 'autocomplete'): void {
    if (typeof state === 'string') this.emitChange('value', state, { reason: mode, native: false });
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // A new value from the owner replaces the draft once committed.
    if (changed.has('value') && this.draft !== null && this.draft === this.value) this.draft = null;
  }

  /**
   * Simple edits are applied here and the browser's `input` is canceled: a UA `input` event is composed,
   * so document-level capture listeners would otherwise see it before the host's `prism-input` / `input`.
   * Other edits (IME composition, word deletion, number/email types without selection API) fall back to
   * the native event, stopped at the shadow boundary in `onInput`.
   */
  private onBeforeInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    if (!event.cancelable || event.isComposing || input.selectionStart === null) return;
    let start = input.selectionStart;
    let end = input.selectionEnd ?? start;
    let data = '';
    switch (event.inputType) {
      case 'insertText':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertFromDrop':
        data = event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
        break;
      case 'deleteContentBackward':
        if (start === end) start = Math.max(0, start - 1);
        break;
      case 'deleteContentForward':
        if (start === end) end = Math.min(input.value.length, end + 1);
        break;
      case 'deleteByCut':
        break;
      default:
        return;
    }
    if (this.maxlength !== undefined && this.maxlength >= 0) {
      const room = this.maxlength - (input.value.length - (end - start));
      data = data.slice(0, Math.max(0, room));
    }
    event.preventDefault();
    input.setRangeText(data, start, end, 'end');
    this.propose(input.value);
  }

  private onInput(event: Event) {
    event.stopPropagation(); // one native `input` per keystroke, from the host
    this.propose((event.target as HTMLInputElement).value);
  }

  private propose(proposed: string) {
    this.draft = proposed;
    this.emitInput('value', proposed);
    this.announceCounter(proposed);
  }

  private onChange(event: Event) {
    event.stopPropagation();
    this.commit('commit');
  }

  private commit(reason: 'commit' | 'enter') {
    const proposed = this.draft;
    this.draft = null;
    this.validation.markTouched();
    if (proposed !== null && proposed !== this.value) this.emitChange('value', proposed, { reason, native: 'change' });
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.isComposing) {
      this.commit('enter');
      const form = this.form;
      if (form) {
        event.preventDefault();
        form.requestSubmit();
      }
    } else if (event.key === 'Escape' && (this.clearable || this.type === 'search') && this.text !== '') {
      event.preventDefault();
      event.stopPropagation();
      this.clear();
    }
  }

  private clear() {
    this.draft = null;
    this.emitChange('value', '', { reason: 'clear' });
    this.inputEl?.focus();
  }

  private announceCounter(text: string) {
    if (!this.showCounter || !this.maxlength) return;
    const left = this.maxlength - text.length;
    const threshold = left <= 0 ? 2 : left <= this.maxlength * 0.1 ? 1 : 0;
    if (threshold > this.lastCounterThreshold) {
      PrismAnnouncer.announce(
        threshold === 2
          ? this.localize.term('characterLimit')
          : this.localize.term('charactersRemaining', { count: left }),
      );
    }
    this.lastCounterThreshold = threshold;
  }

  override render() {
    const hasLabel = !!this.label || this.slots.test('label');
    const hasHelp = !!this.helpText || this.slots.test('help-text');
    const showError = this.validation.showError && !!this.errorText;
    const counter = this.showCounter && this.maxlength ? `${this.text.length}/${this.maxlength}` : '';
    const describedBy = [
      hasHelp && this.ids.id('help'),
      showError && this.ids.id('error'),
      counter && this.ids.id('counter'),
    ]
      .filter(Boolean)
      .join(' ');
    const inputType = this.type === 'password' && this.passwordVisible ? 'text' : this.type;
    const mode = this.inputMode || DERIVED_MODE[this.type];

    return html`<div part="form-control" class="form-control">
      <label part="label" class="label" for=${this.ids.id('input')} ?hidden=${!hasLabel}>
        <slot name="label">${this.label}</slot>
        ${this.required ? html`<span part="required-indicator" class="required" aria-hidden="true">*</span>` : nothing}
      </label>
      <div
        part="input-wrapper"
        class="wrapper prism-input prism-field prism-glass"
        ?data-invalid=${this.validation.showError}
      >
        <span part="prefix" class="affix" ?hidden=${!this.slots.test('prefix')}><slot name="prefix"></slot></span>
        <input
          part="input"
          class="input"
          id=${this.ids.id('input')}
          data-focus-target
          type=${inputType}
          .value=${live(this.text)}
          placeholder=${ifDefined(this.placeholder || undefined)}
          ?disabled=${this.isDisabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          min=${ifDefined(this.min)}
          max=${ifDefined(this.max)}
          step=${ifDefined(this.step)}
          pattern=${ifDefined(this.pattern)}
          autocomplete=${ifDefined((this.autocomplete || undefined) as never)}
          inputmode=${ifDefined(mode)}
          enterkeyhint=${ifDefined(this.enterKeyHint || undefined)}
          autocapitalize=${ifDefined(this.capitalize)}
          spellcheck=${ifDefined(this.spellCheck)}
          aria-label=${ifDefined(!hasLabel && this.mirror.hostLabel ? this.mirror.hostLabel : undefined)}
          aria-invalid=${this.validation.showError ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy || undefined)}
          aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
          @beforeinput=${this.onBeforeInput}
          @input=${this.onInput}
          @change=${this.onChange}
          @blur=${() => this.commit('commit')}
          @keydown=${this.onKeydown}
        />
        ${this.loading ? html`<prism-spinner decorative size="sm" class="spinner"></prism-spinner>` : nothing}
        ${
          this.clearable && this.text !== '' && !this.isDisabled && !this.readonly
            ? html`<button
                part="clear-button"
                class="icon-button prism-control"
                type="button"
                aria-label=${this.localize.term('clear')}
                @click=${this.clear}
              >
                <prism-icon name="prism:x"></prism-icon>
              </button>`
            : nothing
        }
        ${
          this.passwordToggle && this.type === 'password'
            ? html`<button
                part="password-toggle"
                class="icon-button prism-control"
                type="button"
                aria-label=${this.localize.term('showPassword')}
                aria-pressed=${this.passwordVisible ? 'true' : 'false'}
                ?disabled=${this.isDisabled}
                @click=${() => (this.passwordVisible = !this.passwordVisible)}
              >
                <prism-icon name=${this.passwordVisible ? 'prism:eye-off' : 'prism:eye'}></prism-icon>
              </button>`
            : nothing
        } <span part="suffix" class="affix" ?hidden=${!this.slots.test('suffix')}><slot name="suffix"></slot></span>
      </div>
      <div class="below">
        <div class="messages">
          <div part="error-text" class="error" id=${this.ids.id('error')} ?hidden=${!showError}>
            <prism-icon name="prism:alert" part="error-icon"></prism-icon><span>${this.errorText}</span>
          </div>
          <div part="help-text" class="help" id=${this.ids.id('help')} ?hidden=${!hasHelp}>
            <slot name="help-text">${this.helpText}</slot>
          </div>
        </div>
        ${counter ? html`<span part="counter" class="counter" id=${this.ids.id('counter')}>${counter}</span>` : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-input': PrismInput;
  }
}
