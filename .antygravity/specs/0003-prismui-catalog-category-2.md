# Spec: PrismUI Component Catalog (Category 2: Form & Data Entry)

- **Date**: 2026-08-28
- **Status**: In Progress

## Goal
Implement and enhance robust, accessible, high-density form components adhering to the Glassmorphism design system.

## Decisions Made
- **File Upload**: `prism-file-upload` will only handle the UI presentation and DOM events (Drag & Drop, file selection). HTTP upload logic is left to the consumer.
- **Select**: The native `<select>` element restricts styling. `prism-select` is refactored into a fully custom Lit-based dropdown menu to ensure consistent glassmorphism rendering across all browsers.
- **Password Input**: `prism-input` supports `type="password"` with an internal toggle button to show/hide the text.

## Scope
1. **`prism-input`**: Refactored to support `helperText`, `error` states, and password toggle.
2. **`prism-select`**: Refactored to a fully custom styled dropdown.
3. **`prism-toggle`**: Refactored for smoother animation and strict ARIA accessibility.
4. **`prism-textarea`**: Multi-line text input with auto-resize.
5. **`prism-checkbox`**: Checkbox supporting `indeterminate` state.
6. **`prism-radio` & `prism-radio-group`**: Mutually exclusive choice inputs.
7. **`prism-slider`**: Range slider input maintaining the glass aesthetic.
8. **`prism-file-upload`**: Dropzone area for files.
