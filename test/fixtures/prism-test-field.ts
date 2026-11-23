import { html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { PrismElement } from '../../src/core/prism-element.js';
import { FormAssociatedMixin, type PrismValidationResult } from '../../src/core/mixins/form-associated.js';
import { FocusableMixin } from '../../src/core/mixins/focusable.js';
import { ValidationController } from '../../src/core/controllers/validation-controller.js';
import styles from './prism-test-field.css?inline';

/**
 * Test-only controlled text field used to exercise the F0 infrastructure (NOT a public component).
 * It shows the reference implementation of the controlled pattern: `value` is never assigned internally;
 * the uncommitted text lives in the ephemeral `draft` state.
 *
 * @summary Test fixture: controlled, form-associated text field.
 * @fires prism-input - Proposed value while typing.
 * @fires prism-change - Proposed value on commit. `value` does not change until the consumer sets it.
 */
export class PrismTestField extends FocusableMixin(FormAssociatedMixin(PrismElement)) {
  static override tagName = 'prism-test-field';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  @property() value = '';
  @property({ attribute: 'default-value' }) defaultValue = '';
  @property() label = '';

  readonly validation = new ValidationController(this, () => this.internals);

  /** Ephemeral: text typed and not yet committed. */
  @state() private draft: string | null = null;

  protected override formValue(): string {
    return this.value;
  }

  protected override validate(): PrismValidationResult {
    const anchor = this.focusTarget ?? undefined;
    if (this.required && !this.value) return { flags: { valueMissing: true }, message: 'Required', anchor };
    return { flags: {}, message: '' };
  }

  protected override resetToDefault(): void {
    this.draft = null;
    this.emitChange('value', this.defaultValue, { reason: 'reset', source: 'reset', native: false });
  }

  private onInput(event: Event) {
    event.stopPropagation(); // the inner native `input` is composed: the host re-emits a single one
    const input = event.target as HTMLInputElement;
    this.draft = input.value;
    this.emitInput('value', input.value, 'keyboard');
  }

  private onChange(event: Event) {
    event.stopPropagation();
    const proposed = (event.target as HTMLInputElement).value;
    this.draft = null;
    this.emitChange('value', proposed, { source: 'keyboard', reason: 'commit' });
  }

  override render() {
    return html`<label part="form-control" class="flex text-fg">
      <span flex-col gap-1 text-sm part="label">${this.label}</span>
      <input
        part="input"
        data-focus-target
        class="glass-1 control-border focus-ring hit-area text-fg"
        rounded-md
        px-3
        text-base
        .value=${live(this.draft ?? this.value)}
        ?disabled=${this.isDisabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        aria-invalid=${this.validation.showError ? 'true' : 'false'}
        @input=${this.onInput}
        @change=${this.onChange}
      />
    </label>`;
  }
}

PrismTestField.define();

declare global {
  interface HTMLElementTagNameMap {
    'prism-test-field': PrismTestField;
  }
}
