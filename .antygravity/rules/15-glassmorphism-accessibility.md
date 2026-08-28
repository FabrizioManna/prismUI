# Glassmorphism & Accessibility Rule

When writing, modifying, or designing components in PrismUI, you **MUST** adhere to the following design and accessibility rules:

## 1. Glassmorphism Design (Glass/Mirror Effect)
All components must appear to be made of frosted glass. Use the global classes provided in `tailwind.css` or compose them using Tailwind classes:

- **Background**: Semi-transparent (e.g., `bg-white/20`, `bg-black/40`, `bg-blue-500/40`). Never use solid colors (e.g., `bg-blue-500`) unless strictly necessary for interaction.
- **Blur**: Always use `backdrop-blur-md` or `backdrop-blur-lg` to blur the background behind the component.
- **Border**: Add a semi-transparent border to simulate light reflecting on the edge of the glass (e.g., `border border-white/20` in light mode, `border-white/10` in dark mode).
- **Shadow**: Use `shadow-lg` or `shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]` to give depth.

You can also use the custom classes defined in `tailwind.css`:
- `.prism-glass` (General)
- `.prism-glass-panel` (For cards, modals, and panels)

## 2. Accessibility Rules (Contrast)
The glass effect can reduce readability if not balanced. It is imperative to have **good contrast**.

- **On dark/intense backgrounds (e.g., dark blue or black primary button):** Text **MUST** be white or very light (`text-white`, `text-slate-50`). **DO NOT** use dark text (e.g., `text-slate-900`) on dark backgrounds. "Example: on a black button, you cannot put black text color because it is not visible; put white which has a high visibility percentage on the color."
- **On light/transparent backgrounds (Light mode):** Text must be dark (`text-slate-900`, `text-slate-800`).
- If necessary, force high visibility with the custom class `.text-high-contrast` (color `#ffffff` with `!important`).

## 3. Dark Mode
- Always ensure that the component supports dark mode with Tailwind variants (e.g., `dark:bg-slate-900/50`, `dark:text-white`).
- Contrast must work perfectly in both modes.
