# Walter Braun Umzüge Website

## Overview

This is a professional moving company website for Walter Braun Umzüge, a German moving service based in Munich and surrounding areas. The application is a full-stack web solution featuring a modern React frontend with a Node.js/Express backend. The site serves as a business showcase and lead generation platform, providing information about moving services and allowing customers to submit contact forms for quotes and consultations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Blog System Improvements (August 11, 2025) - COMPLETED ✅
- ✅ **Fixed Runware API**: Implemented working array format with correct parameters - generates authentic AI images
- ✅ **Fixed DeepSeek API**: Corrected max_tokens to 4000, added system prompts for content generation
- ✅ **Quality Improvement**: Article "Schadensfall beim Umzug: So gehen Sie in München richtig vor" confirmed as perfect quality
- ✅ **Fixed Duplicate Articles**: Removed 2-part generation to prevent duplicate article creation
- ✅ **Optimized System**: Single-call generation with comprehensive content (4-6 sections, 6-8 FAQs)
- 🎯 **Current Status**: Stable automated blog generation with no duplicates, authentic AI images, SEO optimization

### Gallery and Partners Section (August 13, 2025) - COMPLETED ✅
- ✅ **Gallery Update**: Replaced 4 stock images with 16 authentic company photos from business operations
- ✅ **Image Enhancement**: Made gallery images larger (h-64) with improved responsive grid (2-3-4 columns)
- ✅ **Zoom Removal**: Removed cursor-pointer and zoom functionality per user request - images are view-only
- ✅ **Partners Section**: Added new Partners section after Hero with placeholder content ready for partner logos
- ✅ **Authentic Content**: All gallery images now show real team, vehicles, equipment, and work situations
- 🎯 **Current Status**: Professional gallery with authentic company photos, Partners section ready for content

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Design System**: Custom design tokens with German locale support and brand-specific green color scheme

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for contact form submissions
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Logging**: Custom request logging with performance metrics
- **Development**: Hot reloading with Vite middleware integration

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema**: Shared schema definitions between frontend and backend
- **Development Storage**: In-memory storage implementation for development/testing
- **Migrations**: Drizzle Kit for database schema management

### Authentication and Authorization
- Currently implements a basic user schema but no active authentication system is in use
- Session management infrastructure present but not actively utilized
- Designed for future admin panel implementation

### Contact Management System
- Contact form submission handling with validation
- Storage of customer inquiries with timestamps
- Admin endpoint for retrieving all contact submissions
- Form validation using Zod schemas shared between client and server

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight routing solution
- **express**: Web application framework
- **drizzle-orm**: Type-safe ORM for PostgreSQL

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of UI primitives (accordion, dialog, dropdown, etc.)
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **tailwindcss**: Utility-first CSS framework

### Database and Storage
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)
- **drizzle-zod**: Integration between Drizzle and Zod for validation

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Validation and Forms
- **zod**: Schema validation library
- **react-hook-form**: Performant forms with easy validation

### Utilities
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality

### Styling and Icons
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing
- **lucide-react**: Icon library
- **font-awesome**: Additional icon set (loaded via CDN)