<div align="center">
  <img src="./images/logo-bkg.png" alt="PrismUI logo" width="300" />
</div>

# 🧊 PrismUI

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="Version 2.0.0" />
  <img src="https://img.shields.io/badge/license-ISC-green" alt="License: ISC" />
</p>

**PrismUI** is an accessible, mobile-first glassmorphism web component library for admin panels and data-rich dashboards. It is built on standard **Web Components** with [Lit](https://lit.dev/), so it works with Angular, React, Vue, Svelte or plain JavaScript.

> **2.0 in progress.** This branch (`feat/glassmorphism-framework`) is a rewrite from scratch that ships as **2.0.0**, with breaking changes. **2.0.0 is not published to npm**: install it from this repository (see [Installation](#-installation)). The version on npm stays **1.1.0**, with the old API. Upgrading? See [MIGRATION.md](./MIGRATION.md). Items marked **To verify** are still open.

## ✨ Key features

- **🧊 Accessible glass.** Frosted surfaces that stay readable on any backdrop: text only sits on surfaces verified at WCAG 2.2 AA in the worst case, with a double focus ring that is visible on any background.
- **📱 Mobile first.** Base styles target phones and touch (44×44 px targets); larger layouts are added with `min-width` and container queries.
- **🎛️ Controlled components.** Components are stateless: your app owns the state and the components emit request events. Works naturally with signals, stores and framework bindings.
- **🌓 Light and dark theme.** Add the `dark` class (or `data-theme="dark"`) to any ancestor; `data-theme="light"` forces light in a subtree and `data-theme="auto"` follows `prefers-color-scheme`. Themes are pure design tokens (`--prism-*`), so they cross the shadow DOM and can apply to a subtree.
- **♿ Respects user preferences.** `prefers-reduced-transparency`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, plus an opaque fallback when `backdrop-filter` is not available.
- **📝 Native forms.** Form controls are form-associated custom elements: they submit, validate and reset with a plain `<form>`.
- **🌳 Tree-shakable.** ESM only, one entry point per component, Lit as a peer dependency.
- **🧩 Framework agnostic.** Standard properties, attributes, slots, CSS parts and `prism-*` events that bubble across shadow roots.

## 📦 Installation

`package.json` is `"private": true`: 2.0.0 is distributed from Git, not from npm (`npm install @fabrizio.manna/prismui` would install 1.1.0). The simplest way is a Git dependency (a `prepare` script builds `dist/` on install):

```bash
npm install github:FabrizioManna/prismUI#feat/glassmorphism-framework lit
```

Or build the package and install the tarball (Node.js ≥ 24):

```bash
git clone https://github.com/FabrizioManna/prismUI.git
cd prismUI
git checkout feat/glassmorphism-framework
npm install
npm run build        # dist/: library, type declarations, Custom Elements Manifest
npm pack             # fabrizio.manna-prismui-2.0.0.tgz
```

Then, in your app:

```bash
npm install /path/to/prismUI/fabrizio.manna-prismui-2.0.0.tgz lit
```

`lit` is a peer dependency. You can also install the built folder directly (`npm install /path/to/prismUI lit`). Imports are the same either way: `@fabrizio.manna/prismui/…`. Details in [Getting started](./docs/getting-started.md#1-install).


## 🚀 Quick start

```js
// 1. Design tokens (once, globally)
import '@fabrizio.manna/prismui/tokens.css';

// 2. Register only the components you use
import '@fabrizio.manna/prismui/switch';
```

```html
<html class="dark"> <!-- optional: dark theme -->
  <body>
    <prism-switch id="wifi" label="Wi-Fi"></prism-switch>

    <script type="module">
      const wifi = document.getElementById('wifi');
      let enabled = false;

      // The component asks; your code decides
      wifi.addEventListener('prism-change', (event) => {
        enabled = event.detail.checked;
        wifi.checked = enabled;
      });
    </script>
  </body>
</html>
```

Full guide, with a vanilla JS and an Angular example: **[docs/getting-started.md](./docs/getting-started.md)**.

## 📚 Documentation

| Document | Content |
|---|---|
| [Getting started](./docs/getting-started.md) | install, tokens, theming, controlled components, vanilla JS and Angular examples, forms |
| [Glassmorphism guidelines](./docs/glassmorphism-guidelines.md) | tokens, contrast and WCAG 2.2 AA rules, fallbacks, user preferences, mobile first, do and don't |
| [Migration 1.x → 2.0](./MIGRATION.md) | breaking changes and how to upgrade |
| Storybook | live examples and API tables generated from the Custom Elements Manifest (published on GitHub Pages) |

## 🧱 Component catalog (2.0 target)

Planned API from the architecture draft. Components land in phases; check Storybook for what is available.

### Form
- `prism-button`: variants, sizes, loading, icon-only, toggle (`pressed`), link mode, submit/reset.
- `prism-input`: text, email, password, number, search…; clearable, password toggle, counter.
- `prism-textarea`: multi-line text, auto-resize up to `max-rows`, counter.
- `prism-select` + `prism-option` + `prism-option-group`: single or multiple, searchable.
- `prism-checkbox` (+ `prism-checkbox-group`): indeterminate state, "select all".
- `prism-radio-group` + `prism-radio`: default, card and button appearances.
- `prism-switch`: on/off switch (replaces `prism-toggle`).
- `prism-slider`: single value or range, marks.
- `prism-date-picker`, `prism-time-picker`: native picker on touch devices, custom calendar or list otherwise.
- `prism-file-upload`: file picker with drop zone, file list and per-file upload state; it uploads nothing itself (your app does).

### Data
- `prism-datatable`: controlled sorting, filtering, pagination and row selection; scroll, cards or priority columns on mobile (replaces `prism-table`).

### Overlays and feedback
- `prism-modal`: native `<dialog>` in the top layer; with `placement` it becomes a drawer (replaces `prism-drawer`); bottom sheet on mobile.
- `prism-tooltip`: hover/focus tooltip and touch-friendly toggletip.
- `prism-toast` + `prism-toast-region`: notifications with user-adjustable timing.
- `prism-dropdown`: generic non-modal popover.
- `prism-alert`: persistent in-page message (info, success, warning, danger), optionally dismissible.
- `prism-spinner`, `prism-progress`.

### Navigation
- `prism-tabs` + `prism-tab` + `prism-tab-panel`
- `prism-accordion` + `prism-accordion-item`
- `prism-navbar` + `prism-nav-item` + `prism-nav-group`: drawer or dropdown on mobile.
- `prism-sidebar` + `prism-sidebar-item` + `prism-sidebar-group`: collapsible, off-canvas on mobile.
- `prism-breadcrumb` + `prism-breadcrumb-item`
- `prism-pagination`
- `prism-menu` + `prism-menu-item` (+ group, separator)

### Display
- `prism-card`, `prism-badge`, `prism-avatar` (+ `prism-avatar-group`), `prism-icon` ([Lucide](https://lucide.dev/) icons), `prism-divider`, `prism-visually-hidden`.
- `prism-stat`: a metric with value, delta and trend (up, down, flat), never shown by colour alone.

## 🎨 Theming in one minute

```css
/* Light is the default; dark is a class (or data-theme="dark") on any ancestor */
:root { --prism-color-primary: #7c3aed; }             /* redefine a semantic token */
prism-button { --prism-button-radius: 999px; }        /* component-level custom property */
prism-input::part(input) { letter-spacing: 0.01em; }  /* CSS part, last resort */
```

All tokens and the rules they must respect are in the [glassmorphism guidelines](./docs/glassmorphism-guidelines.md).

## ♿ Accessibility

PrismUI targets **WCAG 2.2 AA** and follows the WAI-ARIA Authoring Practices for every interactive pattern:

- text contrast checked on the worst-case backdrop, not just the demo background;
- double opaque focus ring (`outline` + inner ring), kept in Windows high-contrast mode;
- 44×44 px touch targets, 24×24 px minimum with a fine pointer;
- full keyboard support, RTL, localisable strings (English by default, Italian included);
- one shared live region for screen reader announcements.

## 🌐 Browser support

Proposed baseline: the last 2 versions of Chrome/Edge, Firefox and Safari (desktop and iOS). Required platform features include custom elements, shadow DOM, `ElementInternals` (Safari ≥ 16.4), the Popover API (Safari ≥ 17) and `<dialog>`. Glass effects, anchor positioning and `prefers-reduced-transparency` are progressive enhancements.

> **To verify:** the baseline is a proposal in `architecture.md` §1, not yet confirmed.

## 🛠️ Tech stack

- **Core:** Lit 3 and standard Web Components, `@lit/context`, `@floating-ui/dom` (positioning fallback), `lucide-static` (icons)
- **Styling:** design tokens (`--prism-*`) + Tailwind CSS 4, compiled per component inside the shadow DOM (no Tailwind needed in your app)
- **Tooling:** Vite 8, TypeScript 7, Custom Elements Manifest analyzer, ESLint 10 (+ `eslint-plugin-lit`, `lit-a11y`, `wc`), Prettier
- **Docs and tests:** Storybook 10, Vitest 5 browser mode with Playwright, axe-core
- **CI/CD:** GitHub Actions and GitHub Pages (Storybook)

## 🧑‍💻 Development

Requires Node.js **≥ 24** (`engines` in `package.json`).

```bash
npm install
npm run storybook      # Storybook on http://localhost:6006
npm run build          # library build + type declarations + Custom Elements Manifest
npm run test           # Vitest
npm run lint           # ESLint, style rules, Prettier
npm run check          # lint + typecheck + tokens:contrast + build + test
```

| Script | What it does |
|---|---|
| `npm run lint` | ESLint (TypeScript, Lit, WC, lit-a11y), CSS token guard, Prettier check |
| `npm run typecheck` | TypeScript 7 (`tsc`) type check of sources, tests and configs |
| `npm run tokens:sync` | regenerates `src/tokens/prism-tokens.css` from the Graphic Designer's block (`-- --from <visual-tokens.md>` to refresh it) |
| `npm run tokens:contrast` | WCAG 2.2 worst-case contrast audit of the shipped tokens (`scripts/contrast.py`, Python 3) |
| `npm run build` | Vite library build (ESM, one entry per component), `.d.ts`, Custom Elements Manifest |
| `npm test` | Vitest: `unit` (Node), `browser` (Playwright Chromium), `storybook` (stories + axe) |
| `npm run build-storybook` | static Storybook in `storybook-static/` |

Browser tests need `npx playwright install chromium`. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the folder layout, where tests and docs go, and the commit rules; contributions also follow `.antygravity/rules/` (English-only code and docs, conventional commits, accessibility and glass rules).

## ⚠️ Known limitations

- Components land in phases: today `prism-icon` and `prism-spinner` are implemented; the rest of the catalog below is the 2.0 target.
- The manual switches `data-prism-transparency` / `data-prism-effects` apply opaque surfaces on the element that carries them; a `.dark` subtree inside it keeps its own (non-reduced) values.
- 2px solid glass borders for `prefers-contrast: more` are not in the token block yet.

## 📄 License

ISC © Fabrizio Manna
