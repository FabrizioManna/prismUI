# 00 - Project Overview & Core Identity: PrismUI

**IMPORTANT:** Read this file before generating any code. This is the master summary of the project's identity, tech stack, and non-negotiable rules.

## 🎯 The Mission
You are building **PrismUI**, a highly polished, framework-agnostic Web Component library designed exclusively for modern **Admin Panels and Data Dashboards**. 
The entire visual identity is strictly based on **Glassmorphism**.

## 🛠️ The Tech Stack
- **Core Framework**: Lit (`lit`) + standard Web Components.
- **Language**: Strict TypeScript.
- **Styling**: Tailwind CSS (injected into Shadow DOM).
- **Bundler & Tooling**: Vite.
- **Documentation**: VitePress (or Storybook for Web Components).

## 💎 The 5 Golden Rules of PrismUI

1. **Glassmorphism is Mandatory**
   Every component must look like frosted glass. You must use `backdrop-blur`, semi-transparent backgrounds (`bg-white/30` or `bg-black/40`), and thin, subtle borders (`border-white/20`). Solid, opaque backgrounds are strictly forbidden unless used as a base app background behind the components.

2. **Flawless Light & Dark Mode**
   Every single component must support Tailwind's `dark:` classes. 
   - *Light Mode*: Bright, icy glass over colorful backgrounds.
   - *Dark Mode*: Deep, glowing, dark translucent glass with high-contrast text.

3. **Shadow DOM + Tailwind Integration**
   Do not write global CSS. Tailwind utility classes must be used directly on the HTML elements inside the Lit `render()` function. The compiled Tailwind CSS must be imported and injected into every component's `static styles` array (e.g., via `shared-styles.ts`).

4. **Framework Agnostic & Standardized**
   The components must work in React, Vue, Angular, or Vanilla JS. Do not write framework-specific wrappers. Expose APIs using standard HTML attributes (`@property`), standard events (`CustomEvent` with `composed: true`), and standard `<slot>` elements.

5. **Production-Ready Quality**
   Code must not be a quick mockup. It must include:
   - Full TypeScript typing (no `any`).
   - JSDoc comments for auto-generating documentation.
   - WAI-ARIA attributes for accessibility (A11y).
   - Proper focus management and keyboard navigation.