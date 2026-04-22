---
description: Fix all errors, imports, and ensure the Next.js project runs without issues
---

1. Analyze the project for any compilation, import, or runtime errors.
// turbo
2. Run `npm run build` to identify any TypeScript, type-checking, or build-time errors.
// turbo
3. Run `npm run lint` to identify any missing imports, unused variables, or ESLint rule violations.
4. For any errors found, use `view_file` and `grep_search` to inspect the problematic files and locate the exact lines causing the issues.
5. If dependencies are missing or unresolved, run `npm install <package-name>` to install them.
6. Address missing or broken imports by checking the file structure and updating paths securely. Use `m:\campus-hub\campus-hub\AGENTS.md` and `package.json` as references for Next.js conventions.
7. Use `replace_file_content` or `multi_replace_file_content` to fix the code directly.
// turbo
8. Run `npm run build` again to verify that all errors are fully resolved.
9. Summarize the changes made and confirm that the project builds and runs without issues.
