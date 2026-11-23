import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { PrismI18n, formatString, type PrismStringKey, type PrismStrings } from './i18n.js';

type LocalizeHost = ReactiveControllerHost & HTMLElement & { strings?: Partial<PrismStrings> };

/** Closest `lang` attribute, crossing shadow boundaries. */
function closestLang(el: Element): string {
  let node: Node | null = el;
  while (node) {
    if (node instanceof Element && node.hasAttribute('lang')) return node.getAttribute('lang') || 'en';
    node = node instanceof ShadowRoot ? node.host : node.parentNode;
  }
  return document.documentElement.lang || 'en';
}

const hosts = new Set<LocalizeController>();
let observer: MutationObserver | undefined;

function observeDocument() {
  if (observer || typeof MutationObserver === 'undefined') return;
  observer = new MutationObserver(() => hosts.forEach((h) => h.refresh()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'], subtree: true });
}

/**
 * Language and direction for a component (ux-spec.md §1.7–1.8): `lang` from the closest `[lang]`,
 * `dir` from the computed direction, strings from PrismI18n merged with the host's `strings` override.
 */
export class LocalizeController implements ReactiveController {
  lang = 'en';
  dir: 'ltr' | 'rtl' = 'ltr';
  private unsubscribe?: () => void;

  constructor(private readonly host: LocalizeHost) {
    host.addController(this);
  }

  hostConnected(): void {
    hosts.add(this);
    observeDocument();
    this.unsubscribe = PrismI18n.subscribe(() => this.host.requestUpdate());
    this.refresh(false);
  }

  hostDisconnected(): void {
    hosts.delete(this);
    this.unsubscribe?.();
  }

  /** Re-reads lang/dir; requests an update if they changed. */
  refresh(update = true): void {
    const lang = closestLang(this.host);
    const dir = getComputedStyle(this.host).direction === 'rtl' ? 'rtl' : 'ltr';
    if (lang !== this.lang || dir !== this.dir) {
      this.lang = lang;
      this.dir = dir;
      if (update) this.host.requestUpdate();
    }
  }

  /** Localized string with `{placeholders}` replaced. */
  term(key: PrismStringKey, values?: Record<string, string | number>): string {
    const dict = { ...PrismI18n.get(this.lang), ...this.host.strings };
    return formatString(dict[key] ?? key, values, this.lang);
  }
}
