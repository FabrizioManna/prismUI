# Spec: PrismUI Component Catalog (Category 1: Foundations)

- **Date**: 2026-08-28
- **Status**: Completed

## Goal
Implement the core atomic elements (Category 1) for the PrismUI component library, which serve as the foundation for all other complex components.

## Decisions Made
- **Existing Components**: Existing components (like `prism-button`) will be refactored to support advanced features (variants, sizes, states).
- **Icons (`prism-icon`)**: Designed to accept raw SVG content (e.g., `<path>`) via property/slot to remain 100% framework-agnostic. No external SVG libraries will be bundled as dependencies.

## Scope
1. **`prism-icon`**: Lightweight SVG wrapper.
2. **`prism-badge`**: Status indicator with Glassmorphism styles.
3. **`prism-avatar`**: User profile picture with initial-fallback support.
4. **`prism-button`**: Refactored to support `size`, `variant`, `disabled`, `loading`, and icon slots.
