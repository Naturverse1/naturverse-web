# Contributing to The Naturverse

Welcome to The Naturverse educational platform! This guide will help you get started with development.

## Prerequisites

- Node.js 18+ or 20+ 
- npm (comes with Node.js)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/naturverse-explore.git
   cd naturverse-explore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the values in `.env` with your actual configuration.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Building

Build for production:
```bash
npm run build
```

## Preview

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas
- `dist/` - Built assets (generated)

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `DATABASE_URL` - Database connection string (optional)
- Object storage variables for file uploads

## Deployment

The project is configured for static deployment on Vercel with automatic builds from the main branch.