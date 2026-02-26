# Supabase Setup Guide

This document explains how to set up and use Supabase locally for this project.

## Prerequisites

1. **Install Docker Desktop:**
   - Download and install from https://www.docker.com/products/docker-desktop
   - Make sure Docker Desktop is **running** before using Supabase CLI
   - Supabase CLI uses Docker to run local services (Postgres, Auth, etc.)

2. **Install Supabase CLI as a dev dependency:**
   ```bash
   npm install supabase --save-dev
   ```
   
   > **Note:** Supabase CLI doesn't support global npm installation. It's installed as a dev dependency and accessed via npm scripts or `npx`.

3. **Verify installation:**
   ```bash
   npx supabase --version
   ```
   
   Or use the npm scripts (they'll work automatically):
   ```bash
   npm run db:status
   ```

## Initial Setup

1. **Start Supabase locally:**
   ```bash
   npm run db:start
   ```
   
   This will start all Supabase services locally (Postgres, Auth, Storage, etc.)

2. **Get your local credentials:**
   After starting, you'll see output like:
   ```
   API URL: http://127.0.0.1:54321
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Create `.env` file:**
   Copy the values from the `supabase start` output and create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=your-anon-key-from-output
   ```

4. **Reset the database (applies migrations):**
   ```bash
   npm run db:reset
   ```
   
   This will:
   - Drop all tables
   - Re-run all migrations from scratch
   - Seed the database (if seed.sql exists)

## Available Commands

- `npm run db:start` - Start Supabase locally
- `npm run db:stop` - Stop Supabase
- `npm run db:reset` - Reset database (drop all, re-run migrations)
- `npm run db:migrate` - Push migrations to remote Supabase (if linked)
- `npm run db:status` - Check status of local Supabase

## Database Schema

The initial migration (`20250225000000_init.sql`) creates the following tables:

- `user_roles` - User role assignments
- `employees` - Employee records
- `attendance` - Attendance tracking
- `leave_records` - Leave requests
- `customers` - Customer information
- `invoices` - Invoice records
- `isp_equipment` - ISP equipment catalog
- `isp_internet_speeds` - Internet speed packages
- `isp_setup_costs` - Setup cost items
- `isp_managed_services` - Managed service offerings
- `isp_markup_settings` - Markup percentage settings
- `isp_settings` - JSONB storage for ISP settings
- `payment_status` - Employee payment status tracking
- `bonuses` - Employee bonus records

All tables have:
- Row Level Security (RLS) enabled
- Policies allowing authenticated users full access
- Automatic `updated_at` timestamp triggers

## Environment Variables

Required:
- `VITE_SUPABASE_URL` - Supabase API URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional:
- `VITE_SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)
- `DATABASE_URL` - Direct Postgres connection string

## Troubleshooting

### Docker not running
If you see errors like "failed to inspect container health" or "cannot find dockerDesktopLinuxEngine":
- Make sure **Docker Desktop is installed and running**
- Start Docker Desktop and wait for it to fully start
- Then try again: `npm run db:start`

### Supabase CLI not found
If you get "command not found" errors, make sure Supabase is installed:
```bash
npm install supabase --save-dev
```

### Port already in use
If you get port conflicts, stop Supabase first:
```bash
npm run db:stop
```

### Migration errors
If migrations fail, reset the database:
```bash
npm run db:reset
```

### Environment variables not loading
Make sure your `.env` file is in the root directory and restart your dev server:
```bash
npm run dev
```

### Using Supabase CLI directly
If you need to run Supabase commands directly (outside npm scripts), use `npx`:
```bash
npx supabase start
npx supabase status
npx supabase db reset
```

## Production Setup

For production, you'll need to:

1. Create a Supabase project at https://supabase.com
2. Link your local project:
   ```bash
   npx supabase link --project-ref your-project-ref
   ```
3. Push migrations:
   ```bash
   npm run db:migrate
   ```
4. Update `.env` with production credentials

## Notes

- Old migrations and config have been archived to `supabase/_archive/`
- All Supabase client initialization is centralized in `src/lib/supabaseClient.ts`
- The app uses environment variables for all Supabase configuration (no hardcoded values)
