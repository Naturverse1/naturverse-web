# Overview

The Naturverse is an educational web application designed for children to explore and learn about nature through interactive stories, games, and virtual expeditions. The platform combines engaging visuals, magical themes, and educational content to create an immersive learning experience. The application features a modern, colorful design with nature-inspired themes and smooth animations to captivate young users.

## Recent Changes (August 2025)

**Production Deployment**: Migrated to Cloudflare Pages for optimal performance and to resolve Vercel cache issues. Configured as static SPA with _redirects file for proper routing. No server functions or API dependencies. Build time: 9.39 seconds with optimized asset delivery.

**Deployment Platform**: Cloudflare Pages (migrated from Vercel to resolve persistent cache issues)

**Asset Bundle**: 
- JavaScript: 545.43 kB (157.93 kB gzipped)
- CSS: 139.00 kB (19.25 kB gzipped)  
- HTML: 1.57 kB (0.78 kB gzipped)
- Character/media assets: 5.8+ MB total (17 authentic character images + 4 background scenes)

**Authentication**: Demo mode serves as primary access method. Google OAuth configured but users can explore platform without authentication barriers.

**Routing Optimization**: Fixed preview flashing and redirect loops by removing problematic window.location.href redirect in fallback route. Wouter now handles all routing cleanly with direct component rendering for unmatched paths.

**Vercel Deployment Setup**: Configured for static SPA deployment with proper rewrites. Build outputs to dist/public/ with vercel.json handling all SPA routes through index.html fallback. Asset bundle optimized at 5.8+ MB total with all authentic Naturverse character images.

**Development Stabilization**: Configured one-click dev and deploy workflow. Verified wouter routing with proper fallback handling (no redirect loops). Build process stabilized with clean dist/public output. All 17 Naturverse character assets properly bundled and deployment-ready.

**CSS Error Fix**: Resolved `border-border` CSS error that was preventing Vercel deployment. Fixed invalid Tailwind class usage in both index.css and chart.tsx components. Updated CSS to use direct HSL values instead of problematic Tailwind apply directives. Build now completes successfully without CSS compilation errors.

**Vercel Build Optimization**: Updated vercel.json with explicit build configuration using `npx vite build` command and removed CSS variable conflicts in Tailwind config. Fixed border color definitions to use static HSL values instead of CSS variables that were causing compilation issues on Vercel's build system.

**Complete CSS Variable Fix**: Systematically replaced all problematic CSS variable references (`bg-border`, `border-sidebar-border`, `bg-sidebar-border`) with static `bg-gray-200` and `border-gray-200` classes across 8 component files (separator.tsx, sidebar.tsx, resizable.tsx, context-menu.tsx, command.tsx, scroll-area.tsx, navigation-menu.tsx). Build now completes successfully without any CSS compilation errors.

**Import Resolution Fix**: Resolved Vercel build issue with tooltip component imports by replacing alias-based imports (`@/components/ui/tooltip`) with relative imports (`./components/ui/tooltip`). This ensures compatibility with Vercel's build system which sometimes has issues resolving Vite path aliases during production builds.

**Chart CSS Border Fix**: Fixed the final Vercel CSS compilation error by replacing `stroke-border` references in chart.tsx with `stroke-gray-300` and `border-[--color-border]` with `border-gray-300`. These stroke-border classes were being interpreted by Tailwind as invalid `border-border` classes, causing the build failures.

**Vercel Cache Prevention**: Updated vercel.json to use rewrites instead of routes and added aggressive cache clearing in build command. Added .vercelignore to exclude development artifacts. This ensures fresh builds without cached CSS compilation issues.

**CSS Variable Definition Fix**: Resolved the final root cause by adding missing CSS variable definitions in index.css. The tailwind config was referencing variables like `--emerald`, `--forest`, etc. that weren't defined in the CSS, causing "border-border" compilation errors. Added complete extended color system definitions for both light and dark modes.

**Complete Tailwind to Vanilla CSS Transition**: Successfully replaced Tailwind CSS with stable vanilla CSS architecture to eliminate all Vercel build issues. Created new `styles.css` file with comprehensive custom utility classes and component styles that maintain the magical Naturverse design while ensuring 100% Vercel compatibility. Removed all `@apply`, `@layer`, and `@tailwind` directives plus tailwind-merge dependencies. Fixed PostCSS ES module configuration. Build now completes successfully in 9.39 seconds with optimized CSS bundle (5.00kB vs previous 139kB). Aggressive Vercel cache-clearing strategy implemented to bypass persistent deployment cache issues.

**Responsive Layout Implementation**: Added comprehensive responsive fixes including container constraints, responsive hero image scaling, and proper mobile viewport handling. Updated main app container structure and applied responsive hero classes to key character images. CSS includes responsive utility classes with proper media queries and flexible image sizing for optimal mobile experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**React with TypeScript**: The frontend is built using React with TypeScript for type safety and better development experience. The application uses functional components with hooks for state management.

**Vite Build System**: Vite is used as the build tool and development server, providing fast hot module replacement and optimized production builds. The configuration includes Replit-specific plugins for development environment integration.

**Component Organization**: The UI follows a modular component structure with shadcn/ui components providing a consistent design system. Components are organized into:
- Page components (`client/src/pages/`)
- Reusable UI components (`client/src/components/ui/`)
- Feature-specific components (`client/src/components/`)

**Styling Framework**: Tailwind CSS is used for styling with a custom theme configuration that includes nature-inspired colors and magical design elements. The design system uses CSS variables for theming and includes custom fonts (Fredoka One for headings, Inter for body text).

**Routing**: Client-side routing is implemented using Wouter, a lightweight React router alternative.

## Backend Architecture

**Express.js Server**: The backend uses Express.js with TypeScript, providing a RESTful API structure. The server includes middleware for JSON parsing, request logging, and error handling.

**Modular Route System**: Routes are organized in a separate module (`server/routes.ts`) with a clear separation between route definitions and business logic.

**Storage Abstraction**: The application uses a storage interface pattern that currently implements an in-memory storage system but can be easily extended to use databases. This provides flexibility for future database integration.

## Data Storage Solutions

**In-Memory Storage**: Currently uses a memory-based storage implementation for development and testing purposes. The storage interface is designed to be database-agnostic.

**Database Ready**: The project includes Drizzle ORM configuration for PostgreSQL, indicating preparation for database integration. Schema definitions are centralized in `shared/schema.ts`.

**User Management**: Basic user schema is defined with username and password fields, prepared for authentication implementation.

## Authentication and Authorization

**Schema Prepared**: User authentication schema is defined using Drizzle with Zod validation, but authentication middleware is not yet implemented.

**Session Management**: The project includes connect-pg-simple for PostgreSQL session storage, indicating preparation for session-based authentication.

## External Dependencies

**UI Components**: Extensive use of Radix UI primitives for accessible, unstyled components that are then styled with Tailwind CSS through shadcn/ui.

**State Management**: TanStack React Query for server state management, providing caching, synchronization, and background updates.

**Development Tools**: 
- Replit integration for development environment
- Runtime error overlay for better debugging experience
- Hot module replacement for fast development cycles

**Build and Development**:
- esbuild for production server bundling
- PostCSS with autoprefixer for CSS processing
- TypeScript for type checking across the entire stack

The architecture prioritizes developer experience, maintainability, and scalability while providing a solid foundation for an educational platform focused on children's engagement with nature-based learning content.