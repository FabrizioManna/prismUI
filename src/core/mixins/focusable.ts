import { LitElement } from 'lit';
import type { PrismElement } from '../prism-element.js';
import type { AbstractConstructor } from '../types.js';

export type PrismFocusModel = 'delegate' | 'host';

export declare class FocusableElement {
  /** `delegate`: wraps a native focusable control; `host`: the role lives on the host (roving tabindex). */
  static focusModel: PrismFocusModel;
  /** Internal element receiving focus in the `delegate` model (`[data-focus-target]`). */
  protected readonly focusTarget: HTMLElement | null;
}

/**
 * Focus handling for the two models of ux-spec.md §1.5 / architecture.md §3.3.
 * - `delegate` (default): `delegatesFocus: true`; `focus()`/`blur()` go to `[data-focus-target]`.
 * - `host`: no delegation; the parent manages the host `tabindex` (roving).
 */
export const FocusableMixin = <T extends AbstractConstructor<PrismElement>>(Base: T) => {
  abstract class Focusable extends Base {
    static focusModel: PrismFocusModel = 'delegate';

    static get shadowRootOptions(): ShadowRootInit {
      return this.focusModel === 'delegate'
        ? { ...LitElement.shadowRootOptions, delegatesFocus: true }
        : LitElement.shadowRootOptions;
    }

    protected get focusTarget(): HTMLElement | null {
      return this.renderRoot?.querySelector<HTMLElement>('[data-focus-target]') ?? null;
    }

    override focus(options?: FocusOptions): void {
      const model = (this.constructor as typeof Focusable).focusModel;
      const target = model === 'delegate' ? this.focusTarget : null;
      if (target) target.focus(options);
      else super.focus(options);
    }

    override blur(): void {
      const target = this.focusTarget;
      if (target) target.blur();
      else super.blur();
    }
  }
  return Focusable as unknown as AbstractConstructor<FocusableElement> & T;
};
