import { LitElement, type CSSResultGroup, type CSSResultOrNative } from 'lit';
import { baseStyles } from '../styles/base-styles.js';
import { emit, type PrismEventDetailMap, type PrismEventInit, type PrismEventName } from './events.js';
import { hoistPropertyRules } from './global-styles.js';

/**
 * Base class of every prismUI component.
 *
 * - No `@customElement`: each component declares `static tagName` and registers via `define()` (idempotent).
 * - Components are controlled: meaningful state comes from properties; user interaction only emits
 *   request events (see `emit()` and `ControlledValue`), never mutating the state properties.
 * - Renders nothing by default.
 */
export abstract class PrismElement extends LitElement {
  /** Default tag name; can be overridden in `define()`. */
  static tagName: string;

  static override styles: CSSResultGroup = [baseStyles];

  /**
   * Idempotent registration: no error if the tag is already defined (double bundle, HMR).
   * @returns the constructor registered for `tag`.
   */
  static define(
    tag: string = this.tagName,
    registry: CustomElementRegistry = customElements,
  ): CustomElementConstructor {
    if (!tag) throw new Error(`[prismUI] ${this.name}.define(): missing tag name`);
    const existing = registry.get(tag);
    if (existing) return existing;
    registry.define(tag, this as unknown as CustomElementConstructor);
    return this as unknown as CustomElementConstructor;
  }

  protected static override finalizeStyles(styles?: CSSResultGroup): CSSResultOrNative[] {
    const finalized = super.finalizeStyles(styles);
    for (const style of finalized) {
      const cssText = 'cssText' in style ? style.cssText : '';
      if (cssText.includes('@property')) hoistPropertyRules(cssText);
    }
    return finalized;
  }

  /** Dispatches a typed prism-* event (bubbles + composed). */
  protected emit<K extends PrismEventName>(name: K, detail: PrismEventDetailMap[K], init?: PrismEventInit): boolean {
    return emit(this, name, detail, init);
  }
}
