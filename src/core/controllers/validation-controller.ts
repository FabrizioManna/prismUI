import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { emit } from '../events.js';

type ValidatedHost = ReactiveControllerHost &
  HTMLElement & {
    invalid: boolean;
    readonly validity: ValidityState | undefined;
    readonly validationMessage: string;
  };

/**
 * Shows validation errors only after interaction (ux-spec §1.4): after a commit/blur with a changed value,
 * or when the form is submitted (`invalid` event on the host). `invalid` set by the consumer shows at once.
 * Mirrors the result to `:state(user-invalid)`.
 */
export class ValidationController implements ReactiveController {
  /** Ephemeral "touched" state. */
  touched = false;

  constructor(
    private readonly host: ValidatedHost,
    private readonly internals: () => ElementInternals | undefined,
  ) {
    host.addController(this);
  }

  private readonly onInvalid = (event: Event) => {
    // No preventDefault(): it would also cancel the browser focusing the anchor (reportValidity / submit).
    void event;
    this.touched = true;
    const validity = this.host.validity;
    if (validity) emit(this.host, 'prism-invalid', { validity, message: this.host.validationMessage });
    this.host.requestUpdate();
  };

  /** Call after a user commit or blur. */
  markTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.host.requestUpdate();
    }
  }

  /** Reset to untouched (form reset). */
  reset(): void {
    this.touched = false;
    this.host.requestUpdate();
  }

  /** Whether the error should be visible now. */
  get showError(): boolean {
    if (this.host.invalid) return true;
    return this.touched && this.host.validity !== undefined && !this.host.validity.valid;
  }

  hostConnected(): void {
    this.host.addEventListener('invalid', this.onInvalid);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('invalid', this.onInvalid);
  }

  hostUpdated(): void {
    const states = this.internals()?.states;
    if (!states) return;
    try {
      if (this.showError) states.add('user-invalid');
      else states.delete('user-invalid');
    } catch {
      /* older engines with dashed-ident states only */
    }
  }
}
