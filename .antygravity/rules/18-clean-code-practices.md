# Clean Code, Efficiency & Best Practices

To maintain a high-quality, performant, and scalable codebase, all TypeScript and Lit code in PrismUI must follow these exhaustive clean code and efficiency standards.

## 1. Clean Code Principles (Robert C. Martin Guidelines)

### Naming Conventions
- **Intention-Revealing Names**: Names should tell you why it exists, what it does, and how it is used. Avoid abstract names like `data` or `val`.
  ```typescript
  // Bad
  const d = 5; // elapsed time in days
  
  // Good
  const elapsedTimeInDays = 5;
  ```
- **Class vs Method Names**: Classes and components should be nouns (e.g., `UserList`, `PrismButton`). Methods should be verbs or verb phrases (e.g., `fetchUserData`, `handleClick`).
- **Boolean Variables**: Prefix booleans with `is`, `has`, `should`, or `can`.
  ```typescript
  // Bad
  let valid = true;
  
  // Good
  let isValid = true;
  ```

### Functions
- **Small and Focused**: Functions should do exactly ONE thing.
- **Function Arguments**: The ideal number of arguments is zero, then one, then two. For three or more, use a configuration object.
  ```typescript
  // Bad
  function createButton(text: string, color: string, size: string, disabled: boolean) {}
  
  // Good
  interface ButtonConfig { text: string; color: string; size: string; disabled: boolean; }
  function createButton(config: ButtonConfig) {}
  ```
- **No Flag Arguments**: Passing boolean flags implies the function does more than one thing. Split it.
- **Early Returns (Guard Clauses)**: Check for invalid states at the top of your function and return early.
  ```typescript
  // Bad
  function processUser(user: User) {
    if (user != null) {
      if (user.isActive) {
        // do work
      }
    }
  }
  
  // Good
  function processUser(user: User) {
    if (!user || !user.isActive) return;
    // do work
  }
  ```

### Comments & Code Formatting
- **Comments as a Last Resort**: Code should document itself. Use comments only to explain *why* a particular decision was made, not *what* it is doing.
- **No Commented-Out Code**: Never leave commented-out code in the repository. Delete it.
- **Vertical Density**: Declare variables as close to their usage as possible.

### General Architecture
- **The Boy Scout Rule**: Always leave the code cleaner than you found it. If you see bad code, refactor it immediately, even if you are just passing by.
- **DRY (Don't Repeat Yourself)**: Extract repeated code into helper functions or utilities.
- **KISS (Keep It Simple, Stupid)**: Avoid overly clever one-liners if they sacrifice readability.
- **YAGNI (You Aren't Gonna Need It)**: Implement only what is required now.
- **Magic Numbers & Strings**: Extract them to clearly named constants.
  ```typescript
  // Bad
  setTimeout(doWork, 86400000);
  
  // Good
  const ONE_DAY_IN_MS = 86400000;
  setTimeout(doWork, ONE_DAY_IN_MS);
  ```

### Objects and Data Structures
- **Law of Demeter**: A module should not know about the inner details of the objects it manipulates. Avoid deep dot-chaining (`user.profile.settings.theme`).
- **Data/Object Anti-Symmetry**: Objects hide their data behind abstractions and expose behavior (functions). Data structures expose their data and have no meaningful behavior. Choose the right one for the job.

### Error Handling
- **Use Exceptions, Not Return Codes**: Returning status codes leads to deeply nested, hard-to-read code. Throw errors and catch them.
- **Provide Context**: Throw errors with descriptive messages that explain the failure context.

### Testing (F.I.R.S.T Principles)
Clean code implies clean tests. Tests must be:
- **Fast**: They should run quickly.
- **Independent**: Tests should not depend on the state of other tests.
- **Repeatable**: They must run predictably in any environment.
- **Self-Validating**: They should have a clear boolean output (pass/fail) without manual inspection.
- **Timely**: They should ideally be written just before production code (TDD).

## 2. TypeScript Specifics
- **No `any`**: Always define proper Interfaces or Types.
- **Immutability**: Treat data as immutable. Prefer spreading over mutating methods.
  ```typescript
  // Bad
  users.push(newUser);
  
  // Good
  users = [...users, newUser];
  ```
- **Utility Types**: Leverage TS utility types like `Partial<T>`, `Pick<T, K>`, and `Omit<T, K>`.

## 3. Lit Component Best Practices
- **`@property` vs `@state`**: Use `@property` for external data, `@state` for internal private state.
- **Use Directives**: Never construct complex class strings manually. Use `classMap`.
- **Avoid Manual DOM Manipulation**: Never use `document.getElementById` or `this.shadowRoot.innerHTML`.
- **Query Decorators**: Use `@query` for DOM references.
- **Use `nothing`**: When a condition is false, return `nothing` rather than `''`.
  ```typescript
  return this.show ? html`<div>Hi</div>` : nothing;
  ```

## 4. Performance & Memory Management
- **Debounce & Throttle**: Any event listeners attached to `scroll` or `resize` MUST be debounced.
- **Cleanup Listeners**: Explicitly remove global listeners in `disconnectedCallback()`.
  ```typescript
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize);
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize);
    super.disconnectedCallback();
  }
  ```
- **Avoid Inline Arrow Functions**: Bind event listeners to class methods.
  ```typescript
  // Bad
  @click="${(e) => this.handleClick(e)}"
  
  // Good
  @click="${this.handleClick}"
  ```

## 5. Async & Error Handling
- **Async/Await**: Always prefer `async/await` over `.then().catch()` chains.
- **Parallel Execution**: Use `Promise.all()` for independent asynchronous operations.
- **Graceful Error Handling**: Always wrap risky async operations in `try/catch` blocks.
