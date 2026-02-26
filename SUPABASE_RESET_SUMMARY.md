# Supabase Reset Summary

This document summarizes all changes made to reset Supabase configuration and start fresh.

## Changes Made

### 1. Archived Old Supabase Files
- **Location**: `supabase/_archive/`
- **Files archived**:
  - Old migrations (3 files)
  - Old `config.toml` with project_id: "ebrijjavqdjndquzerqf"

### 2. Created Fresh Supabase Configuration
- **File**: `supabase/config.toml`
- **Changes**: 
  - New local development configuration
  - Project ID: "bt-el-nexus-link"
  - All services enabled (API, Auth, Storage, Realtime, Studio)
  - Default ports configured

### 3. Created Baseline Migration
- **File**: `supabase/migrations/20250225000000_init.sql`
- **Tables created**:
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

- **Features**:
  - All tables have UUID primary keys
  - Automatic `updated_at` timestamp triggers
  - Row Level Security (RLS) enabled on all tables
  - Policies allowing authenticated users full access
  - Foreign key constraints with CASCADE deletes
  - Check constraints for data validation

### 4. Removed Hardcoded Supabase Values
- **File**: `src/integrations/supabase/client.ts`
- **Changes**: 
  - Removed hardcoded URL: "https://ebrijjavqdjndquzerqf.supabase.co"
  - Removed hardcoded anon key
  - Now re-exports from `@/lib/supabaseClient` (uses env vars)

### 5. Consolidated Supabase Client
- **File**: `src/lib/supabaseClient.ts` (main client)
- **File**: `src/lib/supabase.ts` (re-exports for backward compatibility)
- **Result**: Single source of truth for Supabase client initialization
- **All imports now use**: `@/lib/supabaseClient` or `@/lib/supabase`

### 6. Added Database Scripts
- **File**: `package.json`
- **New scripts**:
  - `npm run db:start` - Start Supabase locally
  - `npm run db:stop` - Stop Supabase
  - `npm run db:reset` - Reset database (drop all, re-run migrations)
  - `npm run db:migrate` - Push migrations to remote
  - `npm run db:status` - Check Supabase status

### 7. Created Environment Variables Template
- **File**: `.env.example` (if not blocked by gitignore)
- **Variables**:
  - `VITE_SUPABASE_URL` - Supabase API URL
  - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
  - Optional: `VITE_SUPABASE_SERVICE_ROLE_KEY`
  - Optional: `DATABASE_URL`

### 8. Created Setup Documentation
- **File**: `SUPABASE_SETUP.md`
- **Contents**: Complete setup guide with commands and troubleshooting

## Files Changed

### Modified Files
1. `supabase/config.toml` - Fresh local config
2. `src/integrations/supabase/client.ts` - Removed hardcoded values
3. `src/lib/supabase.ts` - Re-exports from supabaseClient
4. `package.json` - Added database scripts

### New Files
1. `supabase/migrations/20250225000000_init.sql` - Baseline migration
2. `SUPABASE_SETUP.md` - Setup guide
3. `SUPABASE_RESET_SUMMARY.md` - This file
4. `.env.example` - Environment variables template

### Archived Files
1. `supabase/_archive/config.toml.old` - Old config
2. `supabase/_archive/20240319000000_add_customers_table.sql` - Old migration
3. `supabase/_archive/20240320000000_add_invoice_table.sql` - Old migration
4. `supabase/_archive/20240320000000_create_attendance_leave_isp_tables.sql` - Old migration

## Next Steps

### 1. Install Docker Desktop
- Download from https://www.docker.com/products/docker-desktop
- **Make sure Docker Desktop is running** before proceeding

### 2. Install Supabase CLI (if not already installed)
```bash
npm install supabase --save-dev
```

> **Note:** Supabase CLI doesn't support global npm installation. It's installed as a dev dependency.

### 3. Start Supabase Locally
```bash
npm run db:start
```

### 4. Get Local Credentials
After starting, copy the API URL and anon key from the output.

### 5. Create `.env` File
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-output>
```

### 6. Reset Database
```bash
npm run db:reset
```

This will:
- Drop all existing tables
- Run the new baseline migration
- Set up all tables with RLS policies

### 7. Start the App
```bash
npm run dev
```

## Verification Checklist

After setup, verify:
- [ ] `supabase start` works without errors
- [ ] `supabase db reset` applies migrations successfully
- [ ] App boots without environment variable errors
- [ ] Can sign up/login (if auth is used)
- [ ] Can read/write test data to database

## Notes

- All hardcoded Supabase project references have been removed
- The app now uses environment variables exclusively
- Old migrations are preserved in `supabase/_archive/` for reference
- Database schema is now defined in a single baseline migration
- All tables have RLS enabled with policies for authenticated users

## Assumptions Made

1. **RLS Policies**: All tables use permissive policies (authenticated users have full access). You may want to tighten these for production.

2. **Database Column Naming**: Database uses snake_case (`employee_id`), but Supabase automatically converts to camelCase (`employeeId`) in JavaScript responses. Queries can use either format.

3. **Default Values**: ISP markup settings have default values (25%, 30%, 20%, 35%) that are inserted on migration.

4. **Auth Integration**: The `user_roles` table references `auth.users(id)` which is provided by Supabase Auth.

## Troubleshooting

If you encounter issues:

1. **Port conflicts**: Stop Supabase first with `npm run db:stop`
2. **Migration errors**: Reset with `npm run db:reset`
3. **Environment variables**: Ensure `.env` file exists and restart dev server
4. **Type errors**: Database types may need regeneration after schema changes

For more details, see `SUPABASE_SETUP.md`.
