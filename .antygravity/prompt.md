# 🤖 AI SYSTEM BOOTSTRAP (PrismUI)

This file contains the mandatory global directives for the AI. 
Before answering any prompt, generating code, or refactoring in this repository, you MUST follow these bootstrapping rules:

## 1. Context Initialization
You must silently read and acknowledge the master summary file to understand the project identity:
- 📖 Read: `.antygravity/rules/00-project-overview.md`

## 2. Strict Design System Enforcement
PrismUI is built exclusively on the Glassmorphism UI trend. You are forbidden from using solid backgrounds for components.
- 📖 Reference: `.antygravity/rules/03-glass-design-system.md`

## 3. Engineering Standards
Code must be production-ready, fully accessible, and written in strict TypeScript using standard Web Components (Lit).
Before writing Lit components, refresh your context on:
- 📖 Reference: `.antygravity/rules/02-lit-best-practices.md`
- 📖 Reference: `.antygravity/rules/04-accessibility-a11y.md`
- 📖 Reference: `.antygravity/rules/06-state-and-events.md`

## 4. Component Generation
If asked to create a new component, you MUST NEVER guess the structure. You must use the official boilerplate template:
- 📝 Template: `.antygravity/templates/prism-component.ts`
- 📝 Prompt guidelines: `.antygravity/prompts/generate-component.md`

## 5. Language
All generated code, comments (JSDoc), variable names, and documentation must be written in **English**.
- 📖 Reference: `.antygravity/rules/08-language-and-comments.md`

## 6. Spec-Driven Development
You must follow a Spec-Driven Development workflow. Do not write code immediately from a prompt. First, prepare a specification, break it down into smaller tasks, get approval, and log completed work as individual spec files in the `.antygravity/specs/` directory.
- 📖 Reference: `.antygravity/rules/09-spec-driven-development.md`
- 📁 Specs Directory: `.antygravity/specs/`

## 7. Documentation & README
The main `README.md` and the VitePress documentation in `docs/` must be kept strictly up to date without waiting for user prompts whenever new components are built or architectural changes occur.
- 📖 Reference: `.antygravity/rules/10-readme-updates.md`
- 📖 Reference: `.antygravity/rules/11-docs-updates.md`

## 8. Dependency Management
Whenever a dependency is removed, all references to it (code, scripts, CI/CD, config files) must be fully scrubbed from the project.
- 📖 Reference: `.antygravity/rules/12-dependency-cleanup.md`

## 9. NPM & Security
Never use `npm audit fix --force`. Dev dependency vulnerabilities should be managed surgically using `overrides`, not brute-force commands.
- 📖 Reference: `.antygravity/rules/13-npm-audit-policy.md`

## 10. Git & Commit Conventions
All commits must be in English and follow the Conventional Commits specification.
- 📖 Reference: `.antygravity/rules/14-commit-conventions.md`