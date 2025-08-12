# Overview

The Naturverse is an educational web application designed for children to explore and learn about nature through interactive stories, games, and virtual expeditions. The platform combines engaging visuals, magical themes, and educational content to create an immersive learning experience. The application features a modern, colorful design with nature-inspired themes and smooth animations to captivate young users.

## Recent Changes (August 2025)

**Production Deployment**: Successfully deployed to Vercel as a static site with clean @vercel/static configuration. No server functions or API dependencies. Build time: 10.42 seconds with optimized asset delivery.

**Current Production URL**: https://naturverse-explore-j1om2y4m0-scotts-projects-1d09703b.vercel.app

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