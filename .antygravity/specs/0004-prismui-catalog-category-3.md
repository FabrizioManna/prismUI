# Spec: PrismUI Component Catalog (Category 3: Navigation & Routing)

- **Date**: 2026-08-28
- **Status**: Completed

## Goal
Develop the essential navigational structures required for complex Admin Dashboards. Ensure smooth routing, clear hierarchies, and optimal use of screen real estate.

## Decisions Made
- **Dropdown Menus**: `prism-menu` and `prism-menu-item` will be created first, as they are dependencies for `prism-navbar`'s user profile section.
- **Sidebar Collapse**: The `prism-sidebar` will support an icon-only mode when `collapsed` is true, utilizing the `prism-icon` component.

## Scope
1. **`prism-menu` & `prism-menu-item`**: Reusable dropdown menu components.
2. **`prism-navbar`**: Refactored to be a sticky top header containing search and user dropdown.
3. **`prism-sidebar`**: Refactored to support a collapsible icon-only mode.
4. **`prism-tabs`**: Horizontal navigation tabs with animated active indicator.
5. **`prism-breadcrumb`**: Hierarchical location display.
6. **`prism-pagination`**: Controls for data tables.
