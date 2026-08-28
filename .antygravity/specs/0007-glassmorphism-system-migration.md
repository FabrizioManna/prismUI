# Spec: Glassmorphism System Migration

**Date**: 2026-08-28
**Status**: Complete
**Sequence**: 0007

## Goal
Migrate all existing PrismUI components to the strict Glassmorphism Design System defined in `15-glassmorphism-accessibility.md`. The goal is to ensure a unified frosted glass aesthetic, high accessibility through proper text contrast, and comprehensive coverage of all special component states (disabled, loading, hover, focus) to make them as stateless and property-driven as possible.

## Scope

### 1. Unified Glass Effect
- Apply global utility classes (`.prism-glass` or `.prism-glass-panel`) to all structural containers.
- Remove solid backgrounds (`bg-blue-500`) in favor of semi-transparent equivalents (`bg-blue-500/40`) combined with `backdrop-blur-md/lg`.
- Ensure light reflection borders (`border-white/20`) are consistently applied.

### 2. High Contrast Accessibility
- Implement the "High Contrast Rule": Any dark/intense background must use `text-white` or `text-slate-50`.
- Light/transparent backgrounds must use dark text in light mode and white text in dark mode.

### 3. Stateless Special States
- **Disabled State**: Components should use `opacity-50` and `cursor-not-allowed` while retaining the blur effect.
- **Loading State**: Integrate standard spinner/shimmer effects. The component should be unresponsive to clicks but visually distinct.
- **Hover/Focus States**: Enhance background opacity slightly on hover (e.g., from `/40` to `/50`) to provide feedback without losing the glass effect. Focus rings must be visible (`focus:ring-2 focus:ring-offset-2`).

### 4. Target Components
The migration will be applied across the entire component library, grouped by category:
- **Foundations**: Icon, Badge, Avatar
- **Form**: Button (Review), Toggle, Textarea, Slider, Select, Radio, Input, Checkbox, File Upload
- **Layout**: Card, Progress, Stat, Table, Tooltip
- **Navigation**: Accordion, Breadcrumb, Menu, Menu Item, Navbar, Pagination, Sidebar, Tabs
- **Overlays**: Alert, Drawer, Modal, Spinner, Toast

## Technical Considerations
- All changes must use Lit's reactive properties to handle states (`?disabled=${this.disabled}`).
- The `tailwind.css` file has already been updated; components just need to adopt the classes.
