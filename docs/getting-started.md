# Getting started with prismUI 2

> **Status:** draft for prismUI **2.0.0**, which is being rewritten on branch `feat/glassmorphism-framework`. **2.0.0 is not published to npm**: you install it from the Git repository or a local build (see [Install](#1-install)). The version on npm is still **1.1.0**. APIs in this guide follow `architecture.md` v0.3, which is the reference for API names and events; open points are marked **To verify** and collected at the end.
> Coming from 1.x? Read [MIGRATION.md](../MIGRATION.md).

prismUI is a library of standard Web Components built with [Lit](https://lit.dev/), styled as accessible glassmorphism, designed mobile first. Components work in any framework or none.

## Contents

1. [Install](#1-install)
2. [Load the design tokens](#2-load-the-design-tokens)
3. [Register the components](#3-register-the-components)
4. [Page setup](#4-page-setup)
5. [Light and dark theme](#5-light-and-dark-theme)
6. [Controlled components: state lives outside](#6-controlled-components-state-lives-outside)
7. [Example: vanilla JavaScript](#7-example-vanilla-javascript)
8. [Example: Angular](#8-example-angular)
9. [Forms](#9-forms)
10. [Customising](#10-customising)
11. [Points to verify](#points-to-verify)

---

## 1. Install

prismUI 2.0.0 is **not published to npm**: `package.json` has `"private": true` on purpose, so `npm publish` is refused. `npm install @fabrizio.manna/prismui` would give you **1.1.0**, the old API. Install 2.0.0 from a local build instead.

Requirements: Node.js **24 or later** (`engines` in `package.json`) to build the library.

### Build the package

```bash
git clone https://github.com/FabrizioManna/prismUI.git
cd prismUI
git checkout feat/glassmorphism-framework
npm install
npm run build   # vite build + type declarations + Custom Elements Manifest, output in dist/
npm pack        # creates fabrizio.manna-prismui-2.0.0.tgz (contains only dist/ and package.json)
```

### Add it to your app

From the tarball (recommended: version and integrity are pinned in your lockfile):

```bash
npm install /path/to/prismUI/fabrizio.manna-prismui-2.0.0.tgz lit
```

Or straight from the local folder (`dist/` must already be built; useful while developing prismUI and an app side by side):

```bash
npm install /path/to/prismUI lit
```

Either way the package keeps its name, so imports are the same as if it came from a registry: `@fabrizio.manna/prismui/…`.

`lit` (`^3.3.3`) is a **peer dependency**: your app provides it, so only one copy of Lit ends up in your bundle. The package is **ESM only**: use a bundler (Vite, webpack, Angular CLI…) or native ES modules with an import map.

### As a Git dependency

`package.json` has a `prepare` script that builds `dist/`, so npm can install the branch straight from GitHub (npm installs the dev dependencies, runs the build and keeps only the published files):

```bash
npm install github:FabrizioManna/prismUI#feat/glassmorphism-framework lit
```

Pin a commit (`#<sha>`) in production: a branch moves.

> **To verify:** (1) The set of entries in `dist/` is still growing: today `src/components/` ships `icon` and `spinner`; the other components land in phases. (2) `architecture.md` §8.7 also plans a `.tgz` attached to a Git release (tag `v2.0.0`, with SHA-256 checksum) and a tagged Git dependency (`#v2.0.0`); there is no release job or tag yet.

## 2. Load the design tokens

Components read their colours, glass effects, spacing and focus styles from `--prism-*` CSS custom properties. These tokens live in the **light DOM** and are inherited by every component's shadow root. Load the token stylesheet once, globally:

```js
// With a bundler (Vite, webpack, Angular CLI…)
import '@fabrizio.manna/prismui/tokens.css';
```

or in HTML:

```html
<link rel="stylesheet" href="/node_modules/@fabrizio.manna/prismui/dist/tokens/prism-tokens.css" />
```

Without the token file the components render without their theme. The token file also contains the light/dark values, the `backdrop-filter` fallback and the user-preference overrides (reduced transparency, reduced motion, more contrast, fine pointer). See [glassmorphism-guidelines.md](./glassmorphism-guidelines.md).

## 3. Register the components

Import only what you use. Each component has its own entry point, which registers the tag (safely: registering twice is a no-op) and exports the class and types:

```js
import '@fabrizio.manna/prismui/button';  // <prism-button>
import '@fabrizio.manna/prismui/input';   // <prism-input>
import '@fabrizio.manna/prismui/switch';  // <prism-switch>
import '@fabrizio.manna/prismui/modal';   // <prism-modal> (also drawers)
```

Other ways to import:

| Import | Effect | When |
|---|---|---|
| `import '@fabrizio.manna/prismui/button'` | registers `<prism-button>` and exports the class | normal use (recommended) |
| `import { PrismButton } from '@fabrizio.manna/prismui/button/class'` | class only, nothing registered | extending the class, a custom tag (`PrismButton.define('acme-button')`), scoped registries, tests |
| `import '@fabrizio.manna/prismui'` | registers everything | prototypes |

Internal dependencies (for example the spinner inside the button) are registered automatically.

The entry name is the component folder name: the `exports` map resolves `@fabrizio.manna/prismui/<name>` to `dist/components/<name>/define.js` and `…/<name>/class` to the class without registration. `@fabrizio.manna/prismui/core` exports shared types and theme helpers (§5).

> **To verify:** only `icon` and `spinner` are implemented in `src/components/` so far; the other entry names (`button`, `input`, `switch`, `modal`, `textarea`, `file-upload`…) follow the folder names in `architecture.md` §2.1.

## 4. Page setup

prismUI is mobile first. Add a viewport meta tag; `viewport-fit=cover` lets fixed bars, toasts and sheets respect the safe area on phones with a notch:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Glass needs something behind it. The tokens include a recommended page background:

```css
body {
  min-height: 100dvh;
  margin: 0;
  background: var(--prism-bg-gradient);
  color: var(--prism-color-text-primary);
  font-family: var(--prism-font-sans);
  font-size: var(--prism-text-md); /* ≥ 16px on mobile */
}
```

If you use your own backdrop (photos, brand colours), text on prismUI glass surfaces stays readable by design, but text you place directly on the page is your responsibility: check its contrast.

## 5. Light and dark theme

The light theme is the default. The dark theme is enabled by the **`dark` class** on an ancestor, usually `<html>`. `data-theme="dark"` is an equivalent alias:

```html
<html class="dark">            <!-- dark theme -->
<html data-theme="dark">       <!-- same effect -->
<html data-theme="auto">       <!-- follows the operating system (prefers-color-scheme), pure CSS -->
```

The token file also sets `color-scheme: light` / `dark`, so scrollbars and native controls follow the theme.

Toggle it from JavaScript with the helper exported by the core entry (it sets both the `dark` class and `data-theme`; pass an element as second argument to theme a subtree):

```js
import { setTheme, getResolvedTheme } from '@fabrizio.manna/prismui/core';

setTheme('auto');           // follow the operating system until the user picks a theme
setTheme('dark');           // or 'light'
getResolvedTheme();         // 'light' | 'dark', resolving 'auto'
```

Because the theme is just token values, you can theme a **subtree**, for example a dark sidebar in a light app:

```html
<aside class="dark">
  <prism-sidebar>…</prism-sidebar>
</aside>
```

The opposite works too: `data-theme="light"` forces the light theme in a subtree of a dark page.

Components never use Tailwind `dark:` classes: you do not need Tailwind in your app.

## 6. Controlled components: state lives outside

All prismUI components are **controlled and stateless**: they show the state you give them through properties and **never change that state by themselves**. When the user interacts, the component emits a **request event** with the proposed new state. Your code (app, framework, store) decides and writes the property back. If you ignore the event, nothing changes on screen.

```text
user interaction ──> request event (detail = proposed state, reason)
                      │  then, same tick: native input / change (form controls)
                      │  the component does NOT change its property
your code ─────────> element.checked = event.detail.checked   (or ignore it)
                      │
component ─────────> re-renders, updates the form value, moves focus
                      └─> notifications: prism-open / prism-close
```

What counts as state (always a property you own): `value`, `checked`, `indeterminate`, `pressed`, `selected`, `open`, `expanded`, `collapsed`, the active tab (`value` of `prism-tabs`), the datatable `rows` (already sorted, filtered and paginated), `page`, `sort`, `filters`, the list of visible toasts, and so on. Only ephemeral UI state stays inside: focus, hover, keyboard-active item, text being typed and not yet committed, a drag in progress.

Consequences:

- Overlays (modal, menu, dropdown, select popup…) open and close **only** through the `open` property. There are no `show()`/`hide()`/`toggle()` methods. The one deliberate exception is `prism-tooltip`: its visibility follows hover and focus, so it applies its own requests unless you call `preventDefault()` on them; `open` can still force it visible.
- The datatable does not sort, filter or paginate on its own; the select does not filter its options on its own.
- A text field that receives no update restores `value` on commit; a slider thumb snaps back to `value` on release.

### Event families

All events bubble and are composed (they cross shadow DOM boundaries). They are emitted only for user interaction, never when you set a property from code.

| Kind | Events | Meaning |
|---|---|---|
| Value request | `prism-change` | the user proposes a new value; `detail` carries it (for example `{ value, previousValue }` or `{ checked }`) |
| Draft | `prism-input` | value while typing or dragging, not yet committed |
| Open/close request | `prism-open-request`, `prism-close-request` | the user asks to open or close; `detail.reason` says why (`'escape'`, `'backdrop'`, `'close-button'`…) |
| Notification | `prism-open`, `prism-close` | `open` really changed and the transition and focus move are done |
| Native (form controls) | `input`, `change` | emitted by the host right after the `prism-*` event, for framework form bindings (no `detail`; during dispatch `event.target.value` / `checked` / `files` return the proposed value) |
| Property request | `prism-page-change`, `prism-page-size-change`, `prism-sort-change`, `prism-filter-change`, `prism-selection-change`, `prism-expanded-change`, `prism-collapsed-change`… | same as `prism-change`, for a specific property |
| Action | native `click`, `prism-action`, `prism-retry` | a command with no state to change (menu item, toast action, datatable row) |
| Other | `prism-navigate`, `prism-remove`, `prism-toast-dismiss`, `prism-search`, `prism-invalid`… | see each component's documentation |

To reject a change, simply **don't update the property**.

**Only open/close requests and `prism-navigate` are cancelable.** `prism-open-request` and `prism-close-request` can be refused with `preventDefault()`: the component does not change anything either way, but the call is a signal to whoever owns `open`, who must **not** apply a request whose `event.defaultPrevented` is `true`. This lets a guard, for example "unsaved changes" on a modal, block a close without knowing who owns the state:

```js
modal.addEventListener('prism-close-request', (event) => {
  if (hasUnsavedChanges() && !confirm('Discard changes?')) event.preventDefault();
}, { capture: true }); // runs before the owner's listener on an ancestor
```

The exception is `prism-close-request` with `detail.forced: true`: the browser has already closed the dialog, the event is not cancelable and you must set `open = false`. `prism-navigate` is cancelable so that an SPA router can intercept the link. `prism-tooltip` is the only overlay that applies its own requests, so there `preventDefault()` has a direct effect. Everything else (`prism-change`, `prism-*-change`, drafts, notifications, actions) is **not** cancelable: to refuse a value, just don't update the property.

**Event order.** Everything in one interaction is **synchronous**: `prism-input` → native `input` for drafts; `prism-change` → `input` → `change` for discrete controls (checkbox, switch, radio, select, slider steps); `prism-change` → `change` for the commit of a text field (blur or Enter; `input` already fired on each keystroke). The native event always comes **after** the matching `prism-*` event. Native events never fire for property changes from code, nor for form reset and restore. Notifications (`prism-open`, `prism-close`) fire later, when the transition has finished. Event `detail` types are exported as `Prism<Name>Detail`.

### Without a framework

Some code has to apply the requests. In a page without a framework you can write one small delegated listener for a form or a subtree that applies value requests:

```js
// Applies prism-change requests of form controls inside `root`
function applyChanges(root) {
  root.addEventListener('prism-change', (event) => {
    const el = event.target;
    const { detail } = event;
    if ('checked' in detail) el.checked = detail.checked;
    else if ('files' in detail) el.files = detail.files;
    else if ('value' in detail) el.value = detail.value;
  });
}
```

Components with other requests (open/close, tabs, accordion, pagination, datatable queries, toasts) still need their own handlers, as in the examples below.

## 7. Example: vanilla JavaScript

A settings panel with a switch, a text input and a confirmation modal. One `state` object owns everything; `render()` writes it into the components.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>prismUI – controlled example</title>
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <main>
      <prism-switch id="notifications" label="Email notifications"></prism-switch>

      <prism-input id="name" label="Display name" help-text="Shown to other users"></prism-input>

      <prism-button id="delete" variant="danger">Delete account</prism-button>

      <prism-modal id="confirm" heading="Delete account?">
        <p>This action cannot be undone.</p>
        <div slot="footer">
          <prism-button id="cancel">Cancel</prism-button>
          <prism-button id="confirm-delete" variant="danger">Delete</prism-button>
        </div>
      </prism-modal>
    </main>
  </body>
</html>
```

```js
// main.js
import '@fabrizio.manna/prismui/tokens.css';
import '@fabrizio.manna/prismui/switch';
import '@fabrizio.manna/prismui/input';
import '@fabrizio.manna/prismui/button';
import '@fabrizio.manna/prismui/modal';

// 1. State lives here, outside the components
const state = {
  notifications: false,
  name: '',
  confirmOpen: false,
};

const $ = (id) => document.getElementById(id);

// 2. One function writes state into the components (properties, not attributes)
function render() {
  $('notifications').checked = state.notifications;
  $('name').value = state.name;
  $('confirm').open = state.confirmOpen;
}

function setState(patch) {
  Object.assign(state, patch);
  render();
}

// 3. Components emit requests; we decide and update the state
$('notifications').addEventListener('prism-change', (event) => {
  setState({ notifications: event.detail.checked });
});

// Accept every keystroke so the field reflects what the user types
$('name').addEventListener('prism-input', (event) => {
  setState({ name: event.detail.value });
});

// Trim on commit (blur or Enter)
$('name').addEventListener('prism-change', (event) => {
  setState({ name: event.detail.value.trim() });
});

// Buttons are plain actions: listen to the native click
$('delete').addEventListener('click', () => setState({ confirmOpen: true }));
$('cancel').addEventListener('click', () => setState({ confirmOpen: false }));
$('confirm-delete').addEventListener('click', () => {
  // … call your API here …
  setState({ confirmOpen: false });
});

// Escape, backdrop click and the close button only *request* closing
$('confirm').addEventListener('prism-close-request', (event) => {
  console.log('close requested because of', event.detail.reason);
  setState({ confirmOpen: false });
});

// Notification: the modal is really closed and focus went back to the opener
$('confirm').addEventListener('prism-close', () => {
  console.log('modal closed');
});

render();
```

Notes:

- Set state through **properties** (`el.checked = …`, `el.open = …`). Boolean attributes are fine for the initial HTML, but properties are the source of truth.
- If you remove the `prism-change` listener on the switch, clicking it does nothing: that is the controlled contract, not a bug.
- `<prism-modal placement="end">` turns the same modal into a drawer, with the same events.
- The modal has no trigger of its own, so it never emits `prism-open-request`: your button opens it. For a "Cancel" button inside the modal you can also call `modal.requestClose('api')`, which only emits `prism-close-request`.
- The modal title is the `heading` attribute (no component uses `title`, which would also show a native tooltip); actions go in the `footer` slot.

## 8. Example: Angular

Angular renders custom elements once you allow unknown elements with `CUSTOM_ELEMENTS_SCHEMA`. Bind **properties** with `[prop]` and listen to **events** with `(event-name)`; hyphenated event names such as `(prism-change)` work as is.

Add the tokens once, in `angular.json` (or import them from your global `styles.css`):

```jsonc
// angular.json → projects.<app>.architect.build.options
"styles": [
  "node_modules/@fabrizio.manna/prismui/dist/tokens/prism-tokens.css",
  "src/styles.css"
]
```

Standalone component (Angular 17+ syntax):

```ts
// settings.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

// Register the custom elements (side-effect imports)
import '@fabrizio.manna/prismui/switch';
import '@fabrizio.manna/prismui/input';
import '@fabrizio.manna/prismui/button';
import '@fabrizio.manna/prismui/modal';

@Component({
  selector: 'app-settings',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <prism-switch
      label="Email notifications"
      [checked]="notifications()"
      (prism-change)="onNotificationsChange($event)">
    </prism-switch>

    <prism-input
      label="Display name"
      help-text="Shown to other users"
      [value]="name()"
      (prism-input)="onNameInput($event)"
      (prism-change)="onNameCommit($event)">
    </prism-input>

    <prism-button variant="danger" (click)="confirmOpen.set(true)">
      Delete account
    </prism-button>

    <prism-modal
      heading="Delete account?"
      [open]="confirmOpen()"
      (prism-close-request)="onCloseRequest($event)">
      <p>This action cannot be undone.</p>
      <div slot="footer">
        <prism-button (click)="confirmOpen.set(false)">Cancel</prism-button>
        <prism-button variant="danger" (click)="deleteAccount()">Delete</prism-button>
      </div>
    </prism-modal>
  `,
})
export class SettingsComponent {
  // State lives in the Angular component, not in the custom elements
  readonly notifications = signal(false);
  readonly name = signal('');
  readonly confirmOpen = signal(false);

  onNotificationsChange(event: Event): void {
    const { checked } = (event as CustomEvent<{ checked: boolean }>).detail;
    this.notifications.set(checked);
  }

  onNameInput(event: Event): void {
    const { value } = (event as CustomEvent<{ value: string }>).detail;
    this.name.set(value);
  }

  onNameCommit(event: Event): void {
    const { value } = (event as CustomEvent<{ value: string }>).detail;
    this.name.set(value.trim());
  }

  onCloseRequest(event: Event): void {
    const { reason } = (event as CustomEvent<{ reason: string }>).detail;
    console.log('close requested because of', reason);
    this.confirmOpen.set(false);
  }

  deleteAccount(): void {
    // … call your service here …
    this.confirmOpen.set(false);
  }
}
```

With an `NgModule` instead of standalone components, add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the module that declares the component.

Theme toggle in Angular is the same as in vanilla JS: call `setTheme()` from `@fabrizio.manna/prismui/core`, for example from a service.

### `ngModel` and Reactive Forms

The pattern shown above always works: bind the state property (`[value]`, `[checked]`, `[open]`) and listen to `(prism-change)` (or the specific request event). prismUI ships no Angular adapters. For `[(ngModel)]`, `[formControl]` or `formControlName` you need one of these, provided by your app:

- **`ngDefaultControl`** on value-based controls (`prism-input`, `prism-textarea`, `prism-select`, `prism-date-picker`, `prism-time-picker`). It works because, while the native `input` event is dispatched, `event.target.value` returns the proposed value:

  ```html
  <prism-input ngDefaultControl label="Display name" [(ngModel)]="name"></prism-input>
  ```

- **A `ControlValueAccessor` directive** of your own for controls that expose `checked` (`prism-checkbox`, `prism-switch`): it writes `checked` and listens to `prism-change`.

> **To verify:** neither option has been tested in an Angular app yet. The split (`ngDefaultControl` for value controls, a ~20-line `ControlValueAccessor` directive for checked controls, kept in the docs and not in the package) comes from `architecture.md` §5.7.

## 9. Forms

Form controls (`prism-button`, `prism-input`, `prism-textarea`, `prism-select`, `prism-checkbox`, `prism-checkbox-group`, `prism-radio-group`, `prism-switch`, `prism-slider`, `prism-date-picker`, `prism-time-picker`, `prism-file-upload`) are **form-associated custom elements**: give them a `name` and their value is submitted with a native `<form>`, including `required` validation, `reset` and `<fieldset disabled>`.

```html
<form id="profile">
  <prism-input name="email" type="email" label="Email" required></prism-input>
  <prism-switch name="newsletter" label="Newsletter"></prism-switch>
  <prism-button type="submit" variant="primary">Save</prism-button>
</form>
```

Validation messages appear only after the user has interacted with the field or tried to submit. To show a server-side error, set `invalid` and `error-text` on the control.

The controlled rule still applies to forms:

- Without a framework, nobody applies the requests, so the controls would not move. Connect the form once with a listener like `applyChanges()` (see [§6](#without-a-framework)) and it behaves like a native form.
- On `form.reset()` each control emits `prism-change` with `reason: 'reset'` and its default value (`default-value` / `default-checked`; `files: []` for file upload); your code applies it like any other request.
- Pressing Enter in a `prism-input`, or submitting the form, first commits any pending draft with a `prism-change`. In `prism-textarea`, Enter inserts a new line and never submits.

### File upload

`prism-file-upload` **uploads nothing**: it shows the files and upload states you give it and asks for additions and removals. The selected files are the `files` property (`File[]`), the per-file status is `fileStates` (`Map<File, { status: 'pending' | 'uploading' | 'done' | 'failed', progress?, message? }>`), both owned by your code:

```js
upload.addEventListener('prism-change', (event) => {
  const { files, added, rejected, reason } = event.detail; // reason: 'pick' | 'drop' | 'paste' | 'remove' | 'reset'
  upload.files = files;               // accept the proposed list
  added.forEach(startUpload);         // your upload code updates upload.fileStates
  rejected.forEach((r) => console.warn(r.file.name, r.reason)); // 'type' | 'size' | 'count'
});
```

Files rejected by `accept`, `max-size` or `max-files` are never in `files`. A remove button emits `prism-remove` (`{ file }`) followed by `prism-change` with `reason: 'remove'`. With a `name`, the files are submitted in the form's `FormData`.

### Alerts and stats

These are display components, but the same rules apply:

- `prism-alert` is shown while it is in the DOM; it has no `open` property. With `dismissible`, its close button (or Escape while focus is inside) emits `prism-close-request` (`{ reason: 'close-button' | 'escape' }`): remove the alert or set `hidden`, and move focus somewhere sensible if it was inside.
- `prism-stat` has no events: set `label`, `value`, `delta` and `trend` (`'up' | 'down' | 'flat'`, with `invert-trend` when down is good).

## 10. Customising

In order of preference:

1. **Redefine semantic tokens** at theme level (on `:root`, `.dark` or any subtree):

   ```css
   :root { --prism-color-primary: #7c3aed; --prism-color-primary-hover: #6d28d9; }
   ```

   Keep the contrast rules in [glassmorphism-guidelines.md](./glassmorphism-guidelines.md): white text on `--prism-color-primary` needs ≥ 4.5:1.

2. **Component custom properties**, named `--prism-<component>-<property>`:

   ```css
   prism-button { --prism-button-radius: 999px; }
   ```

3. **CSS parts** as a last resort: `prism-input::part(input) { … }`.

Component custom properties and part names are listed in each component's documentation (generated from the Custom Elements Manifest, `@fabrizio.manna/prismui/custom-elements.json`).

---

## Points to verify

| # | Point | Source missing or contradictory |
|---|---|---|
| 1 | Entries in `dist/` still growing | repo `src/components/` (only `icon` and `spinner` so far) |
| 2 | Git release tarball and tagged Git dependency | `architecture.md` §8.7 plans them; no release job or `v2.0.0` tag yet (the branch Git dependency works) |
| 3 | Entry names for component folders not created yet | `architecture.md` §2.1 |
| 4 | Angular `ngModel` / Reactive Forms via `ngDefaultControl` or an app-provided `ControlValueAccessor` | `architecture.md` §5.7; untested |
