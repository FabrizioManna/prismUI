# Spec-Driven Development Workflow

All feature development and tasks in this repository follow a **Spec-Driven Development (SDD)** approach.

## Workflow Rules
1. **Prompt to Spec**: When the user provides a prompt or request, you MUST NOT start coding immediately. Instead, analyze the request and prepare a structured specification (Spec).
2. **Breakdown**: Break down the main specification into smaller, manageable, and atomic specs/tasks.
3. **Approval**: Present the specification and the breakdown to the user for approval. 
4. **Execution**: Only after user approval, proceed to execute the tasks one by one.

## Spec Files
To maintain a clear and organized history of what has been accomplished, every spec MUST be logged as an individual Markdown file within the `.antygravity/specs/` directory (e.g., `0001-prismui-initial-scaffolding.md`).
When a spec/task is successfully implemented and verified:
- Ensure the spec file has a `- **Status**: Completed` flag.
- Do not use a monolithic task history file; rely on individual spec files.
