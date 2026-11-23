import { html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { Check, ChevronDown, CircleAlert, Eye, EyeOff, Info, Minus, X } from 'lucide-static';
import { PrismElement } from '../../core/prism-element.js';
import styles from './prism-icon.css?inline';

export type PrismIconSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const registry = new Map<string, string>();
const warned = new Set<string>();

/** Normalises a trusted SVG string: decorative by default, sized by CSS, never focusable. */
function prepare(svg: string): string {
  return svg
    .trim()
    .replace(/\s(width|height|class)="[^"]*"/g, '')
    .replace('<svg', '<svg part="svg" focusable="false" aria-hidden="true"');
}

/**
 * Icon from the static registry (lucide-static strings) or from a trusted SVG string.
 *
 * - Decorative by default (`aria-hidden`); with `label` it becomes meaningful (`role="img"` + `aria-label`).
 * - Colour is `currentColor`, so it follows the text and forced-colors.
 * - Never interactive.
 *
 * @summary SVG icon (Lucide).
 * @csspart svg - The rendered `<svg>`.
 * @cssprop --prism-icon-size - Icon size (wins over `size`).
 * @cssprop --prism-icon-color - Icon colour (default `currentColor`).
 * @cssprop --prism-icon-stroke-width - Stroke width (default 2).
 */
export class PrismIcon extends PrismElement {
  static override tagName = 'prism-icon';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  /**
   * Registers icons by name (call once at startup). Values are trusted SVG strings, e.g. from `lucide-static`.
   * Names starting with `prism:` are reserved for internal icons.
   */
  static register(icons: Record<string, string>): void {
    for (const [name, svg] of Object.entries(icons)) registry.set(name, prepare(svg));
  }

  /** Registered SVG for `name`, if any. */
  static resolve(name: string): string | undefined {
    return registry.get(name);
  }

  /** Registry key. */
  @property({ reflect: true }) name = '';
  /** Trusted SVG string (never user input). Wins over `name`. */
  @property({ attribute: false }) svg = '';
  /** Accessible name: when set the icon is meaningful, otherwise decorative. */
  @property() label = '';
  @property({ reflect: true }) size: PrismIconSize = 'inherit';
  /** Mirror directional icons in RTL. */
  @property({ type: Boolean, reflect: true, attribute: 'mirror-rtl' }) mirrorRtl = false;

  override render() {
    const source = this.svg ? prepare(this.svg) : registry.get(this.name);
    if (!source && this.name && !warned.has(this.name)) {
      warned.add(this.name);
      console.warn(`[prismUI] <prism-icon>: icon "${this.name}" is not registered (PrismIcon.register).`);
    }
    const meaningful = this.label.trim() !== '';
    return html`<span
      class="base"
      role=${meaningful ? 'img' : nothing}
      aria-label=${meaningful ? this.label : nothing}
      aria-hidden=${meaningful ? nothing : 'true'}
      >${source ? unsafeSVG(source) : nothing}</span
    >`;
  }
}

PrismIcon.register({
  'prism:check': Check,
  'prism:chevron-down': ChevronDown,
  'prism:alert': CircleAlert,
  'prism:info': Info,
  'prism:eye': Eye,
  'prism:eye-off': EyeOff,
  'prism:minus': Minus,
  'prism:x': X,
});

declare global {
  interface HTMLElementTagNameMap {
    'prism-icon': PrismIcon;
  }
}
