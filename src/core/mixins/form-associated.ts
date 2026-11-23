import { property, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import type { PrismElement } from '../prism-element.js';
import type { AbstractConstructor } from '../types.js';
import type { PrismInteractionSource } from '../events.js';
import { isSameValue, withProposedValue } from '../controlled.js';

export interface PrismValidationResult {
  flags: ValidityStateFlags;
  message: string;
  anchor?: HTMLElement;
}

const VALID: PrismValidationResult = { flags: {}, message: '' };

/**
 * Public + protected surface added by `FormAssociatedMixin` (declared separately so that declaration
 * emit can describe protected members of the mixin class).
 */
export declare class FormAssociatedElement {
  static formAssociated: boolean;
  name: string;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  invalid: boolean;
  readonly form: HTMLFormElement | null;
  readonly labels: NodeList | null;
  readonly validity: ValidityState | undefined;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  readonly isDisabled: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
  formResetCallback(): void;
  formDisabledCallback(disabled: boolean): void;
  formStateRestoreCallback(state: FormDataEntryValue | FormData | null, mode: 'restore' | 'autocomplete'): void;
  formAssociatedCallback(form: HTMLFormElement | null): void;
  protected readonly internals: ElementInternals | undefined;
  protected formDisabled: boolean;
  protected formValue(): FormDataEntryValue | FormData | null;
  protected formState(): FormDataEntryValue | FormData | null;
  protected validate(): PrismValidationResult;
  protected resetToDefault(): void;
  protected restoreFrom(state: FormDataEntryValue | FormData | null, mode: 'restore' | 'autocomplete'): void;
  protected emitInput<K extends string>(key: K, proposed: unknown, source?: PrismInteractionSource): void;
  protected emitChange<K extends string>(key: K, proposed: unknown, source?: PrismInteractionSource): boolean;
}

let warnedNoInternals = false;

/**
 * Form-associated custom element support (architecture.md §3.2, §5; ux-spec.md §1.3–1.4).
 *
 * Controlled model: `emitInput()` / `emitChange()` never assign the state property. They emit
 * `prism-input` → native `input`, and `prism-change` → native `change` (from the host, bubbling).
 * While the native events are dispatched, `host[key]` reads as the proposed value, so framework bindings
 * (`v-model`, `ngModel`) pick it up and write it back. If nobody accepts it, the previous value is shown again.
 */
export const FormAssociatedMixin = <T extends AbstractConstructor<PrismElement>>(Base: T) => {
  abstract class FormAssociated extends Base {
    static formAssociated = true;

    protected readonly internals: ElementInternals | undefined;

    @property({ reflect: true }) name = '';
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) required = false;
    @property({ type: Boolean, reflect: true }) readonly = false;
    /** Forced invalid state set by the consumer (e.g. server-side errors). */
    @property({ type: Boolean, reflect: true }) invalid = false;

    @state() protected formDisabled = false;

    private customValidityMessage = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      if (typeof this.attachInternals === 'function') {
        this.internals = this.attachInternals();
      } else if (!warnedNoInternals) {
        warnedNoInternals = true;
        console.warn('[prismUI] ElementInternals is not supported: form integration is disabled.');
      }
    }

    get form(): HTMLFormElement | null {
      return this.internals?.form ?? null;
    }
    get labels(): NodeList | null {
      return this.internals?.labels ?? null;
    }
    get validity(): ValidityState | undefined {
      return this.internals?.validity;
    }
    get validationMessage(): string {
      return this.internals?.validationMessage ?? '';
    }
    get willValidate(): boolean {
      return this.internals?.willValidate ?? false;
    }
    get isDisabled(): boolean {
      return this.disabled || this.formDisabled;
    }

    checkValidity(): boolean {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity(): boolean {
      return this.internals?.reportValidity() ?? true;
    }
    setCustomValidity(message: string): void {
      this.customValidityMessage = message;
      this.syncValidity();
    }

    /** Value submitted with the form. Override in subclasses. */
    protected formValue(): FormDataEntryValue | FormData | null {
      return null;
    }
    /** State used for history/bfcache restore. Defaults to `formValue()`. */
    protected formState(): FormDataEntryValue | FormData | null {
      return this.formValue();
    }
    /** Validity flags; `anchor` should be the internal focusable control. */
    protected validate(): PrismValidationResult {
      return VALID;
    }
    /**
     * Called on `form.reset()`. Controlled components must not assign their own state: the recommended
     * implementation emits a change request towards the default value (open point, see CONTRIBUTING.md).
     */
    protected resetToDefault(): void {}
    /** Called on history/bfcache restore or autofill. Same controlled rule as `resetToDefault()`. */
    protected restoreFrom(_state: FormDataEntryValue | FormData | null, _mode: 'restore' | 'autocomplete'): void {}

    protected override updated(changed: PropertyValues): void {
      super.updated(changed);
      this.internals?.setFormValue(this.isDisabled ? null : this.formValue(), this.formState());
      if (this.internals) this.internals.ariaDisabled = this.isDisabled ? 'true' : null;
      this.syncValidity();
    }

    private syncValidity(): void {
      if (!this.internals) return;
      if (this.readonly || this.isDisabled) {
        this.internals.setValidity({});
        return;
      }
      const result = this.validate();
      const custom = this.customValidityMessage || (this.invalid ? 'Invalid value' : '');
      const flags: ValidityStateFlags = custom ? { ...result.flags, customError: true } : result.flags;
      const hasError = Object.values(flags).some(Boolean);
      if (hasError) this.internals.setValidity(flags, custom || result.message || 'Invalid value', result.anchor);
      else this.internals.setValidity({});
    }

    /** User is typing/dragging: `prism-input` then native `input` (ux-spec.md §1.3). */
    protected emitInput<K extends string>(key: K, proposed: unknown, source?: PrismInteractionSource): void {
      this.emit('prism-input', { value: proposed, source });
      withProposedValue(this as never, key as never, proposed as never, () =>
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true })),
      );
    }

    /**
     * User committed a value: `prism-change` then native `change`. Does not assign `this[key]`.
     * @returns `false` if the proposal equals the current value (nothing emitted).
     */
    protected emitChange<K extends string>(key: K, proposed: unknown, source?: PrismInteractionSource): boolean {
      const previousValue = (this as unknown as Record<string, unknown>)[key];
      if (isSameValue(previousValue, proposed)) return false;
      this.emit('prism-change', { value: proposed, previousValue, source });
      withProposedValue(this as never, key as never, proposed as never, () =>
        this.dispatchEvent(new Event('change', { bubbles: true })),
      );
      return true;
    }

    formResetCallback(): void {
      this.resetToDefault();
    }
    formDisabledCallback(disabled: boolean): void {
      this.formDisabled = disabled;
    }
    formStateRestoreCallback(state: FormDataEntryValue | FormData | null, mode: 'restore' | 'autocomplete'): void {
      this.restoreFrom(state, mode);
    }
    formAssociatedCallback(_form: HTMLFormElement | null): void {
      this.syncValidity();
    }
  }
  return FormAssociated as unknown as AbstractConstructor<FormAssociatedElement> & T;
};
