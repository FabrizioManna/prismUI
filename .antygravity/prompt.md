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