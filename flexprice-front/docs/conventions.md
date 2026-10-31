# FlexPrice Frontend Conventions and Best Practices

## Directory Structure

```
src/
├── components/
│   ├── atoms/       # Basic building blocks (buttons, inputs, etc.)
│   ├── molecules/   # Combinations of atoms (forms, cards, etc.)
│   └── organisms/   # Complex UI sections (headers, sidebars, etc.)
├── pages/           # Route-level components
├── layouts/         # Page layout templates
├── hooks/           # Custom React hooks
├── store/           # State management (Redux/Zustand)
├── utils/           # Helper functions and utilities
├── lib/             # Third-party library configurations
├── models/          # TypeScript interfaces and types
└── core/            # Core application logic
```

## File Naming Conventions

1. **Components**

   - Use PascalCase for component files: `Button.tsx`, `UserProfile.tsx`
   - Each component should have its own directory with the same name
   - Include related files (styles, tests, types) in the component directory

   ```
   Button/
   ├── Button.tsx
   ├── Button.test.tsx
   ├── Button.styles.ts
   └── index.ts
   ```

2. **Utilities and Helpers**

   - Use camelCase for utility files: `formatDate.ts`, `validateInput.ts`
   - Group related utilities in directories: `utils/date/`, `utils/validation/`

3. **Constants and Types**
   - Use UPPER_SNAKE_CASE for constant files: `API_ENDPOINTS.ts`
   - Use PascalCase for type files: `UserTypes.ts`

## Component Guidelines

1. **Component Size**

   - Keep components under 250 lines of code
   - If exceeding, consider splitting into smaller components
   - Extract complex logic into custom hooks
   - Break down large components into smaller, focused pieces

2. **When to Create Reusable Components**

   - Create an atom/molecule when:
     - The component is used in 3+ places
     - It represents a clear UI pattern
     - It has clear, defined props and behavior
   - Keep components in the page directory when:
     - They're specific to one page/feature
     - They contain page-specific business logic
     - They're unlikely to be reused

3. **Component Organization**

   ```typescript
   // Imports order
   import React from 'react';
   import external libraries...
   import local components...
   import hooks...
   import utils...
   import types...
   import styles...

   // Component structure
   interface Props {
     // Props definition
   }

   export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
     // Hooks
     // State
     // Effects
     // Helper functions
     // Render
     return (...)
   };
   ```

## Code Style Guidelines

1. **TypeScript**

   - Always use TypeScript for type safety
   - Define interfaces for component props
   - Use type inference where possible
   - Avoid `any` type

2. **State Management**

   - Use local state for component-specific state
   - Use context for theme, auth, and global UI state
   - Use store (Redux/Zustand) for complex application state

3. **Performance**

   - Use React.memo() for expensive components
   - Implement useMemo() for expensive calculations
   - Use useCallback() for function props
   - Lazy load routes and large components

4. **CSS/Styling**
   - Use CSS-in-JS or CSS modules
   - Follow BEM naming convention if using CSS classes
   - Keep styles colocated with components
   - Use theme variables for colors, spacing, etc.

## Best Practices

1. **Component Creation**

   - Use functional components with hooks
   - Keep components focused and single-responsibility
   - Use composition over inheritance
   - Implement proper error boundaries

2. **Props**

   - Use destructuring for props
   - Provide default props where appropriate
   - Document complex props with JSDoc
   - Use proper prop types

3. **Testing**

   - Write tests for critical business logic
   - Test component behavior, not implementation
   - Use meaningful test descriptions
   - Follow AAA pattern (Arrange, Act, Assert)

4. **Code Quality**
   - Use ESLint and Prettier
   - Write meaningful commit messages
   - Review code before committing
   - Document complex logic

## File Location Decision Tree

1. **New Component**

   - Is it a basic UI element? → `atoms/`
   - Is it a combination of atoms? → `molecules/`
   - Is it a complex section? → `organisms/`
   - Is it page-specific? → `pages/ComponentName/`

2. **New Hook**

   - Is it used across components? → `hooks/`
   - Is it component-specific? → Keep it in component file

3. **New Utility**

   - Is it generic? → `utils/`
   - Is it feature-specific? → Feature directory
   - Is it API-related? → `core/api/`

4. **New Type**
   - Is it a model/entity? → `models/`
   - Is it component-specific? → Component directory
   - Is it shared? → `types/`

## Documentation

1. **Component Documentation**

   - Document props using JSDoc
   - Include usage examples
   - Document side effects
   - Explain complex logic

2. **Code Comments**
   - Write why, not what
   - Document complex algorithms
   - Explain business logic
   - Mark TODOs with ticket numbers

Remember: These conventions are guidelines, not strict rules. Use judgment and consistency in application.
