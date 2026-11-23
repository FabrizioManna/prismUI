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
import '../icon/define.js';
import styles from './prism-textarea.css?inline';

const COPIED_FLAGS = ['tooShort', 'tooLong'] as const;

/**
 * Multi-line text field (controlled, form-associated). Typing is a draft: each change emits `prism-input`
 * and the native `input`; on blur a different draft emits `prism-change` (`reason: 'commit'`) and the native
 * `change`. If the owner does not update `value`, the field shows `value` again. Enter inserts a new line.
 *
 * @summary Accessible glass textarea.
 * @slot label - Label (instead of `label`).
 * @slot help-text - Help text (instead of `help-text`).
 * @fires prism-input - Draft while typing.
 * @fires prism-change - Proposed value (commit, reset, restore).
 * @fires prism-invalid - Validation failed on submit or reportValidity.
 * @csspart form-control - Outer wrapper.
 * @csspart label - Label.
 * @csspart required-indicator - Required asterisk.
 * @csspart base - Box around the textarea.
 * @csspart textarea - Native textarea.
 * @csspart counter - Character counter.
 * @csspart help-text - Help text.
 * @csspart error-text - Error text.
 * @cssprop --prism-textarea-bg - Background.
 * @cssprop --prism-textarea-border-color - Border colour.
 * @cssprop --prism-textarea-border-color-hover - Hover border colour.
 * @cssprop --prism-textarea-border-color-focus - Focus border colour.
 * @cssprop --prism-textarea-radius - Radius.
 * @cssprop --prism-textarea-padding - Padding.
 * @cssprop --prism-textarea-min-height - Minimum height.
 * @cssprop --prism-textarea-max-height - Maximum height (auto-resize).
 */
export class PrismTextarea extends FocusableMixin(FormAssociatedMixin(PrismElement)) {
  static override tagName = 'prism-textarea';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  /** Controlled value. While `prism-*` / native events are dispatched it reads the proposed value. */
  @property() value = '';
  @property({ attribute: 'default-value' }) defaultValue = '';
  @property() label = '';
  @property({ attribute: 'help-text' }) helpText = '';
  @property({ attribute: 'error-text' }) errorText = '';
  @property() placeholder = '';
  @property({ type: Number }) rows = 3;
  /** Auto-resize limit in rows (`0` = none). */
  @property({ type: Number, attribute: 'max-rows' }) maxRows = 0;
  @property({ reflect: true }) resize: 'vertical' | 'none' | 'auto' = 'vertical';
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Boolean, attribute: 'show-counter' }) showCounter = false;
  @property() autocomplete = '';
  @property() wrap: 'soft' | 'hard' = 'soft';
  /** Virtual keyboard (`inputmode` of the inner textarea). */
  @property({ attribute: 'input-mode' }) override inputMode = '';
  /** Enter key label (`enterkeyhint` of the inner textarea). */
  @property({ attribute: 'enter-key-hint' }) override enterKeyHint = '';
  @property({ type: Boolean, attribute: 'no-spellcheck' }) noSpellcheck = false;
  @property({ reflect: true }) appearance: 'outlined' | 'filled' = 'outlined';
  @property({ reflect: true, attribute: 'label-position' }) labelPosition: 'top' | 'start' = 'top';
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};

  readonly validation = new ValidationController(this, () => this.internals);
  private readonly slots = new HasSlotController(this, ['label', 'help-text']);
  private readonly ids = new IdController(this);
  private readonly localize = new LocalizeController(this);
  private readonly mirror = new AriaMirror(this, () => this.internals);

  /** Ephemeral: uncommitted text. */
  @state() private draft: string | null = null;
  private lastCounterThreshold = 0;

  private get textareaEl(): HTMLTextAreaElement | null {
    return this.renderRoot?.querySelector('textarea') ?? null;
  }
  private get text(): string {
    return this.draft ?? this.value;
  }

  // Methods forwarded to the inner textarea (no state change).
  select(): void {
    this.textareaEl?.select();
  }
  setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void {
    this.textareaEl?.setSelectionRange(start, end, direction);
  }

  protected override formValue(): string {
    return this.value;
  }

  protected override validate(): PrismValidationResult {
    const anchor = this.textareaEl ?? undefined;
    if (this.required && !this.value) {
      return { flags: { valueMissing: true }, message: this.textareaEl?.validationMessage || 'Required', anchor };
    }
    const flags: ValidityStateFlags = {};
    const inner = this.textareaEl;
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
    if (changed.has('value') && this.draft !== null && this.draft === this.value) this.draft = null;
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    this.autoResize();
  }

  private autoResize() {
    const ta = this.textareaEl;
    if (!ta || this.resize !== 'auto') return;
    ta.style.height = 'auto';
    let max = Infinity;
    if (this.maxRows > 0) {
      const cs = getComputedStyle(ta);
      const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
      max = line * this.maxRows + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    }
    ta.style.height = `${Math.min(ta.scrollHeight, max)}px`;
  }

  /** Same interception as prism-input: the host's `prism-input` / `input` precede any composed UA `input`. */
  private onBeforeInput(event: InputEvent) {
    const ta = event.target as HTMLTextAreaElement;
    if (!event.cancelable || event.isComposing) return;
    let start = ta.selectionStart;
    let end = ta.selectionEnd;
    let data = '';
    switch (event.inputType) {
      case 'insertText':
      case 'insertReplacementText':
      case 'insertFromPaste':
      case 'insertFromDrop':
        data = event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
        break;
      case 'insertLineBreak':
      case 'insertParagraph':
        data = '\n';
        break;
      case 'deleteContentBackward':
        if (start === end) start = Math.max(0, start - 1);
        break;
      case 'deleteContentForward':
        if (start === end) end = Math.min(ta.value.length, end + 1);
        break;
      case 'deleteByCut':
        break;
      default:
        return;
    }
    if (this.maxlength !== undefined && this.maxlength >= 0) {
      const room = this.maxlength - (ta.value.length - (end - start));
      data = data.slice(0, Math.max(0, room));
    }
    event.preventDefault();
    ta.setRangeText(data, start, end, 'end');
    this.propose(ta.value);
  }

  private onInput(event: Event) {
    event.stopPropagation();
    this.propose((event.target as HTMLTextAreaElement).value);
  }

  private propose(proposed: string) {
    this.draft = proposed;
    this.emitInput('value', proposed);
    this.announceCounter(proposed);
    this.autoResize();
  }

  private commit() {
    const proposed = this.draft;
    this.draft = null;
    this.validation.markTouched();
    if (proposed !== null && proposed !== this.value)
      this.emitChange('value', proposed, { reason: 'commit', native: 'change' });
  }

  /** Announces only at 80% and 100% of maxlength (architecture §6.28). */
  private announceCounter(text: string) {
    if (!this.showCounter || !this.maxlength) return;
    const left = this.maxlength - text.length;
    const threshold = left <= 0 ? 2 : text.length >= this.maxlength * 0.8 ? 1 : 0;
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

    return html`<div part="form-control" class="form-control">
      <label part="label" class="label" for=${this.ids.id('textarea')} ?hidden=${!hasLabel}>
        <slot name="label">${this.label}</slot>
        ${this.required ? html`<span part="required-indicator" class="required" aria-hidden="true">*</span>` : nothing}
      </label>
      <div part="base" class="base prism-input prism-field prism-glass" ?data-invalid=${this.validation.showError}>
        <textarea
          part="textarea"
          class="textarea"
          id=${this.ids.id('textarea')}
          data-focus-target
          .value=${live(this.text)}
          rows=${this.rows}
          placeholder=${ifDefined(this.placeholder || undefined)}
          ?disabled=${this.isDisabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          autocomplete=${ifDefined((this.autocomplete || undefined) as never)}
          wrap=${this.wrap}
          inputmode=${ifDefined(this.inputMode || undefined)}
          enterkeyhint=${ifDefined(this.enterKeyHint || undefined)}
          spellcheck=${ifDefined(this.noSpellcheck ? 'false' : undefined)}
          aria-label=${ifDefined(!hasLabel && this.mirror.hostLabel ? this.mirror.hostLabel : undefined)}
          aria-invalid=${this.validation.showError ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy || undefined)}
          @beforeinput=${this.onBeforeInput}
          @input=${this.onInput}
          @change=${(e: Event) => {
            e.stopPropagation();
            this.commit();
          }}
          @blur=${() => this.commit()}
        ></textarea>
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
    'prism-textarea': PrismTextarea;
  }
}
