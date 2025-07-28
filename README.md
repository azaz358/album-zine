# Album Zine

A collaborative platform where music lovers share their favorite albums and create beautiful, personalized pages for each recommendation.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app is configured for deployment on Vercel with automatic GitHub integration.

### Environment Variables

For production deployment, the following environment variables are required:

- `DATABASE_URL` - PostgreSQL connection string (automatically provided by Vercel Postgres)

### Vercel Postgres Integration

The app uses Vercel Postgres for production database. The connection details are automatically injected by Vercel when you add the Postgres integration to your project.

## Database Schema

The app uses Prisma ORM with the following models:

- **Submission**: Stores album recommendations with user details and page screenshots

## Features

- Album submission form with validation
- Interactive page editor with drag-and-drop functionality
- Image upload and manipulation
- Text element creation and editing
- Page screenshot capture for submissions
- Responsive design with mobile support
