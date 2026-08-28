# Spec-Driven Development Workflow

All feature development and tasks in this repository follow a **Spec-Driven Development (SDD)** approach.

## Workflow Rules
1. **Prompt to Spec**: When the user provides a prompt or request, you MUST NOT start coding immediately. Instead, analyze the request and prepare a structured specification (Spec).
2. **Breakdown**: Break down the main specification into smaller, manageable, and atomic specs/tasks.
3. **Approval**: Present the specification and the breakdown to the user for approval. 
4. **Execution**: Only after user approval, proceed to execute the tasks one by one.

## Task History Tracking
To maintain a clear history of what has been accomplished, every completed task MUST be logged in the project's task history file located at `.antygravity/task-history.md`.
When a task is successfully implemented and verified:
- Append a brief summary of the completed task to the history.
- Include the date and any relevant context (e.g., architectural decisions made).
