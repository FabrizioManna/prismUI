# Spec: PrismUI Component Catalog (Category 5: Overlays & Feedback)

- **Date**: 2026-08-28
- **Status**: Completed

## Goal
Implement crucial feedback and overlay mechanisms (Modals, Drawers, Toasts, Alerts, Spinners) managing `z-index`, backdrop blurs, and enter/leave animations. Concurrently, integrate `lucide-static` across all components for a premium open-source icon set.

## Scope
1. **Refactor `prism-icon`**: Enhance to render raw SVG strings easily via Lit's `unsafeSVG`.
2. **Global Icon Upgrade**: Replace hardcoded SVGs in `prism-input`, `prism-select`, `prism-checkbox`, `prism-file-upload`, `prism-table`, `prism-accordion`, `prism-stat`, `prism-breadcrumb`, and `prism-pagination` with `lucide-static` icons.
3. **`prism-modal`**: Centered dialog with backdrop blur.
4. **`prism-drawer`**: Slide-out off-canvas panel.
5. **`prism-toast`**: Floating notification system.
6. **`prism-alert`**: In-page static banner.
7. **`prism-spinner`**: Animated loading indicator.
