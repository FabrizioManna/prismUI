/** Breakpoints in px: copy of --prism-bp-* (a custom property is not valid inside @media). Mobile first. */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;
export type PrismBreakpoint = keyof typeof BREAKPOINTS;
