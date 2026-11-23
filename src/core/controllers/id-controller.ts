import type { ReactiveController, ReactiveControllerHost } from 'lit';

let counter = 0;

/** Stable unique ids inside a shadow root: `prism-<tag>-<n>-<suffix>`. */
export class IdController implements ReactiveController {
  readonly base: string;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    this.base = `${host.localName}-${++counter}`;
    host.addController(this);
  }

  id(suffix: string): string {
    return `${this.base}-${suffix}`;
  }

  hostConnected(): void {}
}
