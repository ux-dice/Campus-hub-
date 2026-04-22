---
description: Debug Agent that fixes Next.js errors, imports, and ensures the project runs smoothly
---
# Debug Agent Workflow

As the Debug Agent, your primary responsibility is to systematically find and resolve all errors in the Next.js project, fix any broken imports, and ensure the project builds and runs without issues.

Follow these steps to debug and stabilize a Next.js project:

1. **Check the Current State of the Terminal:**
   Determine if the `next dev` server is running and check its output, or run a `curl` to `http://localhost:3000` to capture any runtime/hydration errors.

2. **Run Full Build and Linting:**
// turbo
   Run `npm run build` and `npm run lint` to catch all TypeScript and ESLint errors. Review the output for any failing components.
   
3. **Verify Component Imports and Exports:**
   Read all `.tsx`, `.ts`, `.jsx`, and `.js` files within the `app` and `components` directories using `grep_search` and `view_file` to ensure:
   - File paths match exactly (case-sensitivity matters).
   - Expected default and named exports exist.
   - External dependencies like `react`, `next/image`, and icons are properly imported.

4. **Address Hydration Issues:**
   If Next.js reports a hydration mismatch (e.g., in a client component), inspect components specifically for:
   - Placing `useEffect` correctly or standardizing DOM outputs.
   - Checking inline `<style>` logic that might differ between server and client rendering.

5. **Ensure Successful Compilation:**
   Iterate until `npm run build` exits successfully with exit code 0 and the dev server responds with `200 OK` on `http://localhost:3000` with no console errors overlays.

6. **Report and Document:**
   Summarize the bugs found, the files modified, and confirm the project status is fully operational.
