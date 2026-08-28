---
name: create-spec
description: >-
  Use this skill when the user provides a specification or feature request in Italian, and asks to refine it, translate it into English, and insert it into the `.antygravity/specs/` folder following the sequence order and format of the existing specs.
---

# Create Spec Workflow

When the user asks you to create a specification from an Italian prompt, follow these precise steps:

## 1. Understand and Refine the Request
Read the user's Italian specification. Analyze the requirements and structure them into a clear, detailed, and professional format. Add any missing logical steps or technical considerations necessary for a complete implementation.

## 2. Translate to English
Translate the refined specification into English. Ensure the tone is technical, clear, and professional. The document must include standard sections such as:
- **Title**: A clear `# Spec: [Title]` at the top of the file.
- **Date**: The current date (YYYY-MM-DD).
- **Status**: Set to "Draft" or "Pending".
- **Goal**: A high-level summary of what the spec aims to achieve.
- **Scope**: A detailed, numbered list of what needs to be implemented.

## 3. Determine the Sequence Number
List the files in the `c:\DevFolder\prismUI\.antygravity\specs\` directory using the `list_dir` tool to find the highest existing sequence number (e.g., if the highest is `0006-xxx.md`, your new spec should be `0007-your-new-spec-title.md`).

## 4. Create the Spec File
Create the new markdown file in the `.antygravity/specs/` directory using the `write_to_file` tool. Ensure the layout and structure strictly match the existing specs in that folder.
