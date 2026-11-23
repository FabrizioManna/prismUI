import { unsafeCSS, type CSSResult } from 'lit';
import baseCss from './base.css?inline';

/** Base styles adopted by every prismUI component (a single shared CSSStyleSheet). */
export const baseStyles: CSSResult = unsafeCSS(baseCss);
