# Tailwind CSS Best Practices for Maintainable Components

When developing Lit components for PrismUI using Tailwind CSS, you MUST adhere to the following best practices to ensure the code remains readable, scalable, and maintainable.

## 1. Class Ordering
Write your Tailwind classes in a logical, consistent order. The standard ordering is:
1. **Layout & Positioning**: `absolute`, `relative`, `flex`, `grid`, `z-50`, `top-0`
2. **Box Model & Spacing**: `w-full`, `h-16`, `m-4`, `p-6`
3. **Typography**: `text-sm`, `font-bold`, `tracking-wide`, `text-center`
4. **Visuals & Colors**: `bg-blue-500`, `text-slate-800`, `border`, `rounded-xl`
5. **Effects & Glassmorphism**: `backdrop-blur`, `shadow-md`, `opacity-50`, `.prism-glass`
6. **Transitions & Animations**: `transition-all`, `duration-300`, `ease-in-out`
7. **States & Breakpoints**: `hover:bg-blue-600`, `focus:ring-2`, `md:flex`, `disabled:opacity-50`

## 2. Managing Long Class Strings
Tailwind can result in extremely long class strings that are hard to read. 
- **Use Variables**: If an element has more than 10 classes or relies heavily on component state, extract the classes into a variable before the `return html` block.
- **Dynamic Classes**: Avoid messy ternary operators directly in the template if they nest too deeply. Build the string cleanly:

```typescript
// Good
const buttonClasses = `
  flex items-center justify-center px-4 py-2 rounded-lg transition-colors
  ${this.variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}
  ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
`;

return html`<button class="${buttonClasses}"></button>`;
```

## 3. Avoid Arbitrary Values
Rely on the design system tokens. Do **not** use arbitrary values (e.g., `w-[342px]`, `text-[13px]`, `bg-[#ff0000]`) unless it is absolutely required for a highly specific one-off micro-adjustment. 
- Prefer `w-80` over `w-[320px]`.
- Prefer `text-sm` over `text-[14px]`.

## 4. DRY Principle within Render
If you have multiple identical elements (like list items or grid cells), do not repeat the long Tailwind string on each one. Extract it to a constant.

```typescript
// Good
const cellClass = "px-6 py-4 whitespace-nowrap text-sm text-slate-700";

return html`
  <tr>
    <td class="${cellClass}">${data.id}</td>
    <td class="${cellClass}">${data.name}</td>
    <td class="${cellClass}">${data.status}</td>
  </tr>
`;
```

## 5. Don't Fight the Cascade
In Web Components, styles are encapsulated in the Shadow DOM. However, we use a shared Tailwind stylesheet. Avoid using `!important` to force styles. Instead, ensure your component logic correctly swaps or removes conflicting classes.
