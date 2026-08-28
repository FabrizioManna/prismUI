# Clean Code, Efficiency & Best Practices

To maintain a high-quality, performant, and scalable codebase, all TypeScript and Lit code in PrismUI must follow these exhaustive clean code and efficiency standards.

## 1. Clean Code Principles (Robert C. Martin Guidelines)

### Naming Conventions
- **Intention-Revealing Names**: Names should tell you why it exists, what it does, and how it is used. Avoid abstract names like `data` or `val`.
- **Class vs Method Names**: Classes and components should be nouns (e.g., `UserList`, `PrismButton`). Methods should be verbs or verb phrases (e.g., `fetchUserData`, `handleClick`).
- **Boolean Variables**: Prefix booleans with `is`, `has`, `should`, or `can` (e.g., `isOpen`, `hasError`).

### Functions
- **Small and Focused**: Functions should be small. They should do exactly ONE thing (Single Responsibility).
- **Function Arguments**: The ideal number of arguments is zero, then one, then two. Functions with three or more arguments should be refactored (e.g., by passing a single configuration object/interface).
- **No Flag Arguments**: Passing boolean flags (e.g., `renderData(true)`) implies the function does more than one thing. Split it into two functions.
- **Early Returns (Guard Clauses)**: Avoid deep nesting (if/else chains). Check for invalid states at the top of your function and return early. This flattens the code and makes the "happy path" clear.

### Comments & Code Formatting
- **Comments as a Last Resort**: Code should document itself through clear naming. Do not use comments to explain *what* bad code is doing; rewrite the code. Use comments only to explain *why* a particular decision or workaround was made.
- **No Commented-Out Code**: Never leave commented-out code in the repository. Version control (Git) remembers it. Delete it.
- **Vertical Density**: Related concepts should be grouped together vertically. Variables should be declared as close to their usage as possible.

### General Architecture
- **DRY (Don't Repeat Yourself)**: Never duplicate logic. Extract repeated code into helper functions or utilities.
- **KISS (Keep It Simple, Stupid)**: Write code that is easy to read. Avoid overly clever one-liners or complex ternary operators if they sacrifice readability.
- **YAGNI (You Aren't Gonna Need It)**: Do not write code or add properties for features "just in case". Implement only what is required now.
- **Magic Numbers & Strings**: Never hardcode arbitrary numbers or strings deep in the logic. Extract them to clearly named constants at the top of the file (e.g., `const MAX_RETRIES = 3;`).
- **Law of Demeter**: A module should not know about the inner details of the objects it manipulates. Avoid deep dot-chaining (`user.profile.settings.theme`).

## 2. TypeScript Specifics
- **No `any`**: The use of `any` is strictly forbidden. Always define proper Interfaces or Types. If the type is truly unknown, use `unknown` and perform type narrowing.
- **Immutability**: Treat data as immutable whenever possible. Use `ReadonlyArray` or `readonly` properties for state that shouldn't change. When updating arrays or objects, prefer spreading (`...`) or `.map()`/`.filter()` over mutating methods like `.push()` or `.splice()`.
- **Utility Types**: Leverage TS utility types like `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, and `Record<K, T>` instead of rewriting interfaces.

## 3. Lit Component Best Practices
- **`@property` vs `@state`**: Use `@property` only for data that comes from outside the component (attributes/props). Use `@state` for internal reactive state that the consumer of the component shouldn't care about.
- **Use Directives**: Never construct complex class strings manually. Use Lit's `classMap` for conditional classes and `styleMap` for dynamic inline styles.
- **Avoid Manual DOM Manipulation**: Let Lit handle the DOM. Never use `document.getElementById` or `this.shadowRoot.innerHTML`.
- **Query Decorators**: Use `@query` and `@queryAll` for DOM references. They are cached and much faster than manual queries.
- **Use `nothing`**: When a condition is false, return Lit's `nothing` constant rather than an empty string `''` to prevent rendering empty text nodes.
- **Lifecycle Methods**: Use `updated(changedProperties: PropertyValues)` for side-effects when reactive data changes, rather than putting side-effects in setters.

## 4. Performance & Memory Management
- **Debounce & Throttle**: Any event listeners attached to `scroll`, `resize`, or rapid `input` events MUST be debounced or throttled to prevent layout thrashing and CPU bottlenecks.
- **Cleanup Listeners**: If you attach event listeners to `window`, `document`, or a `ResizeObserver` in `connectedCallback()`, you MUST explicitly remove them in `disconnectedCallback()` to prevent memory leaks.
- **Avoid Inline Arrow Functions**: Bind event listeners to class methods instead of creating new arrow functions inline in the `html` template, which can cause unnecessary re-renders.
  ```typescript
  // Bad
  @click="${(e) => this.handleClick(e)}"
  
  // Good
  @click="${this.handleClick}"
  ```
- **Pure Functions**: Extract complex data transformations out of the component class into pure functions (often placed in a `utils/` folder). This makes the logic highly testable and keeps the component focused purely on UI rendering.

## 5. Async & Error Handling
- **Async/Await**: Always prefer `async/await` over `.then().catch()` chains for better readability.
- **Parallel Execution**: Use `Promise.all()` when executing multiple independent asynchronous operations, rather than awaiting them sequentially.
- **Graceful Error Handling**: Always wrap risky async operations in `try/catch` blocks. Never let an unhandled promise rejection crash the component state. Log errors appropriately and show user-friendly fallback UIs.
