# Walter Braun Umzüge Website

## Overview
This project is a professional full-stack web solution for Walter Braun Umzüge, a German moving company. It features a modern React frontend and a Node.js/Express backend, serving as a business showcase and lead generation platform. Key capabilities include providing information about moving services, allowing customers to submit contact forms, and an automated blog system for SEO and content marketing. The project aims to enhance online presence, streamline customer inquiries, and provide valuable content to potential clients.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
- **Blog System Fully Operational (Aug 2025)**: Complete AI-powered blog automation with 7500+ character articles, München-specific content, Runware image generation, and PostgreSQL persistence. Auto-generates every 80 hours with robust error handling and character cleaning.
- **VPS Blog Management Scripts**: Created cleanup and manual generation scripts for production deployment
- **Git-Safe-Update Script Fixed (Aug 2025)**: SSL-aware update script prevents certificate loss and configuration overwrites
- **HTTPS Restored**: SSL functionality fully working after git update issues were resolved
- **VPS Deployment Stable**: Docker Compose with SSL, nginx reverse proxy, automatic HTTP->HTTPS redirect
- **SMTP Integration (Jan 2025)**: Implemented nodemailer with smtp.strato.de:465, sending to ceo@skyline-websites.de
- **Google Ads Tracking (Jan 2025)**: Added conversion tracking with Cookie-Consent integration (AW-16893834151)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite.
- **UI/UX**: Shadcn/UI components (built on Radix UI), styled with Tailwind CSS and custom theming (German locale, brand-specific green color scheme).
- **State Management**: TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Forms**: React Hook Form with Zod validation.
- **Animations**: Subtle, performance-optimized fade-in and slide-up animations for enhanced UX.
- **Responsiveness**: Complete mobile optimization across all components including hero section, service cards, gallery, contact forms, and footer.
- **Privacy**: 100% DSGVO-compliant cookie consent system with granular options and conditional loading of analytics.
- **SEO**: Auto-generated XML sitemap, robots.txt, canonical URLs, structured data (Local Business, BlogPosting, Service, FAQ, WebSite), comprehensive SEOHead component (Open Graph, Twitter Cards, geo tags), and local SEO optimization for München.

### Backend Architecture
- **Runtime**: Node.js with Express.js (TypeScript, ES modules).
- **API Design**: RESTful API endpoints for contact form submissions and blog content.
- **Error Handling**: Centralized middleware.
- **Logging**: Custom request logging.
- **Development**: Hot reloading with Vite middleware integration.

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe operations.
- **Database**: Primarily PostgreSQL (configured for Neon Database); however, a robust JSON-based FileStorage system in `./data/` is implemented as the primary persistent storage solution, ensuring data survives container restarts without PostgreSQL dependency. An in-memory storage fallback is also present.
- **Schema**: Shared definitions between frontend and backend.
- **Migrations**: Drizzle Kit for schema management.

### Authentication and Authorization
- Basic user schema present; no active authentication system is currently in use but designed for future admin panel integration.

### Contact Management System
- Handles contact form submissions with shared client/server Zod validation, stores inquiries, and provides an admin endpoint for retrieval.

## External Dependencies

### Core Framework & Libraries
- **@tanstack/react-query**: Server state management.
- **@hookform/resolvers**: Form validation integration.
- **wouter**: Lightweight routing.
- **express**: Web application framework.
- **drizzle-orm**: Type-safe ORM.
- **zod**: Schema validation.
- **react-hook-form**: Forms.

### UI & Styling
- **@radix-ui/***: UI primitives.
- **class-variance-authority**: Component variant management.
- **clsx**: Conditional className utility.
- **tailwindcss**: Utility-first CSS.
- **lucide-react**: Icon library.
- **font-awesome**: Additional icons (via CDN).
- **embla-carousel-react**: Carousel functionality.

### Data & Services
- **DeepSeek API**: For AI content generation (blog posts).
- **Runware API**: For authentic AI image generation (blog posts).
- **@neondatabase/serverless**: Serverless PostgreSQL driver (if PostgreSQL is used).
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used).
- **drizzle-zod**: Drizzle/Zod integration.

### Deployment & Utilities
- **Docker**: For containerization (multi-stage build, Node.js Alpine, PostgreSQL, Nginx).
- **Let's Encrypt**: For SSL certificate automation via Certbot.
- **date-fns**: Date manipulation.
- **nanoid**: Unique ID generation.
- **cmdk**: Command menu component.
- **Google Analytics**: Conditional loading based on consent.
```