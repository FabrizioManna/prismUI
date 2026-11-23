/** Shared public types. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;

export type PrismSize = 'sm' | 'md' | 'lg';

/** Intent roles from visual-tokens.md. `danger` everywhere, never `error`. */
export type PrismIntent = 'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
