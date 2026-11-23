# Contributing to PrismUI 2.0

The design specs live outside the repo, in `/workspace/shared/prismUI-design/` (`architecture.md`, `ux-spec.md`,
`visual-tokens.md`, `a11y-checklist.md`, `glassmorphism-guidelines-ux.md`). They are written in Italian. Everything
in the repo (code, comments, JSDoc, stories, docs) is in **English**.

## Folder layout

```text
src/
  index.ts                 all-in entry: re-exports core + every components/*/define.ts
  core/                    PrismElement, events, controlled-pattern helpers, mixins, controllers, theme
    prism-element.ts       base class: static tagName + idempotent define(), typed emit(), @property hoisting
    events.ts              prism-* event names and detail types (HTMLElementEventMap augmentation)
    controlled.ts          withProposedValue(), isSameValue(): helpers for controlled components
    mixins/                FormAssociatedMixin (ElementInternals, native input/change), FocusableMixin
    controllers/           OverlayStateController (open/close requests and notifications), …
    utils/                 DOM helpers
  styles/                  base.css (shared sheet), theme.css (Tailwind @theme -> tokens), utilities.css (@utility)
  tokens/                  prism-tokens.css (light DOM, published as tokens.css) + generated tokens.d.ts
  components/<name>/       prism-<name>.ts, prism-<name>.css, define.ts, *.stories.ts, *.test.ts
  stories/foundations/     stories for tokens and infrastructure
  docs/                    Storybook MDX pages (Content Writer)
test/
  setup.ts                 browser test setup (loads tokens)
  helpers/                 shared helpers: fixture(), settle(), recordEvents(), expectNoA11yViolations()
  fixtures/                test-only elements (prism-test-field, prism-test-overlay), not public components
  qa/                      QA Tester helpers (baseline suite, focus, viewport, form)
  a11y/                    cross-component accessibility suites
  integration/             cross-component and form integration suites
docs/                      Markdown guides (Content Writer)
scripts/                   lint-styles.mjs, generate-token-types.mjs
```

## Where to put tests (QA Tester)

| Kind                         | Path                                                     | Runs in                    |
| ---------------------------- | -------------------------------------------------------- | -------------------------- |
| Component test (browser)     | `src/components/<name>/prism-<name>.test.ts`             | `browser` project (Chromium; CI also Firefox and WebKit) |
| Pure logic (no DOM)          | `src/**/<file>.unit.test.ts`                             | `unit` project (Node)      |
| Cross-component / forms      | `test/integration/*.test.ts`                             | `browser` project          |
| Accessibility suites         | `test/a11y/*.test.ts`                                    | `browser` project          |
| Interaction tests in stories | `play()` in `*.stories.ts`                               | `storybook` project (+ axe via addon-a11y) |

- Name tests after UX acceptance criteria: `it('AC-BUTTON-01 …')`.
- Helpers: `import { fixture, settle, recordEvents, expectNoA11yViolations } from '<rel>/test/helpers/index.js'`.
- Browser interactions: `import { userEvent, page } from 'vitest/browser'`.
- Run a subset: `npx vitest run --project browser src/components/button`.
- Run other engines locally: `PRISM_TEST_BROWSERS=chromium,firefox,webkit npm test` (after `npx playwright install`).

## Where to put docs (Content Writer)

- Markdown guides: `docs/*.md` (getting started, theming, forms, framework integration, migration from 1.x).
- Storybook documentation pages: `src/docs/*.mdx` (picked up by `.storybook/main.ts`).
- Component API docs come from JSDoc in `src/components/<name>/prism-<name>.ts` (`@summary`, `@slot`, `@csspart`,
  `@cssprop`, `@fires`), which feeds the Custom Elements Manifest and Storybook autodocs.

Only the Frontend Developer commits. QA and docs files are included in the next commit once they pass the checks.

## Component rules

1. **Controlled.** Never assign state properties from inside the component. Emit a request and let the consumer
   update the property: `this.emitChange('value', proposed)` (form controls), `this.overlay.requestOpen('trigger')`
   (overlays), `this.emit('prism-page-change', …)` (others). Internal state is ephemeral only: focus, hover, active
   index, uncommitted text (see `test/fixtures/prism-test-field.ts` for the reference pattern).
2. **Events.** `prism-*`, `bubbles + composed`, not cancelable (except `prism-navigate`). No event for API changes.
3. **API naming.** Booleans default to `false` (use `no-*` names for default-on behaviour). Use `heading`, never
   `title`. Intent variants: `primary`, `neutral`, `info`, `success`, `warning`, `danger` (never `error`).
4. **Registration.** `static tagName = 'prism-x'` and `define.ts` calling `PrismX.define()`. No `@customElement`.
5. **Styles.** Copy `src/styles/component-template.css`. Only `var(--prism-*)`; no `dark:`, no arbitrary values, logical
   properties only. Text only on `--prism-glass-surface-solid-*` / `--prism-glass-slab`; control boundaries with
   `--prism-control-border*`; focus with the double ring (`focus-ring` utility or `[data-focus-target]`).
6. **Mobile first.** Base styles for touch / narrow screens; refine with `fine:` (pointer: fine) and `sm:`…`2xl:`.

## Before every commit

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

Conventional Commits in English (`feat:`, `fix:`, `chore:`, `test:`, `docs:`), imperative, lowercase, no final dot.
No push and no pull requests from agents.

## Toolchain notes

- TypeScript 7 (native) has no JavaScript API, while typescript-eslint and other tools still need one.
  `typescript` is therefore aliased to `@typescript/typescript6` (JS API only), and the `typecheck` / `build:types`
  scripts run the TS 7 compiler from the `typescript7` alias.
- Tailwind v4 `@property` rules do not work inside shadow roots (tailwindcss#15005). `PrismElement` hoists them
  into one document-level stylesheet at runtime. Prefer explicit CSS on tokens for glass, shadows, rings and transforms.
