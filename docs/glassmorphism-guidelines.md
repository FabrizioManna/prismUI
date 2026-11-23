# prismUI glassmorphism guidelines

> **Status:** draft for prismUI **2.0.0** (rewrite on branch `feat/glassmorphism-framework`).
> **Sources of truth:** `visual-tokens.md` for token names and values (as shipped in `src/tokens/prism-tokens.css`); `a11y-checklist.md` v0.2.1 for accessibility (rules G-1…G-6, F-1…F-5, §3.5–3.8); `architecture.md` v0.3 for component API names and events. Also used: `glassmorphism-guidelines-ux.md` v0.3 and `ux-spec.md` v0.3 for UX constraints. The design documents are in Italian and live outside the repo; this file is the official English version.
> **Standard:** WCAG 2.2 level AA. AAA practices adopted by prismUI are labelled as such.
> Points still open are marked inline with **To verify** and collected in [Open points](#open-points).

## Contents

1. [Core principle](#1-core-principle)
2. [Tokens](#2-tokens)
3. [Surfaces: text-bearing, decorative, opaque](#3-surfaces-text-bearing-decorative-opaque)
4. [Contrast (WCAG 2.2 AA)](#4-contrast-wcag-22-aa)
5. [Focus visibility](#5-focus-visibility)
6. [Fallback without `backdrop-filter`](#6-fallback-without-backdrop-filter)
7. [User preferences](#7-user-preferences)
8. [Mobile first](#8-mobile-first)
9. [Performance](#9-performance)
10. [Do and don't](#10-do-and-dont)
11. [QA checklist](#11-qa-checklist)
12. [Open points](#open-points)

---

## 1. Core principle

Glass is **decoration**, never a readability requirement. A glass surface must stay readable and usable **whatever is behind it**: photos, gradients, scrolling content, light or dark theme, and also when the effect is unavailable or the user turns it off.

Every rule below follows from this: design for the **worst-case backdrop**, not for the demo background.

Two architectural rules make this work inside the shadow DOM:

- Components consume **only** `var(--prism-*)` tokens. No loose hex values, no utility colour classes such as `bg-slate-900`, no Tailwind `dark:` variants.
- Tokens live in the light DOM (`:root`, `.dark`, `[data-theme="dark"]`) and reach every shadow root through **custom property inheritance**. The theme and the user-preference overrides change token values, not component classes.

## 2. Tokens

All names follow the pattern `--prism-<family>-<role>[-<variant>]`. The full list, with light and dark values, is in the token file shipped as `@fabrizio.manna/prismui/tokens.css`.

The source file is `src/tokens/prism-tokens.css`; `package.json` exports it as `./tokens.css` (built to `dist/tokens/prism-tokens.css`).

### 2.1 Blur and saturation

| Token | Value | Typical use |
|---|---|---|
| `--prism-glass-blur-sm` | `8px` | light frost (small controls) |
| `--prism-glass-blur-md` | `12px` | default glass surface |
| `--prism-glass-blur-lg` | `16px` | large panels |
| `--prism-glass-blur-xl` | `24px` | highly elevated overlays (modal panel) |
| `--prism-glass-saturate` | `160%` | used as `saturate(var(--prism-glass-saturate))` |

All blur tokens drop to `0px` when `backdrop-filter` is not supported and with `prefers-reduced-transparency: reduce`.

Blur is never a contrast guarantee. For surfaces that carry text use at least `--prism-glass-blur-md` (12px): lower blur leaves shapes and text behind the surface legible, which hurts readability even when the computed contrast passes.

### 2.2 Transparency (surfaces)

Tint: white in light theme, slate-900 (`#0f172a`) in dark theme. Resolved values are `rgba(255, 255, 255, α)` and `rgba(15, 23, 42, α)`. Each surface also exposes an `-alpha` token (for example `--prism-glass-surface-solid-2-alpha`), and `--prism-glass-tint` holds the raw RGB triplet.

**Text-bearing surfaces** (may contain text and labelled controls):

| Level | Typical use | Light α | Dark α | Token |
|---|---|---|---|---|
| 0 | chip, input, bar | 0.85 | 0.90 | `--prism-glass-surface-solid-0` |
| 1 | low card | 0.88 | 0.92 | `--prism-glass-surface-solid-1` |
| 2 | default card / panel | 0.91 | 0.94 | `--prism-glass-surface-solid-2` |
| 3 | menu, popover, toast | 0.95 | 0.97 | `--prism-glass-surface-solid-3` |
| 4 | modal, drawer | 0.98 | 1.00 | `--prism-glass-surface-solid-4` |
| slab | text area inside a decorative frame | 0.85 | 0.90 | `--prism-glass-slab` |

**Decorative surfaces** (no text, ever):

| Level | Light α | Dark α | Token |
|---|---|---|---|
| 0 | 0.15 | 0.38 | `--prism-glass-surface-deco-0` |
| 1 | 0.28 | 0.50 | `--prism-glass-surface-deco-1` |
| 2 | 0.40 | 0.60 | `--prism-glass-surface-deco-2` |
| 3 | 0.55 | 0.72 | `--prism-glass-surface-deco-3` |
| 4 | 0.70 | 0.85 | `--prism-glass-surface-deco-4` |

**Opaque surfaces** (fallback and reduced transparency): `--prism-surface-opaque-0` … `--prism-surface-opaque-4`, all `#ffffff` in light and `#0f172a` in dark. Elevation is shown by shadows only.

### 2.3 Borders

| Token | Light | Dark | Use |
|---|---|---|---|
| `--prism-glass-border-width` | `1px` | `1px` | |
| `--prism-glass-border` | `rgba(255, 255, 255, 0.20)` | `rgba(255, 255, 255, 0.10)` | **decorative only** (light refraction) |
| `--prism-glass-border-luminous` | `rgba(255, 255, 255, 0.30)` | `rgba(255, 255, 255, 0.15)` | decorative top/left highlight |
| `--prism-glass-border-gradient` | gradient of the two above | same | decorative |
| `--prism-control-border` | `#64748b` (slate-500) | `#cbd5e1` (slate-300) | field, checkbox, radio, switch, slider boundary (≥ 3:1) |
| `--prism-control-border-hover` | `#475569` | `#e2e8f0` | |
| `--prism-control-border-focus` | `#0f172a` | `#ffffff` | reinforces the field border; the visible focus is still the double ring |
| `--prism-control-border-disabled` | `#94a3b8` | `#475569` | exempt from 1.4.11; needs a second cue |
| `--prism-control-border-width` | `1px` | `1px` | |

`--prism-glass-border` drops to about 1:1 in the worst case: it **never** counts as the boundary of a control (WCAG 1.4.11). Use `--prism-control-border*` for that.

### 2.4 Shadows and effects

| Token | Light | Dark |
|---|---|---|
| `--prism-shadow-0` | `none` | `none` |
| `--prism-shadow-1` | `0 4px 16px rgba(0, 0, 0, 0.06)` | `0 4px 16px rgba(0, 0, 0, 0.28)` |
| `--prism-shadow-2` | `0 8px 32px 0 rgba(0, 0, 0, 0.10)` | `0 8px 32px 0 rgba(0, 0, 0, 0.30)` |
| `--prism-shadow-2-hover` | `0 8px 32px rgba(0, 0, 0, 0.08)` | `0 8px 32px rgba(0, 0, 0, 0.24)` |
| `--prism-shadow-3` | `0 12px 40px rgba(0, 0, 0, 0.10)` | `0 12px 40px rgba(0, 0, 0, 0.36)` |
| `--prism-shadow-4` | `0 24px 64px rgba(0, 0, 0, 0.16)` | `0 24px 64px rgba(0, 0, 0, 0.48)` |
| `--prism-shadow-glow-{primary,success,warning,danger,info}` | coloured glow | same |
| `--prism-effect-highlight` | `inset 0 1px 0 var(--prism-glass-border-luminous)` | same (redefined under `.dark`) |
| `--prism-effect-noise` / `--prism-effect-noise-opacity` | SVG grain / `0.05` | SVG grain / `0.07` |

Outer shadows and glows **do not** count as a control boundary and must not reduce text contrast. Grain is never applied under text.

### 2.5 Focus

| Token | Value |
|---|---|
| `--prism-focus-ring-inner` | `#ffffff` |
| `--prism-focus-ring-outer` | `#000000` |
| `--prism-focus-ring-width` | `2px` (`3px` with `prefers-contrast: more`) |
| `--prism-focus-ring-offset` | `2px` |

Same colours in light and dark theme. See [§5](#5-focus-visibility).

### 2.6 States, radii, motion, sizes

- States: `--prism-state-hover-alpha-delta` (`0.10`, only on surfaces that are already text-bearing), `--prism-state-active-alpha-delta` (`0.14`), `--prism-state-active-scale` (`0.98`, `1` with reduced motion), `--prism-state-disabled-opacity` (`0.50`).
- Radii: `--prism-radius-none|sm|md|lg|xl|2xl|full` (`0`, `4px`, `6px`, `8px`, `12px`, `16px`, `9999px`).
- Motion: `--prism-duration-fast|normal|slow` (`120ms`, `200ms`, `320ms`), `--prism-ease-standard`, `--prism-ease-emphasized`.
- Targets and control heights: see [§8](#8-mobile-first).
- Page background: `--prism-color-bg-start`, `--prism-color-bg-end`, `--prism-bg-gradient`. This is the *recommended* backdrop; it does not replace the worst-case check.

### 2.7 Recommended glass recipe

This is the pattern components use (from `architecture.md` §7.5, with the token names of `visual-tokens.md`). It is a reference for contributors, not a public class.

```css
/* Inside a component's shadow root */
.glass {
  background: var(--prism-glass-surface-solid-2);
  -webkit-backdrop-filter: blur(var(--prism-glass-blur-md)) saturate(var(--prism-glass-saturate));
  backdrop-filter: blur(var(--prism-glass-blur-md)) saturate(var(--prism-glass-saturate));
  /* Always a real border, even if transparent: it becomes visible in forced-colors mode */
  border: var(--prism-glass-border-width) solid var(--prism-glass-border);
  border-radius: var(--prism-radius-xl);
  box-shadow: var(--prism-effect-highlight), var(--prism-shadow-2);
}
```


---

## 3. Surfaces: text-bearing, decorative, opaque

| Family | Tokens | Alpha | What may go on it |
|---|---|---|---|
| **Text-bearing** | `--prism-glass-surface-solid-0…4`, `--prism-glass-slab` | light ≥ 0.85, dark ≥ 0.90 | text, labels, values, links, controls with text |
| **Decorative** | `--prism-glass-surface-deco-0…4` | low ("open" glass) | chrome, blobs, empty panels, decoration only |
| **Opaque (fallback)** | `--prism-surface-opaque-0…4` | 1.0 | same use as solid, when glass is off |

Rules:

1. Text and controls with a label or value go **only** on a text-bearing surface, or on a `--prism-glass-slab` placed *under* the text when the frame around it is decorative.
2. Decorative surfaces are **not** evaluated for text contrast and must not contain text.
3. Controls sit on a solid/slab surface or on the documented page background. If a control has to sit on a decorative surface or an unknown backdrop, wrap it in a solid/slab surface or give it a double (light + dark) outline, as for focus.
4. Text with no surface of its own (ghost button, help text, inactive tabs, breadcrumb) depends entirely on the page background: the library documents the colours, the consumer checks the contrast (rule G-4).

---

## 4. Contrast (WCAG 2.2 AA)

### 4.1 Thresholds

| Element | Minimum ratio | Criterion |
|---|---|---|
| Normal text (< 24px regular, < 18.66px bold) | **4.5:1** | 1.4.3 |
| Large text (≥ 24px regular or ≥ 18.66px bold) | **3:1** | 1.4.3 |
| UI components: field borders, checkbox, switch, slider track and thumb, informative icons, state indicators | **3:1** against adjacent colours | 1.4.11 |
| Focus indicator | **3:1** against adjacent colours | 1.4.11 (2.4.13 AAA adopted as good practice) |
| Placeholder | 4.5:1 if it conveys information (it never replaces the label) | 1.4.3 |
| Disabled text, logos, pure decoration | exempt, but disabled must stay **recognisable** | 1.4.3 exception |

Good practice (AAA, 1.4.6): aim for **7:1** for text in data tables and dense content.

Ratios are never rounded up: 2.999:1 is not 3:1.

### 4.2 How to measure on a translucent surface

A colour with alpha has no contrast of its own. The perceived colour is `surface × α + backdrop × (1 − α)`, layer by layer (for example modal backdrop + glass + button fill).

1. Take the **worst-case backdrop**, not the demo background. The reference method (`contrast.py`, `a11y-checklist.md` §3.1) composites on `#ffffff`, `#000000`, the page-gradient stops and the full grey ramp 0–255, plus an RGB cube for rings and borders.
2. Ignore blur: on a uniform area it changes nothing, so it cannot improve the worst case. Include `saturate()`, which can reduce contrast.
3. Measure the text against **every** composited colour; the **minimum** counts.
4. Repeat for light and dark theme and for hover/selected states.

Watch out for **mid-grey backdrops**: for mid-luminance colours (secondary text, links, icons, borders) the worst case is a grey of similar luminance, not black or white. Testing only black and white gives false positives.

### 4.3 Results for the shipped tokens

From `npm run tokens:contrast` (`scripts/contrast.py`, the Graphic Designer's script reading `src/tokens/prism-tokens.css`; 95 pairs, 0 failures):

- Text on solid 0–4, slab, opaque surfaces and semantic fills: minimum **4.74:1** (`--prism-color-link` light on `--prism-glass-surface-solid-0`, worst case on black).
- Control borders (default/hover/focus, both themes): minimum **3.36:1** (`--prism-control-border` light against `solid-0` composited on black).
- Focus ring (white inner `#ffffff` + black outer `#000000`): at least **4.58:1** on any backdrop (√21 ≈ 4.5826, worst backdrop `#e12d0f`); **21:1** between the two rings.
- White on solid semantic fills (primary / success / warning / danger / info): 5.17 / 5.02 / 5.02 / 6.47 / 5.93:1.

### 4.4 Techniques

1. **Minimum surface opacity** chosen on the weakest text used on the surface (muted, link, placeholder): light α ≥ 0.85, dark α ≥ 0.90 (rule G-1). That is why text goes on `solid` or `slab` tokens.
2. **Coloured fills with white text are solid**, never "600 at 50% + white text" (rule G-3). For a tinted glass look use the `--prism-color-*-subtle` + `--prism-color-*-on-subtle` pair.
3. **Scrim** between a busy backdrop (photo, video) and the glass.
4. **Opaque "island"** (slab) for small or critical text: errors, status labels, table values.
5. `text-shadow`, glow and blur are never enough on their own.
6. **Control boundaries** use `--prism-control-border*` on a text-bearing surface, or a double light + dark outline (rule G-5).
7. Grain and glow must not reduce text contrast (rule G-6).

### 4.5 Testing

- Storybook: test backdrops for every component (light, dark, saturated brand gradient, high-contrast photo, striped text behind the surface for sticky headers, plus solid black, white and worst-case grey).
- Automated: axe-core with the `wcag22aa` tags. axe cannot compute contrast on translucent surfaces or `backdrop-filter` (it reports "needs review"), so the contrast script on composited token colours runs in CI and fails the build under threshold.
- Manual: eyedropper on the real rendering at the worst spots, in both themes.

`npm run tokens:contrast` runs in `npm run check` and in CI, and fails the build if a required pair falls under its threshold.

---

## 5. Focus visibility

Criteria: 2.4.7 Focus Visible (AA), 2.4.11 Focus Not Obscured (Minimum) (AA, new in 2.2), 1.4.11 (3:1), 2.4.13 Focus Appearance (AAA, adopted as good practice).

A single-colour ring, even opaque, has **1.00:1** in the worst case (a backdrop of the same colour always exists). prismUI uses **two opaque concentric rings**, white inside and pure black outside, identical in both themes:

```css
.prism-focusable:focus-visible {
  outline: var(--prism-focus-ring-width) solid var(--prism-focus-ring-outer);   /* outer ring, survives forced colors */
  outline-offset: var(--prism-focus-ring-offset);
  box-shadow: 0 0 0 var(--prism-focus-ring-width) var(--prism-focus-ring-inner); /* inner white ring in the offset gap */
}
.prism-focusable:focus:not(:focus-visible) { outline: none; }

@media (forced-colors: active) {
  .prism-focusable:focus-visible {
    outline: 3px solid Highlight; /* alternative: CanvasText */
    outline-offset: var(--prism-focus-ring-offset);
    box-shadow: none;
  }
}
```

Rules:

- **F-1** Double opaque ring, inner `--prism-focus-ring-inner` (`#ffffff`) + outer `--prism-focus-ring-outer` (`#000000`), each ≥ 2px, same colours in both themes. At least one ring always reaches ≥ 4.58:1 against any backdrop. Rejected pairs: white + slate-900 (4.23:1), white + blue-700 (2.59:1), white + blue-800 (2.95:1), any single or translucent ring. `--prism-control-border-focus` may additionally reinforce a focused field's border, but never replaces the double ring.
- **F-2** The outer ring is always an `outline` (with `outline-offset`). In forced-colors mode `box-shadow` becomes `none`, while `outline` is forced to a system colour and stays visible. Do not use Tailwind `ring-*` utilities for focus (they are `box-shadow`).
- **F-3** Only `:focus-visible`; never `outline: none` without a replacement.
- **F-4** Focus is never hidden by sticky or fixed glass (see below).
- **F-5** No translucent rings (colours with alpha, `ring-*/50`).
- The ring must not be clipped by `overflow: hidden` on a glass container: leave inner padding, or use a negative `outline-offset` only where needed (table cells, list items), keeping both rings.
- Composite widgets put the ring on the element that really has focus (menu item, grid cell, tab), not only on the container.
- Focus is never shown only by a change of surface background.

**Not obscured (2.4.11):**

- Sticky/fixed glass header or footer: set `scroll-padding-top` / `scroll-padding-bottom` on the document or scroll container to the bar height plus a margin.
- Toasts and fixed banners do not cover controls at the bottom of the page and never stay over the focused field longer than needed.
- Popovers and dropdowns close when focus leaves them.
- A "see-through" glass header that lets you glimpse the focused control below it does **not** meet 2.4.11 in spirit: scroll the control into view.

Use the height tokens for the scroll padding:

| Token | Base | Refinement | Applies when |
|---|---|---|---|
| `--prism-navbar-height` | `56px` | `64px` | `@media (min-width: 768px)` (`md` and up) |
| `--prism-table-header-height` | `44px` (touch-safe) | `40px` | `@media (pointer: fine)`, same rule as the control heights |

```css
html { scroll-padding-top: calc(var(--prism-navbar-height) + var(--prism-space-2)); }
```

---

## 6. Fallback without `backdrop-filter`

`backdrop-filter` can be missing or disabled (older browsers, some WebViews, power-saving modes, enterprise policies). Without blur, a 40% surface becomes unreadable on a busy backdrop. Rule: **the starting look is opaque; glass is a progressive enhancement.**

**Token level (shipped).** The token file swaps every glass surface to the opaque family and sets blur to `0px` when neither the standard nor the prefixed property is supported. Components that read the tokens get the fallback for free:

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root {
    --prism-glass-surface-solid-0: var(--prism-surface-opaque-0);
    /* … solid-1…4, slab and deco-0…4 → --prism-surface-opaque-* … */
    --prism-glass-blur-sm: 0px;
    --prism-glass-blur-md: 0px;
    --prism-glass-blur-lg: 0px;
    --prism-glass-blur-xl: 0px;
  }
  .dark, [data-theme="dark"] {
    /* same overrides: composite properties must be redefined under the dark selector */
  }
}
```

**Component level.** When a component writes its own glass rule, prefer the positive form, so the default is safe even if the `@supports` rule itself is not understood:

```css
.glass {
  background: var(--prism-surface-opaque-2); /* safe default */
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .prism-glass, .prism-modal, .prism-popover, .prism-card /* … */ {
    background: var(--prism-glass-surface-solid-2);
    -webkit-backdrop-filter: blur(var(--prism-glass-blur-md)) saturate(var(--prism-glass-saturate));
    backdrop-filter: blur(var(--prism-glass-blur-md)) saturate(var(--prism-glass-saturate));
  }
}
```

Rules:

- Always write **both** `-webkit-backdrop-filter` and `backdrop-filter`, and test both in `@supports`.
- The opaque fallback colours are tokens with verified contrast, like any other background.
- Fallback, reduced transparency and `prefers-contrast: more` share **one** opaque state to design and test.
- Storybook offers a "Disable backdrop-filter" toggle that forces the fallback.

---

## 7. User preferences

Every glass component respects four system preferences. Rules are centralised in the token file and in shared styles, so components inherit them.

### 7.1 `prefers-reduced-transparency: reduce`

The surface becomes **opaque**, without blur; colours, borders and radii stay the same. The token file maps all `--prism-glass-surface-solid-*`, `--prism-glass-slab` and `--prism-glass-surface-deco-*` to `--prism-surface-opaque-*`, sets `--prism-glass-blur-*` to `0px` and `--prism-effect-noise-opacity` to `0`, under `:root` and again under `.dark, [data-theme="dark"]`.

The media query is not supported everywhere (Chromium and Firefox, not Safari, according to `architecture.md` §7.5). prismUI therefore has a manual switch with the same effect: `data-prism-transparency="reduced"` on the root element (or any subtree), which `setReducedTransparency(true)` from `@fabrizio.manna/prismui/core` sets for you. A "performance" mode, `data-prism-effects="reduced"`, applies the same opaque state on slow devices. Offer the switch in your app's settings.

> **To verify:** the two manual switches are in `src/tokens/source/extensions.css` as "prismUI extensions" waiting for the Graphic Designer's confirmation; they are not in `visual-tokens.md` yet. The modal backdrop is the Graphic Designer's `--prism-scrim`.

### 7.2 `prefers-reduced-motion: reduce`

- No scale, slide, parallax, glass rotation or background "shimmer".
- Transitions and animations are effectively instant: the token file sets `--prism-duration-fast|normal|slow` to `0ms` and `--prism-state-active-scale` to `1` (no press "scale 0.98"); component CSS reduces any remaining `animation-duration` / `transition-duration` to `0.01ms` and sets `scroll-behavior: auto` (`a11y-checklist.md` §3.8).
- Never animate `backdrop-filter`.
- No component communicates state through animation alone.
- Spinners stop rotating and use a slow opacity pulse (`prism-pulse`, 2s) so they still read as "in progress"; indeterminate progress likewise.

### 7.3 `prefers-contrast: more` and `less`

**`more`** (`a11y-checklist.md` §3.6):

- Opaque surfaces with no `backdrop-filter`, as in reduced transparency; no grain overlay.
- No muted text: `--prism-color-text-muted` → `--prism-color-text-primary` (done in the token file).
- Glass borders become solid (`currentColor`) and 2px wide.
- No glow, coloured shadows or gradients behind text; grain off (`--prism-effect-noise-opacity: 0`, done in the token file).
- Thicker focus ring: `--prism-focus-ring-width: 3px` (done in the token file).

**`less`:** shadows and glows may be removed or softened, but **AA thresholds stay mandatory** (4.5:1 / 3:1).

The token file maps every glass surface to its opaque fallback, removes blur and glows, and darkens control borders (`--prism-control-border` `#334155` light / `#e2e8f0` dark) and links. Components carry stable classes (`.prism-glass`, `.prism-modal`, `.prism-input`…) whose high-contrast and forced-colors rules are adopted by every shadow root.

> **To verify:** 2px solid glass borders (`a11y-checklist.md` §3.6) are not in the token block; components will apply them in their CSS.

### 7.4 `forced-colors: active` (Windows high contrast)

What the browser does by default: it forces colour properties to system colours but **keeps the alpha** of `background-color` (a translucent surface stays translucent), does not reliably remove `background-image`, does **not** remove `backdrop-filter`, and turns `box-shadow` / `text-shadow` into `none`. So prismUI does not rely on the automatic behaviour: the token file declares explicit rules on stable classes, and `src/styles/surfaces.css` (generated from the same block) adopts them in every shadow root. Components put these classes on the element that paints the surface or control:

```css
@media (forced-colors: active) {
  .prism-glass, .prism-modal, .prism-popover, .prism-card /* … */ {
    background: Canvas;              /* = background-color: Canvas; background-image: none */
    color: CanvasText;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
    border: 1px solid CanvasText;    /* replaces lost shadows and highlights */
  }
  .prism-glass::before, .prism-glass::after { display: none; } /* grain, scrim, highlights */

  .prism-button { background: ButtonFace; color: ButtonText; border: 1px solid ButtonBorder; }
  .prism-field, .prism-input, .prism-select { background: Field; color: FieldText; border: 1px solid FieldText; }

  .prism-control:focus-visible, .prism-focusable:focus-visible { outline: 3px solid Highlight; outline-offset: 2px; box-shadow: none; }

  [aria-selected="true"], [aria-current="page"], [aria-pressed="true"] {
    background: Highlight; color: HighlightText;
  }
  .prism-switch-track, .prism-checkbox-box, .prism-slider-track { border: 1px solid ButtonText; }
  .prism-switch-thumb, .prism-progress-fill, .prism-slider-range {
    background: Highlight;
    forced-color-adjust: none;       /* only on these small indicators, always with a system colour */
  }
  :disabled, [aria-disabled="true"] { color: GrayText; border-color: GrayText; }
  svg { fill: currentColor; stroke: currentColor; }
}
```

(Class names are illustrative; each component applies the rules to its own parts.)

- `forced-color-adjust: none` only where colour *is* the information (colour swatches) or on small indicators that still get system colours; never on whole surfaces or controls.
- No state loss: selected, checked, current, active use `Highlight`/`HighlightText` (or `SelectedItem`/`SelectedItemText`) or a thicker indicator; disabled uses `GrayText`.
- SVG icons use `currentColor`, never fixed fills such as `fill="#fff"`.
- Every surface and control has a real border (it can be `transparent` normally) so it shows up in forced-colors mode.


### 7.5 Temporary content on glass: toasts

Auto-dismiss is a time limit (WCAG 2.2.1, 2.2.2, 4.1.3):

- **Controlled model:** the app owns the list of visible toasts (the `toasts` property of `prism-toast-region`, one `PrismToastItem` per toast with its own `duration` in ms, `0` = persistent). When the timer expires or the user dismisses a toast (close button, Escape, swipe), the region emits `prism-toast-dismiss` (`{ id, reason: 'timeout' | 'close-button' | 'escape' | 'swipe' }`); the toast stays until the app removes it from the list. The timer is ephemeral state of the region.
- **The end user controls the timing:** the app **must** offer a visible, persisted setting with at least "Close notifications automatically: yes/no" and a way to lengthen durations up to 10×, and apply it to each item's `duration` (`0` when auto-close is off).
- The timer pauses on hover **and** while focus is inside the toast (and while the page is hidden); on touch, a long press or screen-reader focus also pauses it.
- `danger` toasts and any toast with an action never request closing by timeout.
- Toasts use `--prism-glass-surface-solid-3` and `--prism-z-toast`; enter/exit motion follows reduced motion; the stack does not cover the focused element.


---

## 8. Mobile first

Fabrizio's rule for the whole library: every component is designed **for the phone first**. Unqueried styles are for narrow, touch screens; larger layouts are added with ascending `min-width` queries.

### 8.1 Breakpoints

| Name | `min-width` | Token (documentation only) |
|---|---|---|
| base | 0–639px, no query | — |
| `sm` | 640px (40rem) | `--prism-bp-sm` |
| `md` | 768px (48rem) | `--prism-bp-md` |
| `lg` | 1024px (64rem) | `--prism-bp-lg` |
| `xl` | 1280px (80rem) | `--prism-bp-xl` |
| `2xl` | 1536px (96rem) | `--prism-bp-2xl` |

- Only `min-width`. `max-width` media/container queries are not allowed. Capability queries (`pointer`, `hover`, `prefers-*`) are fine.
- A custom property cannot be used inside `@media`: repeat the pixel values literally.
- Block components (datatable, navbar, tabs, pagination, card, toast region…) adapt with **container queries**, because a component in a 400px column is "mobile" even on a large monitor. Viewport media queries are only for viewport-relative things (top-layer overlays, app-level sidebar).


### 8.2 Touch targets and control heights

The default in `:root` (no query) is the touch size; the fine-pointer refinement comes after.

| Token | Default (touch) | `@media (pointer: fine)` |
|---|---|---|
| `--prism-target-min` | `44px` | `24px` |
| `--prism-target-min-touch` | `44px` | — |
| `--prism-target-min-fine` | `24px` | — |
| `--prism-control-height-sm` | `44px` | `32px` |
| `--prism-control-height-md` | `44px` | `40px` |
| `--prism-control-height-lg` | `48px` | `48px` |

- WCAG 2.5.8 (AA) asks for 24×24 CSS px; prismUI targets **44×44** on touch (2.5.5 AAA as a project goal).
- The visual design can be smaller than the target (for example a 20px checkbox): extend the hit area with padding or a pseudo-element, never with `box-shadow`. The glow is not part of the target.


### 8.3 Typography and spacing

- Body text `--prism-text-md` is **≥ 16px on mobile** (`clamp(1rem, …, 1.125rem)`). `--prism-text-xs`/`-sm` are for captions, labels and meta, not body text.
- Spacing steps `--prism-space-0…6` are fixed; `--prism-space-7…12` are fluid (`clamp()`), minimum on mobile.

### 8.4 Glass on small screens

- Full-width glass on mobile (navbar, bottom sheet, drawer) uses `--prism-radius-none` on the sides that touch the screen edge.
- Glass may extend under the notch or home bar; **text and controls may not** (add `env(safe-area-inset-*)` to the padding).
- Behind a bottom sheet or drawer there is often scrolling text: use high-opacity text-bearing surfaces (`--prism-glass-surface-solid-3` / `-4`) and a scrim under the overlay.
- Fewer blurred surfaces at once: on a phone, at most the navbar plus one overlay. No blur on scrims; fixed bars use `--prism-glass-blur-sm` or `-md`.
- Body text ≥ 16px (`--prism-text-md`), which also prevents iOS auto-zoom on form fields.

```css
/* Illustrative: a bottom sheet that becomes a centred dialog from 640px */
.sheet {
  background: var(--prism-glass-surface-solid-4);
  border-radius: var(--prism-radius-2xl) var(--prism-radius-2xl) 0 0;
  max-height: 85dvh;
  padding: var(--prism-space-4) var(--prism-space-4)
           calc(var(--prism-space-4) + env(safe-area-inset-bottom));
}
@media (min-width: 640px) { /* --prism-bp-sm */
  .sheet { border-radius: var(--prism-radius-2xl); max-height: 80dvh; }
}
```

### 8.5 Layout and interaction

- Reflow (1.4.10): everything works at 320 CSS px and 400% zoom without horizontal page scroll (data tables scroll inside their container).
- Orientation (1.3.4): no component locks portrait or landscape.
- Safe area: fixed bars and overlays add `env(safe-area-inset-*)` padding (the page needs `viewport-fit=cover`).
- Full-height overlays use `dvh`/`svh`, not `100vh`.
- Hover styles live inside `@media (hover: hover)`; nothing is available on hover only.
- Every path-based or multi-point gesture (swipe to dismiss) and every drag has a single-pointer alternative (2.5.1, 2.5.7); actions fire on pointer release (2.5.2).
- Browser zoom is never disabled.

---

## 9. Performance

Blur is expensive: the browser re-reads and blurs the pixels behind the surface every frame.

- **No nested blur:** a glass surface inside another blurred glass surface uses a semi-opaque background without `backdrop-filter`.
- **No blur on large areas:** avoid full-screen blur (modal backdrop, page background). For a modal backdrop use a semi-opaque scrim with low blur (≤ 4–8px) or none.
- **Count the surfaces:** about 5–8 visible elements with `backdrop-filter` per view at most. Cells, table rows, badges and list/menu items have no blur of their own.
- **Do not animate blur:** animate `transform`/`opacity` of the content, not `backdrop-filter`.
- Sticky glass headers recompute blur on every scroll frame: keep the radius moderate and measure.
- `will-change` only during transitions, never permanently.
- Budget: on a mid-range Android profile (4× CPU throttling), scrolling a page with sticky navbar + sidebar + datatable stays ≥ 50 fps; INP < 200 ms for overlay interactions.

For the modal backdrop use `--prism-scrim` (no blur, especially on mobile); the modal surface is `--prism-glass-surface-solid-4` with `--prism-modal-border`.

> **To verify:** `glassmorphism-guidelines-ux.md` §6 allows **one** active blur level per screen area; `architecture.md` §7.5 (risk table) allows "at most 2 overlapping glass levels". This document recommends one.

---

## 10. Do and don't

### Do

- Measure contrast on the **worst-case backdrop** (white, black, mid grey, saturated colour, photo, scrolling content), in both themes.
- Put text only on `--prism-glass-surface-solid-*` or `--prism-glass-slab`; keep `--prism-glass-surface-deco-*` text-free.
- Guarantee 4.5:1 for normal text and 3:1 for large text, control borders, informative icons and focus.
- Use `--prism-control-border*` for field, checkbox, radio, switch and slider boundaries.
- Use the double focus ring (`--prism-focus-ring-inner` + `--prism-focus-ring-outer` as `outline`).
- Set `scroll-padding` for sticky/fixed glass headers and footers.
- Start from an opaque surface and add glass with `@supports`, including the `-webkit-` prefix.
- Respect `prefers-reduced-transparency`, `prefers-reduced-motion`, `prefers-contrast` and `forced-colors`.
- Give every surface and control a real border (transparent is fine) for forced-colors mode.
- Communicate states (selected, error, current, disabled) with text, icon, shape or thickness as well as colour.
- Use scrims over photos and video, and opaque islands for small or critical text.
- Keep blur on one level per area and on surfaces of contained size.
- Let users control toast duration; pause on hover and focus.
- Write styles mobile first, with `min-width` queries and 44px touch targets.
- Test in Storybook with test backdrops, the fallback toggle and emulated media features.

### Don't

- Measure contrast only on the demo or mockup background.
- Put text on decorative surfaces, or light/"muted" text on light glass.
- Use white text on semi-transparent coloured fills (`bg-*-600/50 text-white`).
- Rely on `text-shadow`, glow or blur as the only readability guarantee.
- Use `outline: none` without a replacement, focus rings made only of `box-shadow`, or translucent rings.
- Let focus rings be clipped by `overflow: hidden` or covered by sticky glass.
- Use `--prism-glass-border` (10–20% white) as the **only** visible boundary of an input, checkbox or selectable card.
- Nest blurred glass, blur full-screen areas, or animate `backdrop-filter`.
- Use parallax, shimmer or moving backgrounds without honouring reduced motion.
- Apply `forced-color-adjust: none` to surfaces or whole controls, or expect the browser to make surfaces opaque in forced-colors mode.
- Use Tailwind `dark:` variants or hard-coded colours inside components.
- Auto-close toasts that have an action or are `danger`, or close them while hovered or focused.
- Use fixed SVG colours instead of `currentColor`.
- Signal "disabled" with opacity so low that the element becomes unrecognisable.
- Put essential information only in tooltips or hover-only elements.
- Write desktop-first styles with `max-width` queries.

---

## 11. QA checklist

- [ ] **GL-01** For every surface token, text reaches 4.5:1 (normal) / 3:1 (large) on white, black, worst-case grey, saturated brand and photo backdrops, in light and dark theme.
- [ ] **GL-02** Control borders, informative icons, filled part of slider/progress and state indicators reach ≥ 3:1 against adjacent colours on all test backdrops.
- [ ] **GL-03** Focus ring = `--prism-focus-ring-width` (2px) `outline` in `--prism-focus-ring-outer` (`#000000`) with `--prism-focus-ring-offset` (2px) + 2px inner ring in `--prism-focus-ring-inner` (`#ffffff`) (computed styles); the script confirms ≥ 4.58:1 worst case; the ring is not clipped.
- [ ] **GL-04** With sticky navbar and fixed toolbars, tabbing after scrolling never fully hides the focused element (2.4.11).
- [ ] **GL-05** With `prefers-reduced-transparency: reduce` emulated (or the manual switch), surfaces have `backdrop-filter: none` and an opaque background.
- [ ] **GL-06** With `prefers-reduced-motion: reduce` emulated, no animation exceeds the agreed limit except declared loading indicators.
- [ ] **GL-07** With `prefers-contrast: more` emulated: opaque surfaces, solid borders, text ≥ 7:1; with `less`, AA thresholds still pass.
- [ ] **GL-08** With `forced-colors: active` emulated: glass surfaces compute to opaque `Canvas`, `background-image: none`, `backdrop-filter: none`, `box-shadow: none`, 1px `CanvasText` border; focus is a 3px `Highlight` outline. On real Windows high contrast (light and dark), selected/current/checked/disabled states stay distinguishable and icons visible.
- [ ] **GL-09** With `backdrop-filter` disabled (Storybook toggle), surfaces use the opaque fallback and pass GL-01.
- [ ] **GL-10** No view has nested blurred surfaces; scrolling with 4× CPU throttling stays ≥ 50 fps on the admin demo page.
- [ ] **GL-11** Toasts: with auto-dismiss off nothing closes by itself; with a 10× scale the duration is 10× the default; toasts with an action or `danger` never auto-close; the timer pauses on hover and, separately, on focus.
- [ ] **GL-12** At 320px width and 400% zoom there is no horizontal page scroll; touch targets are ≥ 44×44 with a coarse pointer.

---

## Open points

1. **prismUI token extensions** (`data-prism-transparency` / `data-prism-effects` switches, `--prism-color-{success,warning,danger,info}-hover`): in `src/tokens/source/extensions.css`, pending the Graphic Designer's confirmation and missing from `visual-tokens.md`.
2. **`prefers-contrast: more`**: 2px solid glass borders required by `a11y-checklist.md` §3.6 are not in the token block (opaque surfaces and darker control borders are).
3. **Nested glass**: one blur level per area (`glassmorphism-guidelines-ux.md` §6) vs at most two overlapping levels (`architecture.md` §7.5).
