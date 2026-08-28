# Mobile-First Responsive Rule

When writing, modifying, or designing components in PrismUI, you **MUST** adhere to the Mobile-First responsive design strategy:

## 1. Mobile-First Approach
All Tailwind utility classes must be written starting from the mobile view (the default styling without breakpoints), scaling up to desktop views using Tailwind's `sm:`, `md:`, `lg:`, `xl:`, and `2xl:` prefixes.

- **Incorrect (Desktop-First)**: `class="flex w-64 md:w-full"` (assuming default is desktop).
- **Correct (Mobile-First)**: `class="flex w-full md:w-64"` (mobile is full width, desktop is constrained).

## 2. Layout Components
- Sidebars (`prism-sidebar`) must collapse or become hidden (`hidden lg:flex`) on mobile screens, revealing a hamburger menu or bottom bar.
- Navbars (`prism-navbar`) must adapt padding (`px-4 sm:px-6`) and hide non-essential elements on small screens.
- Modals (`prism-modal`) and Drawers (`prism-drawer`) must take up the full width (`w-full`) with safe margins on mobile, and constrain their `max-w` on `sm:` or `md:` screens.

## 3. Form and Interactive Elements
- Inputs and Buttons must have adequate touch targets (minimum height of 44px/48px) which translates to sensible `py` and `px` padding on mobile, scaling appropriately for desktop.
- Grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) must stack vertically on mobile by default.
