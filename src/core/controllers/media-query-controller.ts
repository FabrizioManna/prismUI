import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** Common capability queries (architecture.md §3.4, P.1). Breakpoints copy --prism-bp-* in clear. */
export const PRISM_MEDIA = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  reducedTransparency: '(prefers-reduced-transparency: reduce)',
  moreContrast: '(prefers-contrast: more)',
  forcedColors: '(forced-colors: active)',
  coarse: '(pointer: coarse)',
  hover: '(hover: hover)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

/** Tracks one media query and re-renders the host when it changes. */
export class MediaQueryController implements ReactiveController {
  matches = false;
  private mql?: MediaQueryList;
  private readonly onChange = (e: MediaQueryListEvent) => {
    this.matches = e.matches;
    this.host.requestUpdate();
  };

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly query: string,
  ) {
    host.addController(this);
    if (typeof matchMedia !== 'undefined') this.matches = matchMedia(query).matches;
  }

  hostConnected(): void {
    this.mql = matchMedia(this.query);
    this.matches = this.mql.matches;
    this.mql.addEventListener('change', this.onChange);
  }

  hostDisconnected(): void {
    this.mql?.removeEventListener('change', this.onChange);
  }
}
