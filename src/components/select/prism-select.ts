import { html, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { PrismElement } from '../../core/prism-element.js';
import { FormAssociatedMixin, type PrismValidationResult } from '../../core/mixins/form-associated.js';
import { FocusableMixin } from '../../core/mixins/focusable.js';
import { IdController } from '../../core/controllers/id-controller.js';
import { ValidationController } from '../../core/controllers/validation-controller.js';
import { OverlayStateController } from '../../core/controllers/overlay-state-controller.js';
import { DismissController } from '../../core/controllers/dismiss-controller.js';
import { TypeaheadController } from '../../core/controllers/typeahead-controller.js';
import { MediaQueryController } from '../../core/controllers/media-query-controller.js';
import { LocalizeController } from '../../core/i18n/localize-controller.js';
import { PrismAnnouncer } from '../../core/a11y/announcer.js';
import type { PrismOverlayReason } from '../../core/events.js';
import type { PrismStrings } from '../../core/i18n/i18n.js';
import type { PrismSize } from '../../core/types.js';
import '../icon/define.js';
import styles from './prism-select.css?inline';

interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
  group?: string;
}

/** Below `sm` with a coarse pointer the listbox becomes a bottom sheet (ux-spec §2.3). */
const SHEET_QUERY = '(max-width: 639.98px) and (pointer: coarse)';

/**
 * Select-only combobox (APG) with `prism-option` / `prism-option-group` children. Controlled:
 * opening and closing emit cancelable `prism-open-request` / `prism-close-request` and the owner sets `open`;
 * choosing emits `prism-change` (`reason: 'select' | 'remove' | 'reset' | 'restore'`) and the owner sets `value`.
 * With `searchable` typing emits `prism-search { query }`: the owner filters the options.
 *
 * @summary Accessible glass select.
 * @slot - `prism-option` and `prism-option-group` elements.
 * @fires prism-open-request - Asks the owner to open (trigger, typing).
 * @fires prism-close-request - Asks the owner to close (select, escape, outside, tab, close-button).
 * @fires prism-open - `open` became true.
 * @fires prism-close - `open` became false.
 * @fires prism-change - Proposed value.
 * @fires prism-search - Query typed in a searchable select.
 * @csspart form-control - Outer wrapper.
 * @csspart label - Label.
 * @csspart combobox - Trigger (role combobox).
 * @csspart display-value - Selected label or placeholder.
 * @csspart listbox - Listbox popup.
 * @csspart option - Option.
 * @csspart tag - Selected value chip (multiple).
 * @csspart sheet - Bottom sheet dialog (mobile).
 * @cssprop --prism-select-radius - Radius.
 */
export class PrismSelect extends FocusableMixin(FormAssociatedMixin(PrismElement)) {
  static override tagName = 'prism-select';
  static override styles = [PrismElement.styles, unsafeCSS(styles)];

  /** Controlled value: a string, or an array of strings with `multiple`. */
  @property() value: string | string[] = '';
  @property({ attribute: 'default-value' }) defaultValue: string | string[] = '';
  /** Controlled popup state. */
  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property() placeholder = '';
  @property({ attribute: 'help-text' }) helpText = '';
  @property({ attribute: 'error-text' }) errorText = '';
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) searchable = false;
  @property({ reflect: true }) size: PrismSize = 'md';
  @property({ attribute: false }) strings: Partial<PrismStrings> = {};

  readonly validation = new ValidationController(this, () => this.internals);
  private readonly overlay = new OverlayStateController(this);
  private readonly ids = new IdController(this);
  private readonly localize = new LocalizeController(this);
  private readonly sheetQuery = new MediaQueryController(this, SHEET_QUERY);
  private readonly typeahead = new TypeaheadController();

  @state() private options: OptionData[] = [];
  @state() private activeIndex = -1;
  @state() private query = '';
  private observer?: MutationObserver;

  constructor() {
    super();
    new DismissController(this, () => this.requestClose('outside'));
  }

  private get selected(): string[] {
    const v = this.value;
    return Array.isArray(v) ? v : v ? [v] : [];
  }
  private get useSheet(): boolean {
    return this.sheetQuery.matches;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.readOptions();
    this.observer = new MutationObserver(() => this.readOptions());
    this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  private readOptions() {
    const list: OptionData[] = [];
    for (const o of this.querySelectorAll('prism-option')) {
      const group = o.parentElement?.localName === 'prism-option-group' ? o.parentElement.getAttribute('label') : null;
      list.push({
        value: o.getAttribute('value') ?? '',
        label: (o.textContent ?? '').replace(/\s+/g, ' ').trim(),
        disabled: o.hasAttribute('disabled'),
        ...(group !== null ? { group } : {}),
      });
    }
    const changed = list.length !== this.options.length;
    this.options = list;
    if (this.activeIndex >= list.length) this.activeIndex = this.firstEnabled(0, 1);
    if (changed && this.open && this.searchable && this.hasUpdated) {
      PrismAnnouncer.announce(
        list.length ? this.localize.term('optionsCount', { count: list.length }) : this.localize.term('noOptions'),
      );
    }
  }

  protected override formValue(): FormDataEntryValue | FormData | null {
    if (!this.multiple) return this.selected[0] ?? '';
    const data = new FormData();
    for (const v of this.selected) data.append(this.name, v);
    return data;
  }

  protected override validate(): PrismValidationResult {
    const anchor = this.renderRoot?.querySelector<HTMLElement>('[part~="combobox"]') ?? undefined;
    if (this.required && this.selected.length === 0) {
      return { flags: { valueMissing: true }, message: this.localize.term('selectPlaceholder'), anchor };
    }
    return { flags: {}, message: '', anchor };
  }

  protected override resetToDefault(): void {
    this.validation.reset();
    this.emitChange('value', this.defaultValue, { reason: 'reset', native: false });
  }

  protected override restoreFrom(state: FormDataEntryValue | FormData | null, mode: 'restore' | 'autocomplete'): void {
    if (typeof state === 'string') this.emitChange('value', state, { reason: mode, native: false });
    else if (state instanceof FormData)
      this.emitChange('value', state.getAll(this.name).map(String), { reason: mode, native: false });
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('open') && this.open) {
      const first = this.options.findIndex((o) => !o.disabled && this.selected.includes(o.value));
      this.activeIndex = first >= 0 ? first : this.firstEnabled(0, 1);
    }
    if (changed.has('open') && !this.open) {
      this.query = '';
      this.typeahead.reset();
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (!changed.has('open') && !changed.has('options' as keyof PrismSelect)) return;
    const sheet = this.renderRoot.querySelector<HTMLDialogElement>('dialog[part~="sheet"]');
    const popup = this.renderRoot.querySelector<HTMLElement>('[part~="listbox"][popover]');
    if (sheet) {
      if (this.open && !sheet.open) sheet.showModal();
      else if (!this.open && sheet.open) {
        sheet.close();
        this.comboboxEl?.focus();
      }
    } else if (popup) {
      if (this.open) {
        if (!popup.matches(':popover-open')) popup.showPopover();
        this.position(popup);
      } else if (popup.matches(':popover-open')) popup.hidePopover();
    }
    if (this.open) this.activeEl()?.scrollIntoView({ block: 'nearest' });
  }

  private get comboboxEl(): HTMLElement | null {
    return this.renderRoot?.querySelector<HTMLElement>('[part~="combobox"]') ?? null;
  }

  private position(popup: HTMLElement) {
    const anchor = this.comboboxEl;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const below = innerHeight - r.bottom;
    popup.style.minWidth = `${r.width}px`;
    popup.style.left = `${Math.max(0, Math.min(r.left, innerWidth - popup.offsetWidth))}px`;
    if (below < popup.offsetHeight && r.top > below)
      popup.style.top = `${Math.max(0, r.top - popup.offsetHeight - 4)}px`;
    else popup.style.top = `${r.bottom + 4}px`;
  }

  private activeEl(): HTMLElement | null {
    return this.activeIndex < 0 ? null : this.renderRoot.querySelector(`#${this.ids.id(`opt-${this.activeIndex}`)}`);
  }

  private firstEnabled(from: number, step: 1 | -1): number {
    for (let i = from; i >= 0 && i < this.options.length; i += step) if (!this.options[i]!.disabled) return i;
    return -1;
  }

  private move(to: 'next' | 'prev' | 'first' | 'last') {
    const n = this.options.length;
    let idx = this.activeIndex;
    if (to === 'first') idx = this.firstEnabled(0, 1);
    else if (to === 'last') idx = this.firstEnabled(n - 1, -1);
    else {
      const next = this.firstEnabled(idx + (to === 'next' ? 1 : -1), to === 'next' ? 1 : -1);
      if (next >= 0) idx = next;
    }
    this.activeIndex = idx;
  }

  private requestOpen(reason: PrismOverlayReason) {
    if (!this.isDisabled && !this.readonly) this.overlay.requestOpen(reason);
  }
  private requestClose(reason: PrismOverlayReason) {
    this.overlay.requestClose(reason);
  }

  private choose(index: number) {
    const opt = this.options[index];
    if (!opt || opt.disabled || this.isDisabled || this.readonly) return;
    this.validation.markTouched();
    if (this.multiple) {
      const sel = this.selected;
      const next = sel.includes(opt.value) ? sel.filter((v) => v !== opt.value) : [...sel, opt.value];
      this.emitChange('value', next, { reason: 'select' });
    } else {
      this.emitChange('value', opt.value, { reason: 'select' });
      this.requestClose('select');
    }
  }

  private removeValue(value: string) {
    this.emitChange(
      'value',
      this.selected.filter((v) => v !== value),
      { reason: 'remove' },
    );
  }

  private onKeydown(event: KeyboardEvent) {
    if (this.isDisabled) return;
    const { key } = event;
    if (!this.open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key) && !(this.searchable && key === ' ')) {
        event.preventDefault();
        this.requestOpen('trigger');
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey) return;
        this.move('next');
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) this.choose(this.activeIndex);
        else this.move('prev');
        return;
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        if (this.searchable && (key === 'Home' || key === 'End')) return;
        event.preventDefault();
        this.move(key === 'Home' || key === 'PageUp' ? 'first' : 'last');
        return;
      case 'Enter':
        event.preventDefault();
        this.choose(this.activeIndex);
        return;
      case ' ':
        if (this.searchable) return;
        event.preventDefault();
        this.choose(this.activeIndex);
        return;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.requestClose('escape');
        return;
      case 'Tab':
        if (!this.useSheet) this.requestClose('tab');
        return;
    }
    if (!this.searchable && TypeaheadController.accepts(event)) {
      const idx = this.typeahead.match(
        key,
        this.options.map((o) => o.label),
        this.options.map((o) => o.disabled),
        this.activeIndex,
      );
      if (idx >= 0) this.activeIndex = idx;
    }
  }

  private onSearchInput(event: Event) {
    event.stopPropagation();
    this.query = (event.target as HTMLInputElement).value;
    if (!this.open) this.requestOpen('typing');
    this.emit('prism-search', { query: this.query });
  }

  private onTriggerClick() {
    if (this.open) this.requestClose('trigger');
    else this.requestOpen('trigger');
  }

  /** Focus trap inside the bottom sheet and Esc through the dialog's cancel event. */
  private onSheetKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const sheet = event.currentTarget as HTMLElement;
    const items = Array.from(sheet.querySelectorAll<HTMLElement>('button, input, [tabindex="0"]'));
    if (!items.length) return;
    const current = this.renderRoot instanceof ShadowRoot ? this.renderRoot.activeElement : null;
    const i = items.indexOf(current as HTMLElement);
    const next = event.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i >= items.length - 1 ? 0 : i + 1;
    event.preventDefault();
    items[next]!.focus();
  }

  /* eslint-disable lit-a11y/click-events-have-key-events -- options are driven from the combobox (aria-activedescendant) */
  private renderOptionList() {
    let lastGroup: string | undefined;
    const sel = this.selected;
    return this.options.map((o, i) => {
      const header =
        o.group !== undefined && o.group !== lastGroup
          ? html`<div class="group-label" role="presentation">${o.group}</div>`
          : nothing;
      lastGroup = o.group;
      const isSel = sel.includes(o.value);
      // Keyboard goes through the combobox (aria-activedescendant), APG select-only pattern.
      return html`${header}
        <div
          part="option"
          class="option"
          role="option"
          id=${this.ids.id(`opt-${i}`)}
          aria-selected=${isSel ? 'true' : 'false'}
          aria-disabled=${ifDefined(o.disabled ? 'true' : undefined)}
          ?data-active=${i === this.activeIndex}
          @mousedown=${(e: Event) => e.preventDefault()}
          @click=${() => {
            this.activeIndex = i;
            this.choose(i);
          }}
        >
          <span class="option-label">${o.label}</span>
          ${isSel ? html`<prism-icon name="prism:check" class="check"></prism-icon>` : nothing}
        </div>`;
    });
  }

  /* eslint-enable lit-a11y/click-events-have-key-events */

  private renderListbox(popover: boolean) {
    return html`<div
      part="listbox"
      class="listbox prism-glass"
      role="listbox"
      id=${this.ids.id('listbox')}
      popover=${ifDefined(popover ? 'manual' : undefined)}
      aria-labelledby=${this.ids.id('label')}
      aria-multiselectable=${ifDefined(this.multiple ? 'true' : undefined)}
      aria-activedescendant=${ifDefined(!popover && this.activeIndex >= 0 ? this.ids.id(`opt-${this.activeIndex}`) : undefined)}
      tabindex=${popover ? '-1' : '0'}
      @keydown=${popover ? undefined : this.onKeydown}
    >
      ${this.options.length ? this.renderOptionList() : html`<div class="empty">${this.localize.term('noOptions')}</div>`}
    </div>`;
  }

  override render() {
    const sel = this.selected;
    const labels = sel.map((v) => this.options.find((o) => o.value === v)?.label ?? v);
    const display = this.multiple
      ? sel.length
        ? this.localize.term('selectedCount', { count: sel.length })
        : ''
      : (labels[0] ?? '');
    const placeholder = this.placeholder || this.localize.term('selectPlaceholder');
    const active = this.open && this.activeIndex >= 0 ? this.ids.id(`opt-${this.activeIndex}`) : undefined;
    const hasHelp = !!this.helpText;
    const showError = this.validation.showError && !!this.errorText;
    const describedBy = [hasHelp && this.ids.id('help'), showError && this.ids.id('error')].filter(Boolean).join(' ');
    const common = {
      expanded: this.open ? 'true' : 'false',
      controls: this.ids.id('listbox'),
    };
    const sheet = this.useSheet;

    const trigger = this.searchable
      ? html`<input
          part="combobox"
          class="combobox prism-input prism-field prism-glass"
          data-focus-target
          role="combobox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-expanded=${common.expanded}
          aria-controls=${common.controls}
          aria-activedescendant=${ifDefined(active)}
          aria-labelledby=${this.ids.id('label')}
          aria-describedby=${ifDefined(describedBy || undefined)}
          aria-invalid=${this.validation.showError ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          placeholder=${display || placeholder}
          .value=${live(this.open ? this.query : display)}
          ?disabled=${this.isDisabled}
          ?readonly=${this.readonly}
          autocomplete="off"
          @input=${this.onSearchInput}
          @keydown=${this.onKeydown}
          @click=${() => !this.open && this.requestOpen('trigger')}
        />`
      : html`<div
          part="combobox"
          class="combobox prism-input prism-field prism-glass"
          data-focus-target
          role="combobox"
          tabindex=${this.isDisabled ? '-1' : '0'}
          aria-haspopup="listbox"
          aria-expanded=${common.expanded}
          aria-controls=${common.controls}
          aria-activedescendant=${ifDefined(active)}
          aria-labelledby="${this.ids.id('label')} ${this.ids.id('value')}"
          aria-describedby=${ifDefined(describedBy || undefined)}
          aria-invalid=${this.validation.showError ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          aria-disabled=${ifDefined(this.isDisabled ? 'true' : undefined)}
          ?data-invalid=${this.validation.showError}
          @keydown=${this.onKeydown}
          @click=${this.onTriggerClick}
        >
          <span part="display-value" class="display" id=${this.ids.id('value')} ?data-placeholder=${!display}
            >${display || placeholder}</span
          >
          <prism-icon name="prism:chevron-down" class="chevron"></prism-icon>
        </div>`;

    return html`<div part="form-control" class="form-control">
      <span part="label" class="label" id=${this.ids.id('label')} ?hidden=${!this.label}
        >${this.label}${this.required ? html`<span class="required" aria-hidden="true">*</span>` : nothing}</span
      >
      ${trigger}
      ${
        this.multiple && sel.length
          ? html`<div class="tags">
              ${sel.map(
                (v, i) =>
                  html`<span part="tag" class="tag"
                    ><span>${labels[i]}</span
                    ><button
                      type="button"
                      class="tag-remove focus-ring"
                      aria-label=${this.localize.term('remove', { label: labels[i] ?? v })}
                      ?disabled=${this.isDisabled}
                      @click=${() => this.removeValue(v)}
                    >
                      <prism-icon name="prism:x"></prism-icon></button
                  ></span>`,
              )}
            </div>`
          : nothing
      }
      ${
        sheet
          ? html`<dialog
              part="sheet"
              class="sheet prism-glass"
              aria-modal="true"
              aria-labelledby=${this.ids.id('label')}
              @cancel=${(e: Event) => {
                e.preventDefault();
                this.requestClose('escape');
              }}
              @keydown=${this.onSheetKeydown}
            >
              <div class="sheet-header">
                <span class="sheet-title">${this.label}</span>
                <button
                  type="button"
                  class="sheet-close focus-ring"
                  aria-label=${this.localize.term('close')}
                  @click=${() => this.requestClose('close-button')}
                >
                  <prism-icon name="prism:x"></prism-icon>
                </button>
              </div>
              <div class="sheet-body">${this.renderListbox(false)}</div>
            </dialog>`
          : this.renderListbox(true)
      }
      <div part="error-text" class="error" id=${this.ids.id('error')} ?hidden=${!showError}>${this.errorText}</div>
      <div part="help-text" class="help" id=${this.ids.id('help')} ?hidden=${!hasHelp}>${this.helpText}</div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prism-select': PrismSelect;
  }
}
