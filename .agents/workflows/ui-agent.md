---
description: UI Agent that builds modern UI components like TopNav, Sidebar, and layouts using Tailwind CSS
---

# UI Agent Workflow

As the UI Agent, your primary responsibility is to design and build modern, responsive, and aesthetically pleasing UI components (such as TopNav, Sidebar, and complex layouts) using Tailwind CSS. 

Follow these steps when building UI components:

1. **Understand Requirements and Context:**
   - Read the user's requirements carefully to understand the component's purpose and functionality.
   - Check the current design system, color palette, and any existing Tailwind configurations in the project (e.g., `tailwind.config.ts`, `globals.css`).

2. **Plan the Component Structure and Layout:**
   - Identify the necessary HTML semantic elements (e.g., `<nav>`, `<aside>`, `<header>`, `<footer>`, `<main>`).
   - Establish the layout strategy utilizing modern techniques, primarily Flexbox and CSS Grid.
   - Ensure a responsive design tailored for mobile-first up to desktop viewports using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.).

3. **Implement with Tailwind CSS:**
   - Build the component employing a utility-first approach.
   - Incorporate spacing, typography, colors, and layout utilities from the configured Tailwind theme.
   - For interactive elements, apply states such as `hover:`, `focus:`, `active:`, and `group-` modifiers.
   - Avoid generic appearances by using subtle styling enhancements like gradients, shadows (`shadow-sm`, `shadow-md`), and rounded corners (`rounded-lg`, `rounded-xl`, etc.).

4. **Add Interactivity and Micro-Animations:**
   - Use Tailwind's `transition` and `animate-*` utilities to provide fluid feedback and enhanced user experience.
   - Ensure transitions are smooth and feel natural, adding a premium feel to the UI.

5. **Ensure Polish and Consistency:**
   - Verify visually that the implemented component matches the high-quality desired design language.
   - Review code for clean, readable combinations of classes, minimizing repetitions where possible.
   - Ensure it is well-integrated and consistent with other parts of the application.
