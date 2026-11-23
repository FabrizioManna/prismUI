# Migrating from prismUI 1.x to 2.0.0

> **Status:** draft. prismUI 2.0.0 is a **rewrite from scratch** with breaking changes. The version on npm is **1.1.0** (git tag `v-1.1.0`); **2.0.0 is not published to npm** and is installed from the Git repository or a local build.
> **Sources:** the 1.x API is taken from the repository history (tag `v-1.1.0`: `package.json`, `src/index.ts`, `src/components/**`, `src/styles/tailwind.css`, old `README.md`). The 2.0 API is taken from `architecture.md` v0.3 (reference for API names, events, event order and `cancelable`), `visual-tokens.md` (tokens) and the working `package.json`. Anything that cannot be grounded in those sources is marked **To verify**.

## Contents

1. [Summary](#1-summary)
2. [Package, build and imports](#2-package-build-and-imports)
3. [Design tokens and theming](#3-design-tokens-and-theming)
4. [Controlled components](#4-controlled-components)
5. [Renamed, rewritten and new components](#5-renamed-rewritten-and-new-components)
6. [Events](#6-events)
7. [Properties and attributes](#7-properties-and-attributes)
8. [Visual and accessibility changes](#8-visual-and-accessibility-changes)
9. [Upgrade checklist](#9-upgrade-checklist)
10. [Points to verify](#10-points-to-verify)

---

## 1. Summary

| Area | 1.x | 2.0 |
|---|---|---|
| Distribution | npm (`npm install @fabrizio.manna/prismui`) | **not on npm**: Git repository / local build (`npm run build` + `npm pack`) |
| Module format | ESM + UMD (`dist/prismui.es.js`, `dist/prismui.umd.js`) | **ESM only**, one entry per component |
| Lit | regular dependency | **peer dependency** (`lit ^3.3.3`) |
| Registration | `@customElement` on import, throws if a tag is registered twice | idempotent `define()`; per-component entries; `…/class` entries register nothing |
| Theme tokens | `--glass-bg`, `--glass-border`, `--glass-shadow` inside each component | full `--prism-*` token set in a global stylesheet you load once (`tokens.css`) |
| Dark mode | `.dark` class, but Tailwind `dark:` classes did not reach the shadow DOM | `.dark` class (or `data-theme="dark"`) that actually themes every component through tokens |
| State | components changed their own `checked`, `open`, `activeTab`, `currentPage`… | **controlled**: components emit requests, your code updates the properties |
| Events | `change`, `input-change`, `tab-change`, `close`… (not bubbling across shadow roots) | `prism-*` events, `bubbles` + `composed`; form controls also emit native `input`/`change` |
| Forms | not form-associated | form-associated custom elements (`name`, validation, reset, `<fieldset disabled>`) |
| Renamed tags | `prism-toggle`, `prism-table`, `prism-drawer` | `prism-switch`, `prism-datatable`, `prism-modal placement="…"` |
| Kept and rewritten | `prism-textarea`, `prism-file-upload`, `prism-stat`, `prism-alert` | same tags, new controlled APIs (§5–§7) |

## 2. Package, build and imports

The package name is unchanged: `@fabrizio.manna/prismui`.

**2.0.0 is not on npm.** `package.json` is `"private": true` on purpose, so `npm install @fabrizio.manna/prismui` (or `@latest`) keeps giving you **1.1.0**. Build and install 2.0.0 from the repository (Node.js ≥ 24):

```bash
git clone https://github.com/FabrizioManna/prismUI.git
cd prismUI && git checkout feat/glassmorphism-framework
npm install && npm run build && npm pack
# in your app (uninstall 1.x first if needed):
npm install /path/to/prismUI/fabrizio.manna-prismui-2.0.0.tgz lit
```

The package keeps its name, so your imports stay `@fabrizio.manna/prismui/…`. See [docs/getting-started.md](./docs/getting-started.md#1-install).


**Install Lit yourself.** It moved from `dependencies` to `peerDependencies`, so your app provides the single copy (`lit` in the command above).

**UMD and CommonJS are gone.** 1.x exposed `main: dist/prismui.umd.js` and a `require` condition. 2.0 is ESM only (`"type": "module"`, `exports["."].default = ./dist/index.js`). Use a bundler or native ES modules; there is no prebuilt `<script>` bundle.

**Import per component.** 1.x had a single entry that registered all 34 tags:

```js
// 1.x
import '@fabrizio.manna/prismui';
```

2.0 keeps an "everything" entry, but the recommended way is one import per component, which keeps your bundle small:

```js
// 2.0
import '@fabrizio.manna/prismui/button';
import '@fabrizio.manna/prismui/input';

// class only, nothing registered (extend it, custom tag, scoped registries, tests)
import { PrismButton } from '@fabrizio.manna/prismui/button/class';
PrismButton.define('acme-button');
```

Registration is now idempotent: loading the library twice no longer throws "this name has already been used".

**Other package changes:**

| 1.x | 2.0 |
|---|---|
| `custom-elements.json` at the package root (`"customElements": "custom-elements.json"`) | `dist/custom-elements.json`, exported as `@fabrizio.manna/prismui/custom-elements.json` |
| `lucide` and `lucide-static` dependencies | `lucide-static` only; new dependencies `@lit/context`, `@floating-ui/dom` |
| `sharedStyles` exported from the main entry (the whole compiled Tailwind CSS) | **removed** |
| no stylesheet to import | `@fabrizio.manna/prismui/tokens.css` (required, see §3) |
| — | `@fabrizio.manna/prismui/core`: shared types and theme helpers (`setTheme`, `getTheme`, `setReducedTransparency`) |

## 3. Design tokens and theming

### 3.1 Load the token stylesheet

In 1.x the glass variables were injected with each component's styles. In 2.0 the tokens live in the light DOM and every component inherits them. Load them **once**:

```js
import '@fabrizio.manna/prismui/tokens.css';
```

Without it, components render unthemed.

### 3.2 Dark mode

You keep using the `dark` class on an ancestor (usually `<html>`), and `data-theme="dark"` now works too. The difference is that it finally works everywhere: in 1.x only the three `--glass-*` variables changed with the theme, because Tailwind `dark:` selectors inside the shadow DOM could not see the `.dark` class on `<html>`. In 2.0 components contain no `dark:` classes; the theme is only token values, and it can be applied to a subtree.

You no longer need Tailwind in your app for prismUI.

### 3.3 Renamed CSS custom properties

If you overrode the 1.x variables, rename them (mapping from `visual-tokens.md` §5):

| 1.x | 2.0 | Note |
|---|---|---|
| `--glass-bg` (light `rgba(255,255,255,0.4)`, dark `rgba(15,23,42,0.6)`) | `--prism-glass-surface-deco-2` | decorative only. Surfaces with text use `--prism-glass-surface-solid-0…4` or `--prism-glass-slab` |
| `--glass-border` | `--prism-glass-border` | decorative only. Control boundaries use `--prism-control-border` |
| `--glass-shadow` | `--prism-shadow-2` | |
| `blur(12px)` (`.prism-glass`) | `--prism-glass-blur-md` | |
| `blur(16px)` (`.prism-glass-panel`) | `--prism-glass-blur-lg` | |
| `.prism-glass-panel` light background `rgba(255,255,255,0.15)` | `--prism-glass-surface-deco-0` | |
| `.dark .prism-glass-panel` background `rgba(15,23,42,0.5)` | `--prism-glass-surface-deco-1` | |
| top/left border `rgba(255,255,255,0.3)` / dark `0.15` | `--prism-glass-border-luminous` | |
| `.text-high-contrast` (`#ffffff`) | `--prism-color-text-inverse` | |
| `focus:ring-*` utilities | `--prism-focus-ring-inner` / `--prism-focus-ring-outer` / `--prism-focus-ring-width` / `--prism-focus-ring-offset` | double opaque ring |
| `opacity-50` for disabled | `--prism-state-disabled-opacity` | |

Prefer the 2.0 customisation order: redefine semantic tokens (`--prism-color-primary`…), then component properties (`--prism-button-radius`…), then `::part()`.

## 4. Controlled components

This is the biggest behavioural change. In 1.x components updated their own state and then fired an event, for example (from the 1.x source):

- `prism-toggle` flipped `this.checked` and fired `change`;
- `prism-checkbox` set `this.checked` and cleared `indeterminate`;
- `prism-tabs` set `this.activeTab` and fired `tab-change`;
- `prism-pagination` set `this.currentPage` and fired `page-change`;
- `prism-modal` / `prism-drawer` set `this.open = false` and fired `close`.

In 2.0 **no component changes its own state properties**. It emits a request with the proposed value and waits for you to write the property back. If your 1.x code only *listened* to events, the UI will now look "frozen" until you apply the requests:

```js
// 1.x: the toggle flipped itself, you just observed it
toggle.addEventListener('change', (e) => save(e.detail.checked));

// 2.0: you own the state
sw.addEventListener('prism-change', (e) => {
  sw.checked = e.detail.checked;   // apply (or don't, to reject)
  save(e.detail.checked);
});
```

```js
// 1.x: the modal closed itself
modal.addEventListener('close', onClosed);

// 2.0: the modal asks, you decide
modal.addEventListener('prism-close-request', (e) => { modal.open = false; });
modal.addEventListener('prism-close', onClosed); // notification: really closed, focus restored
```

To refuse a value, just don't update the property: `prism-change` and `prism-*-change` are not cancelable. Only `prism-open-request`, `prism-close-request` and `prism-navigate` are, so that a guard can block an open, a close or a navigation with `preventDefault()`. Form controls also emit the native `input`/`change` synchronously right after their `prism-*` event; while they are dispatched, `event.target.value` returns the proposed value.

For plain HTML pages without a framework, add one delegated `prism-change` listener that applies the requests (example in [getting-started §6](./docs/getting-started.md#without-a-framework)).

See [docs/getting-started.md](./docs/getting-started.md#6-controlled-components-state-lives-outside) for the full model.

## 5. Renamed, rewritten and new components

| 1.x | 2.0 | Notes |
|---|---|---|
| `<prism-toggle>` | `<prism-switch>` | "toggle" is now a mode of `prism-button` (`toggle` + `pressed`) |
| `<prism-table>` | `<prism-datatable>` | fully controlled: it shows the `rows` you pass, already sorted, filtered and paginated |
| `<prism-drawer position="right">` | `<prism-modal placement="end">` | `position="left"` → `placement="start"`; also `top`/`bottom`. `start`/`end` follow text direction (RTL) |
| `<prism-tabs .tabs=${[…]} active-tab>` | `<prism-tabs>` + `<prism-tab name>` + `<prism-tab-panel name>`, selected tab in `value` | |
| `<prism-accordion title open>` (one section per element) | `<prism-accordion>` + `<prism-accordion-item>`; open items listed in the accordion's `expanded` | |
| `<prism-breadcrumb .items>` | `.items` still accepted, or `<prism-breadcrumb-item>` children | |
| `<prism-select .options>` | `.options` still accepted, or `<prism-option>` / `<prism-option-group>` children | |
| `<prism-menu>` / `<prism-menu-item>` | same tags, plus `prism-menu-group` and `prism-menu-separator`; generic popovers move to the new `prism-dropdown` | |
| `<prism-textarea>`, `<prism-file-upload>`, `<prism-stat>`, `<prism-alert>` | same tag names, rewritten like the others (§6, §7) | the file upload no longer keeps the selected files itself; the alert is shown while it is in the DOM |
| `<prism-icon>`, `<prism-badge>`, `<prism-avatar>`, `<prism-card>`, `<prism-progress>`, `<prism-spinner>`, `<prism-tooltip>`, `<prism-navbar>`, `<prism-sidebar>`, `<prism-pagination>`, `<prism-button>`, `<prism-input>`, `<prism-checkbox>`, `<prism-radio>`, `<prism-radio-group>`, `<prism-slider>`, `<prism-modal>`, `<prism-toast>` | same tag names, new APIs (§6, §7) | |

New in 2.0: `prism-date-picker`, `prism-time-picker`, `prism-dropdown`, `prism-checkbox-group`, `prism-avatar-group`, `prism-toast-region`, `prism-nav-item`, `prism-nav-group`, `prism-sidebar-item`, `prism-sidebar-group`, `prism-divider`, `prism-visually-hidden`, `prism-calendar`.

## 6. Events

All 2.0 events are `prism-*`, bubble and are `composed`, so you can listen on any ancestor. 1.x events were dispatched without `bubbles`/`composed`, and `change`/`toggle`/`close` collided with native event names.

| Component | 1.x event (`detail`) | 2.0 event (`detail`) |
|---|---|---|
| `prism-textarea` | `input-change` (`{ value }`) on every keystroke | `prism-input` (`{ value }`) while typing; `prism-change` (`{ value, previousValue, reason }`) on commit (blur); native `input` / `change` |
| `prism-file-upload` | `files-selected` (`{ files }`), after the component stored the files itself | `prism-change` (`{ files, previousFiles, added, removed, rejected, reason: 'pick' \| 'drop' \| 'paste' \| 'remove' \| 'reset' }`): set `files` yourself; `prism-remove` (`{ file }`) for one file; native `input` / `change` |
| `prism-alert` | none (not dismissible) | `prism-close-request` (`{ reason: 'close-button' \| 'escape' }`) with `dismissible`: remove the alert or set `hidden` |
| `prism-stat` | none | none |
| `prism-card` | none | `prism-change` (`{ selected }`) with `selectable`; `prism-navigate` (`{ href }`) with `href` |
| `prism-input` | `input-change` (`{ value }`) on every keystroke | `prism-input` (`{ value }`) while typing; `prism-change` (`{ value, previousValue, reason }`) on commit (blur or Enter); native `input` / `change` |
| `prism-checkbox` | `change` (`{ checked }`) | `prism-change` (`{ checked, indeterminate: false, value, reason }`); native `input` / `change` |
| `prism-toggle` → `prism-switch` | `change` (`{ checked }`) | `prism-change` (`{ checked, reason }`); native `input` / `change` |
| `prism-select` | `change` (`{ value }`) | `prism-change` (`{ value, previousValue, reason }`); `prism-search`; open/close requests; native `input` / `change` |
| `prism-slider` | `change` (`{ value }`) | `prism-input` while dragging, `prism-change` (`{ value, previousValue, reason }`) on release; native `input` / `change` |
| `prism-radio-group` | `change` (`{ value }`) | `prism-change` (`{ value, previousValue, reason }`); native `input` / `change` |
| `prism-radio` | `radio-select` | none: listen on the group |
| `prism-tabs` | `tab-change` (`{ activeTab }`) | `prism-change` (`{ value, previousValue, reason }`); `prism-remove` (`{ name }`) for a closable tab |
| `prism-accordion` | `toggle` (`{ open }`) | `prism-expanded-change` (`{ expanded, previousExpanded, name, reason }`) |
| `prism-pagination` | `page-change` (`{ page }`) | `prism-page-change` (`{ page, previousPage }`), `prism-page-size-change` |
| `prism-table` → `prism-datatable` | `sort`, `selection-change` | `prism-sort-change`, `prism-filter-change`, `prism-page-change`, `prism-page-size-change`, `prism-selection-change` (`{ selected, previousSelected, allPagesSelected, reason }`), `prism-action` (`{ action, rowKey?, rowKeys? }`: row activation, row and bulk actions), `prism-retry` |
| `prism-menu-item` | `menu-select` | `prism-action` (`{ value, item }`) on the menu; `prism-change` for checkbox/radio items |
| `prism-modal`, `prism-drawer` | `close` | `prism-close-request` (`{ reason: 'escape' \| 'backdrop' \| 'close-button' \| 'swipe' \| 'form' \| 'api', returnValue? }`), then `prism-open` / `prism-close` notifications |
| `prism-toast` | `close` | `prism-toast-dismiss` (`{ id, reason: 'timeout' \| 'close-button' \| 'escape' \| 'swipe' }`) and `prism-action` (`{ id }`) on `prism-toast-region` |
| `prism-button` | native `click` | native `click` (not fired when disabled or loading); `prism-change` (`{ pressed }`) in toggle mode |

Removed event names (never emitted in 2.0): `input-change`, `files-selected`, `prism-tab-change`, `prism-tab-close`, `prism-select`, `prism-row-activate`, `prism-toast-action`, `prism-clear` (now `prism-change` with `reason: 'clear'`). Only `prism-open-request`, `prism-close-request` (except with `detail.forced: true`) and `prism-navigate` are cancelable.

## 7. Properties and attributes

General rules in 2.0:

- **Attributes are kebab-case.** In 1.x camelCase properties without an explicit attribute became lowercase attributes (`helperText` → `helpertext`, `currentPage` → `currentpage`). In 2.0 every attribute is explicit kebab-case (`help-text`, `total-pages`).
- **`title` → `heading`.** No component property uses the name of a global HTML attribute (`title` also triggered the native browser tooltip).
- **`error` variant → `danger`.** Intent variants are `primary`, `neutral`/`secondary`, `info`, `success`, `warning`, `danger` everywhere.
- **Booleans default to `false`.** Behaviours that are on by default use a negative name (`no-close-button`, `no-backdrop-close`).
- **Labels are required for accessibility** (`label` property or slot); the 1.x hard-coded `ariaLabel` defaults are gone.

Component changes that can be traced between 1.x and the 2.0 spec:

| Component | 1.x | 2.0 |
|---|---|---|
| `prism-modal` | `title` | `heading` (+ `heading-level`) |
| `prism-drawer` → `prism-modal` | `title`, `position: 'left' \| 'right'` | `heading`, `placement: 'start' \| 'end' \| 'top' \| 'bottom'` |
| `prism-toast` | `title`, `description`, `variant: 'error'`, `open` | `heading`, `message`, `variant: 'danger'`; visibility = presence in the region's `toasts` list (no `open`) |
| `prism-card` | `title`, `subtitle`, `no-padding` | `heading` (+ `heading-level`), subtitle as content of `slot="subtitle"`, `padding="none"`; new `variant`, `elevation`, `selectable` |
| `prism-textarea` | `helperText`, `error` (boolean), `minRows` | `help-text`, `invalid` + `error-text`, `rows` (+ `max-rows`, `resize`, `show-counter`, `label`, `name`) |
| `prism-file-upload` | `label` (drop zone text), internal file list | `label` is now the field label; drop zone texts in `strings`; `files` and `fileStates` owned by your app; `accept`, `multiple` kept; new `max-files`, `max-size`, `capture`, `no-dropzone` |
| `prism-stat` | `title`, `value`, `trend` (text such as `"+5.4%"`) | `label`, `value` (+ `formatOptions`), `delta` (the text, e.g. `"+5.4%"`) + `trend: 'up' \| 'down' \| 'flat'` (+ `invert-trend`), `description` |
| `prism-alert` | `variant: 'error'`, `title` | `variant: 'danger'`, `heading` (+ `heading-level`); new `dismissible`, `layout`, `live` |
| `prism-input` | `helperText`, `error` (boolean) | `help-text`, `error-text`, `invalid`; plus `label`, `name`, `required`… |
| `prism-checkbox`, `prism-toggle` | `ariaLabel` property | `label` (or `aria-label` on the host) |
| `prism-radio-group` | `layout: 'vertical' \| 'horizontal'` | `orientation` |
| `prism-tabs` | `tabs` (array), `activeTab` | child `prism-tab` / `prism-tab-panel` with `name`; `value` |
| `prism-accordion` | `title`, `open` | `prism-accordion-item` (`label`, `name`); accordion `expanded` (list of open names) |
| `prism-pagination` | `currentPage`, `totalPages` | `page`, `total-pages` (+ `total-items`, `page-size`) |
| `prism-table` → `prism-datatable` | `columns`, `data`, `selectable`, `rowKey` | `columns`, `rows`, `selection: 'none' \| 'single' \| 'multiple'`, `row-key`; `caption` is required |
| `prism-avatar` | `src`, `alt`, `initials`, `size` (number, px) | `src`, `name`, `initials`, `size: 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `prism-spinner` | `size` (number), `color` (Tailwind class) | `size: 'xs' … 'xl'`, `label`; colour comes from tokens |
| `prism-badge` | `variant: 'default' \| …` | `variant: 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`, `appearance: 'soft' \| 'solid' \| 'outline'` |
| `prism-tooltip` | `text`, `placement: 'top' \| 'bottom' \| 'left' \| 'right'` | `content` (or slot), `for`, `placement: 'top' \| 'bottom' \| 'start' \| 'end'` |
| `prism-progress` | `value`, `max`, `label` | same, plus `min`, `indeterminate`, `variant`, `tone` |
| `prism-button` | `variant` default `'primary'` | default still `'primary'`; `variant` adds `'link'` |
| `prism-icon` | `icon` (name), `size` (number, px) | `name` (registered with `PrismIcon.register({ name: svg })`, e.g. from `lucide-static`), `svg` (trusted SVG string), `label` (meaningful icon; decorative without it), `size: 'inherit' \| 'xs' … 'xl'` (or `--prism-icon-size`), `mirror-rtl` |

## 8. Visual and accessibility changes

These are not API breaks, but your screens will look different:

- **Glass surfaces with text are more opaque** (light α ≥ 0.85, dark α ≥ 0.90) so text passes WCAG 2.2 AA on any backdrop. The very transparent 1.x look (α 0.4) is kept only for decorative, text-free surfaces.
- **Solid colour fills** for status badges and buttons (1.x used `/50` fills with white text, which failed contrast). Info is now sky blue, warning amber-700.
- **New focus ring**: a double opaque ring (white inside, black outline) replaces the translucent blue ring.
- **Controls are 44px tall on touch devices** (mobile first); 32/40/48px with a fine pointer.
- **Opaque fallback** when `backdrop-filter` is unavailable or the user prefers reduced transparency; reduced motion, more contrast and Windows high-contrast mode are honoured.
- **Native forms**: controls with a `name` now submit, validate and reset with the surrounding `<form>`.

See [docs/glassmorphism-guidelines.md](./docs/glassmorphism-guidelines.md).

## 9. Upgrade checklist

- [ ] Build 2.0.0 from the repository and install the local build (tarball from `npm pack` or the folder) with `lit` (2.0.0 is not on npm); remove any UMD / `require` usage.
- [ ] Import `@fabrizio.manna/prismui/tokens.css` once.
- [ ] Switch to per-component imports (optional but recommended).
- [ ] Rename tags: `prism-toggle` → `prism-switch`, `prism-table` → `prism-datatable`, `prism-drawer` → `prism-modal placement="…"`.
- [ ] Rewrite tabs, accordion (and optionally breadcrumb/select) markup with child elements.
- [ ] Rename attributes to kebab-case and `title` → `heading` (`label` on `prism-stat`), `error` → `danger`; split the stat `trend` text into `delta` + `trend`.
- [ ] Replace 1.x event listeners with `prism-*` events (§6), including `files-selected` → `prism-change` on the file upload.
- [ ] **Apply every request event** to the matching property; otherwise components will not react.
- [ ] Rename overridden `--glass-*` variables (§3.3).
- [ ] Check custom backgrounds behind prismUI with the contrast rules of the glass guidelines.
- [ ] Re-test forms: values are now submitted natively.

## 10. Points to verify

| # | Point | Missing or contradictory source |
|---|---|---|
| 1 | Node.js engine changed from `>=26` to `>=24` | working `package.json` only (development requirement, not runtime) |
