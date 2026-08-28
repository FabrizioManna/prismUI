import { css, unsafeCSS } from 'lit';
// Use Vite's ?inline to import the CSS as a string
import tailwindStyles from './tailwind.css?inline';

// We wrap the string in unsafeCSS and export it as a CSSResult
export const sharedStyles = css`${unsafeCSS(tailwindStyles)}`;
