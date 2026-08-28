# TypeScript & Linter Rules

For a maintainable and robust PrismUI codebase, we enforce strict TypeScript configurations and ESLint rules. When writing or refactoring TypeScript code, you must inherently follow these standard linter rules, even if a linter is not actively yelling at you.

## 1. Type Safety & Annotations
- **`@typescript-eslint/no-explicit-any`**: Never use the `any` type. If the type is truly unknown at runtime, use the `unknown` type and perform type checking before interacting with it.
  ```typescript
  // Bad
  function parseData(data: any) {}
  
  // Good
  function parseData(data: unknown) {
    if (typeof data === 'string') { /* ... */ }
  }
  ```
- **`@typescript-eslint/explicit-function-return-type`**: Always declare the return type for public functions and component methods, especially for complex utilities. This prevents unexpected return values from breaking downstream code.
  ```typescript
  // Bad
  public calculateTotal(items: Item[]) { return items.length; }
  
  // Good
  public calculateTotal(items: Item[]): number { return items.length; }
  ```
- **`@typescript-eslint/no-non-null-assertion`**: Avoid using the non-null assertion operator (`!`). Force yourself to handle the potential `null` or `undefined` case.
  ```typescript
  // Bad
  const user = getUser();
  console.log(user!.name);
  
  // Good
  const user = getUser();
  if (user) console.log(user.name);
  ```

## 2. Variables & Scoping
- **`no-var` & `prefer-const`**: Never use `var`. Always use `const` unless the variable needs to be reassigned, in which case use `let`.
- **`@typescript-eslint/no-unused-vars`**: Do not leave unused variables, imports, or parameters in your code. They cause clutter and confusion.

## 3. Control Flow & Logic
- **`eqeqeq`**: Always use strict equality (`===` and `!==`) instead of loose equality (`==` and `!=`), except when intentionally checking for both `null` and `undefined` via `x == null`.
- **`no-fallthrough`**: Always include a `break` or `return` in every `switch` case, unless intentionally falling through (which should be explicitly commented).
- **`@typescript-eslint/no-floating-promises`**: Never call an asynchronous function without `await`ing it, returning it, or `.catch()`ing it. Floating promises can lead to unhandled rejections that crash the app silently.
  ```typescript
  // Bad
  this.fetchData(); // returns a promise, but it's ignored
  
  // Good
  await this.fetchData();
  // Or
  this.fetchData().catch(console.error);
  ```

## 4. Interfaces vs Types
- **Prefer Interfaces for Objects**: Use `interface` when defining object structures (like component properties or API responses) because they are extensible via declaration merging and often provide better error messages.
- **Use Types for Unions/Intersections**: Use `type` aliases for unions (`type Status = 'success' | 'error'`) or complex mapped types.

## 5. Classes & Lit Components
- **`@typescript-eslint/explicit-member-accessibility`**: Always explicitly mark class methods and properties with `public`, `private`, or `protected`. In Lit components, helper methods should usually be `private` to avoid polluting the component's public API surface.
  ```typescript
  // Bad
  toggleState() { this.open = !this.open; }
  
  // Good
  private toggleState(): void { this.open = !this.open; }
  ```
- **`@typescript-eslint/lines-between-class-members`**: Leave a blank line between methods inside a class to improve readability.

## 6. Strict Configuration & Typing (TypeScript Best Practices)
Based on [andredesousa/typescript-best-practices](https://github.com/andredesousa/typescript-best-practices), ensure your TypeScript compiler (`tsconfig.json`) is configured strictly:
- **`strict: true`**: This is mandatory. It enables all strict type checking options (like `strictNullChecks`, `noImplicitAny`, etc.).
- **`forceConsistentCasingInFileNames: true`**: Prevents case-sensitivity issues across different operating systems.
- **`noImplicitReturns: true`**: Ensures all code paths in a function return a value.
- **`noUnusedLocals: true`**: Automatically flags unused variables.

### Strings Should Be Safe (Literal Union Types)
If a variable of type `string` can only have a specific set of values, do not type it as `string`. Define the exact list of possible values as a union type. This catches bugs at compile-time rather than runtime.
```typescript
// Bad
let status: string = 'loading'; // Could be set to any random string

## 7. Advanced ESLint & Performance (Modern Standards)
To maintain performance and predictability in modern TypeScript projects, adhere to the latest ESLint standards:
- **`@typescript-eslint/consistent-type-imports`**: Always use `import type` when importing types or interfaces. This guarantees that they are cleanly erased during transpilation, optimizing tree-shaking and build performance.
  ```typescript
  // Bad
  import { User, fetchUsers } from './api';
  
  // Good
  import { fetchUsers } from './api';
  import type { User } from './api';
  ```
- **`@typescript-eslint/no-misused-promises`**: Protects against passing promises to places that don't expect them, such as `if` conditions or standard array `forEach` loops.
- **Decouple Formatting from Linting**: Do not use ESLint for stylistic formatting rules (quotes, semicolons, spacing). Offload formatting entirely to **Prettier** and use `eslint-config-prettier` to disable conflicting ESLint rules.
- **Type-Aware Linting Performance**: Type-aware rules (like `no-floating-promises`) are computationally heavy. Always ensure ESLint is run with the `--cache` flag in CI/CD pipelines to only re-lint changed files, preventing lint debt without sacrificing speed.
- **Import Cycles (`import/no-cycle`)**: Always enforce protection against circular dependencies. In large Lit component architectures, circular imports often lead to `undefined` runtime crashes when components try to register each other.
