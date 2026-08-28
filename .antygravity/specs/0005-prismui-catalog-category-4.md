# Spec: PrismUI Component Catalog (Category 4: Data Display & Tables)

- **Date**: 2026-08-28
- **Status**: Completed

## Goal
Build robust components capable of displaying dense administrative data clearly and beautifully. Combine previously built atomic elements to create complex composite widgets.

## Decisions Made
- **Table Composition**: The `prism-table` leverages `<prism-checkbox>` for selection and uses a footer slot to embed `<prism-pagination>`.
- **Accordion Location**: Kept in the navigation module, but refactored here for structural layout animations (CSS grid expansion).

## Scope
1. **`prism-table`**: Refactored with checkboxes, sorting, and pagination integration.
2. **`prism-card`**: Refactored to improve Glassmorphism styling and add a `no-padding` prop.
3. **`prism-stat`**: Refactored to support a trend indicator (arrow up/down).
4. **`prism-accordion`**: Refactored for smooth grid-based expand/collapse animations.
5. **`prism-progress`**: New linear progress bar component with glowing gradients.
6. **`prism-tooltip`**: New hover tooltip component for extra contextual information.
