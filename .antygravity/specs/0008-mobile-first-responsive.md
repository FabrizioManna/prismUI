# Spec: Mobile-First Responsive Overhaul

**Date**: 2026-08-29
**Status**: Complete
**Sequence**: 0008

## Goal
Enforce a strict Mobile-First responsive design across all PrismUI components. The base Tailwind classes must target mobile devices first, progressively enhancing layout and sizing for `sm`, `md`, `lg` breakpoints.

## Scope

### 1. Structural Layouts
- **`prism-sidebar.ts`**: Must be completely hidden (`hidden md:flex`) or collapse into a bottom navigation on mobile. The `w-64` width must be applied with a `md:` prefix (`w-full md:w-64`).
- **`prism-navbar.ts`**: Adjust padding for mobile (`px-4 sm:px-6`). Hide search bars and secondary actions on small screens (`hidden md:flex`), keeping only the brand logo and a mobile menu trigger.
- **`prism-card.ts`**: Ensure padding is mobile-friendly (`p-4 sm:p-6`). Remove fixed widths if they exist.

### 2. Overlays
- **`prism-modal.ts`**: On mobile, modals should consume most of the screen (`w-[95%] sm:w-full sm:max-w-lg`) and maintain scrollable body areas.
- **`prism-drawer.ts`**: Mobile drawers should take full width or 90% width depending on placement, using `w-[90%] sm:max-w-md`.

### 3. Forms & Grid Components
- **`prism-button.ts`, `prism-input.ts`**: Ensure the default `px`, `py`, and `text-sm` are readable and tappable on mobile. Adjust touch targets if necessary.
- **Data Display (`prism-table.ts`)**: Tables on mobile are notoriously difficult. Ensure the wrapper has `overflow-x-auto` (which it currently does) and add clear scrolling indicators if needed.
- **`prism-pagination.ts`**: Hide complex page numbers on mobile, showing only "Previous" and "Next" or simplified numbering (`hidden sm:inline-flex`).

## Technical Considerations
- Adhere to Rule 16 (`.antygravity/rules/16-mobile-first.md`).
- Only modify Tailwind classes. Do not introduce complex JS-based window resize listeners. Use CSS Media Queries via Tailwind.
