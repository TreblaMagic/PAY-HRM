# PAY & HRM

A comprehensive business management platform

> **Note:** This repository represents a limited showcase from a much larger internal platform developed for Briclinks Africa Plc (BTEL), supporting telecom and ISP operations across employee management, payroll, attendance tracking, leave management, ISP service invoicing, and additional operational systems. Due to NDA and client confidentiality agreements, the full production system cannot be publicly shared. This repo highlights selected features and architecture used within the broader solution.

## Overview

PAY & HRM is a full-stack web application designed to streamline operations for telecom and internet service providers. The platform manages the complete employee lifecycle, from hiring to payroll, while also handling customer relationships and service invoicing. Built with modern web technologies, it provides a secure, role-based interface for HR, Finance, and IT departments.

## Features

### Core Modules

- **Authentication & Authorization**
  - Email/password authentication via Supabase Auth
  - Role-based access control (HR, Finance, IT)
  - Protected routes with permission checks
  - User profile management

- **Employee Management**
  - Complete employee CRUD operations
  - Employee profiles with contact information
  - Department and position tracking
  - Hire date and salary management
  - Leave days allocation

- **Attendance Tracking**
  - Daily attendance recording (On Time, Late, Very Late)
  - Date range filtering and reporting
  - PDF report generation
  - Punctuality score calculation

- **Leave Management**
  - Leave request submission and approval workflow
  - Leave balance tracking
  - Leave history with status (Pending, Approved, Rejected)
  - Automatic leave days deduction

- **Payroll System**
  - Salary management per employee
  - Payment status tracking (monthly/yearly)
  - Bonus allocation and tracking
  - Payroll summary and reporting

- **ISP Services & Invoicing**
  - Equipment catalog management
  - Internet speed packages configuration
  - Setup costs and managed services pricing
  - Markup settings for profit calculation
  - Invoice generation (base, markup, or combined)
  - Invoice status management (pending, paid, cancelled)
  - PDF invoice export

- **Document Management**
  - Document upload and storage
  - Document categorization and filtering
  - File management interface

- **Dashboard & Analytics**
  - Real-time employee statistics
  - Attendance overview
  - Recent activity tracking
  - Quick access to key functions

## Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite 5.4** - Build tool and dev server
- **React Router DOM 6.26** - Client-side routing
- **TanStack Query 5.56** - Server state management
- **React Hook Form 7.53** - Form handling
- **Zod 3.23** - Schema validation

### UI Components & Styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts 2.12** - Data visualization
- **date-fns 3.6** - Date manipulation

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database (local via Docker)
  - Supabase Auth for authentication
  - Row Level Security (RLS) policies
  - REST API (auto-generated)
- **Supabase CLI 2.76** - Local development tooling

### PDF Generation
- **jsPDF 2.5** - PDF creation
- **html2canvas 1.4** - HTML to image conversion
- **jspdf-autotable 5.0** - Table rendering in PDFs

### Development Tools
- **Docker Desktop** - Required for local Supabase
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Pages   │  │Components│  │ Services │  │ Contexts │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                          │                                  │
│                    ┌─────▼─────┐                            │
│                    │ Supabase  │                            │
│                    │  Client   │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Supabase (Local via Docker)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │  Supabase    │  │   Storage    │       │
│  │   Database   │  │    Auth      │  │   (S3-like)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                                                   │
│         │ RLS Policies                                      │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────┐            │
│  │  Tables: employees, attendance, invoices,   │            │
│  │  customers, bonuses, leave_records, etc.    │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Code Organization

- **Pages** (`src/pages/`) - Top-level route components
- **Components** (`src/components/`) - Reusable UI components organized by feature
- **Services** (`src/services/`) - Business logic and API interactions
- **Contexts** (`src/contexts/`) - React context providers (Auth, Role)
- **Types** (`src/types/`) - TypeScript type definitions
- **Utils** (`src/utils/`) - Utility functions (formatters, PDF generation)
- **Lib** (`src/lib/`) - Shared libraries (Supabase client)

### Data Flow

1. **User Action** → Component triggers service function
2. **Service Layer** → Converts data format (camelCase ↔ snake_case)
3. **Supabase Client** → Sends request to Supabase API
4. **Supabase** → Validates RLS policies, executes query
5. **Database** → Returns data
6. **Response** → Flows back through service → component → UI update

### Security

- **Row Level Security (RLS)** enabled on all tables
- **Role-based policies** restrict access by user role (IT, HR, Finance)
- **Authentication** required for all protected routes
- **Environment variables** for sensitive configuration

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm (or compatible package manager)
- **Docker Desktop** - Must be installed and running
- **Git** - For cloning the repository

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bt-el-nexus-link
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Docker Desktop:**
   - Ensure Docker Desktop is installed and running
   - Wait for Docker to fully start before proceeding

4. **Start Supabase locally:**
   ```bash
   npm run db:start
   ```
   
   This will start all Supabase services (PostgreSQL, Auth, Storage, etc.) in Docker containers.
   
   **Important:** Copy the output values for `API URL` and `anon key` - you'll need them for the `.env` file.

5. **Create `.env` file:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start-output
   ```
   
   Replace `your-anon-key-from-supabase-start-output` with the actual anon key from step 4.

6. **Apply database migrations:**
   ```bash
   npm run db:reset
   ```
   
   This will:
   - Drop all existing tables
   - Run all migrations from `supabase/migrations/`
   - Create the complete database schema

7. **Create a test user (optional):**
   
   You can create a test user using the Supabase Admin API. See `ADDING_USERS.md` for detailed instructions, or use the provided script:
   ```bash
   node create_user_via_api.js
   ```
   
   Make sure to add `VITE_SUPABASE_SERVICE_ROLE_KEY` to your `.env` file first (get it from `npm run db:start` output).

8. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080`

### Verification

After starting, verify the setup:

1. ✅ App loads without console errors
2. ✅ Can navigate to login page
3. ✅ Can sign in with test user credentials
4. ✅ Dashboard displays (may be empty initially)
5. ✅ Can access protected routes based on user role

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase API URL (local or production) | `http://127.0.0.1:54321` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Optional Variables

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) | Admin operations, user creation scripts |
| `DATABASE_URL` | Direct PostgreSQL connection string | Direct database access (rarely needed) |

### Getting Local Values

After running `npm run db:start`, you'll see output like:

```
API URL: http://127.0.0.1:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Secret: sb_secret_...
```

- Use the **API URL** for `VITE_SUPABASE_URL`
- Use the **anon key** for `VITE_SUPABASE_ANON_KEY`
- Use the **Secret** for `VITE_SUPABASE_SERVICE_ROLE_KEY` (if needed)

## Database Setup

### Migrations

Database schema is managed through migration files in `supabase/migrations/`:

- `20250225000000_init.sql` - Initial schema (all tables, RLS policies, triggers)
- `20250226000000_add_phone_to_employees.sql` - Adds phone column to employees

### Database Schema

The application uses the following main tables:

- **`user_roles`** - User role assignments (IT, HR, Finance)
- **`employees`** - Employee records
- **`attendance`** - Daily attendance tracking
- **`leave_records`** - Leave requests and approvals
- **`customers`** - Customer information
- **`invoices`** - Invoice records
- **`isp_equipment`** - ISP equipment catalog
- **`isp_internet_speeds`** - Internet speed packages
- **`isp_setup_costs`** - Setup cost items
- **`isp_managed_services`** - Managed service offerings
- **`isp_markup_settings`** - Markup percentage configuration
- **`isp_settings`** - JSONB storage for ISP settings
- **`payment_status`** - Employee payment tracking
- **`bonuses`** - Employee bonus records

All tables include:
- Row Level Security (RLS) enabled
- Role-based access policies
- Automatic `updated_at` timestamp triggers
- UUID primary keys

### Database Commands

```bash
# Start Supabase (starts all services)
npm run db:start

# Stop Supabase (stops all services)
npm run db:stop

# Reset database (drops all tables, re-runs migrations)
npm run db:reset

# Push migrations to remote Supabase (if linked)
npm run db:migrate

# Check Supabase status
npm run db:status
```

### Accessing Supabase Studio

After starting Supabase, access the local Studio UI at:
```
http://127.0.0.1:54323
```

This provides a visual interface to:
- Browse tables and data
- Run SQL queries
- View API documentation
- Manage authentication

## Running Tests

Currently, no automated tests are configured. To add tests:

1. Install a testing framework (e.g., Vitest, Jest)
2. Create test files following the pattern `*.test.ts` or `*.spec.ts`
3. Add test scripts to `package.json`

## Deployment

### Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Vercel, Netlify, or similar hosting account (for frontend)

### Step 1: Set Up Production Supabase

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project reference ID

2. **Link local project to remote:**
   ```bash
   npx supabase link --project-ref your-project-ref
   ```

3. **Push migrations:**
   ```bash
   npm run db:migrate
   ```
   
   This applies all migrations from `supabase/migrations/` to production.

4. **Get production credentials:**
   - Supabase Dashboard → Settings → API
   - Copy `Project URL` and `anon public` key

### Step 2: Deploy Frontend

#### Option A: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel Dashboard:**
   - `VITE_SUPABASE_URL` - Your production Supabase URL
   - `VITE_SUPABASE_ANON_KEY` - Your production anon key

4. **Redeploy** after setting environment variables

#### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Set environment variables in Netlify Dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 3: Migrate Data (Optional)

If you have local data to migrate:

1. **Export local data:**
   ```bash
   npx supabase db dump --local -f local_data.sql
   ```

2. **Import to production:**
   ```bash
   psql "postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" -f local_data.sql
   ```
   
   Get the connection string from: Supabase Dashboard → Settings → Database → Connection string

### Step 4: Update Environment Variables

Ensure your production frontend has:
- `VITE_SUPABASE_URL` - Production Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Production anon key

**Note:** Never commit `.env` files with production keys to version control.

## Folder Structure

```
PAY & HRM/
├── public/                 # Static assets
│   ├── Logo.png
│   └── uploads/            # User-uploaded files
├── src/
│   ├── components/         # React components
│   │   ├── attendance/    # Attendance-related components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── documents/     # Document management UI
│   │   ├── employees/     # Employee management UI
│   │   ├── isp/           # ISP service components
│   │   ├── layout/        # Layout components (Sidebar, DashboardLayout)
│   │   ├── leave/         # Leave management UI
│   │   ├── payroll/       # Payroll components
│   │   ├── roles/         # Role-based routing
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── contexts/           # React context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── RoleContext.tsx     # User role state
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/      # Supabase type definitions
│   ├── lib/               # Shared libraries
│   │   ├── supabaseClient.ts  # Supabase client initialization
│   │   └── utils.ts       # Utility functions
│   ├── pages/             # Page components (routes)
│   │   ├── Attendance.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── ISP.tsx
│   │   ├── LeaveManagement.tsx
│   │   ├── Payroll.tsx
│   │   └── ...
│   ├── services/          # Business logic & API calls
│   │   ├── attendanceService.ts
│   │   ├── employeeService.ts
│   │   ├── isp/           # ISP-related services
│   │   ├── leaveService.ts
│   │   ├── payrollService.ts
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   │   ├── employee.ts
│   │   ├── isp.ts
│   │   ├── payroll.ts
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── formatters.ts  # Currency, date formatting
│   │   └── pdfGenerator.ts # PDF generation
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── supabase/
│   ├── migrations/        # Database migration files
│   │   ├── 20250225000000_init.sql
│   │   └── 20250226000000_add_phone_to_employees.sql
│   ├── config.toml        # Supabase local configuration
│   └── _archive/          # Archived migrations/config
├── .env                   # Environment variables (not in git)
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── README.md              # This file
```

### Key Directories

- **`src/components/`** - Reusable UI components organized by feature domain
- **`src/services/`** - All API interactions and business logic
- **`src/pages/`** - Top-level route components
- **`src/types/`** - TypeScript interfaces matching database schema
- **`supabase/migrations/`** - Database schema version control

## Contribution Guide

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes:**
   - Follow existing code style
   - Use TypeScript for type safety
   - Add comments for complex logic

3. **Test locally:**
   - Ensure `npm run dev` works
   - Test affected features manually
   - Check for console errors

4. **Create database migrations (if needed):**
   ```bash
   # Create a new migration file
   # Format: YYYYMMDDHHMMSS_description.sql
   # Example: 20250227000000_add_new_column.sql
   ```

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use **TypeScript** for all new code
- Follow **React Hooks** best practices
- Use **camelCase** for TypeScript/JavaScript
- Use **snake_case** for database columns (converted in services)
- Use **PascalCase** for component names
- Use **kebab-case** for file names (components use PascalCase)

### Adding New Features

1. **Create types** in `src/types/`
2. **Create service functions** in `src/services/`
3. **Create components** in `src/components/[feature]/`
4. **Create page** in `src/pages/` (if new route)
5. **Add route** in `src/App.tsx`
6. **Update RLS policies** if new tables are added

### Database Changes

When modifying the database schema:

1. **Create a migration file:**
   ```bash
   # In supabase/migrations/
   # Name: YYYYMMDDHHMMSS_description.sql
   ```

2. **Test migration locally:**
   ```bash
   npm run db:reset
   ```

3. **Update TypeScript types** if schema changes

## Troubleshooting

### Common Issues

**Docker not running:**
- Error: `failed to inspect container health`
- Solution: Start Docker Desktop and wait for it to fully initialize

**Port already in use:**
- Error: `port 54321 is already in use`
- Solution: Stop existing Supabase instance: `npm run db:stop`

**Environment variables not loading:**
- Ensure `.env` file is in the root directory
- Restart the dev server after changing `.env`
- Check variable names start with `VITE_` for Vite

**Migration errors:**
- Reset the database: `npm run db:reset`
- Check migration file syntax
- Ensure migrations are in chronological order

**Authentication errors:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase is running: `npm run db:status`
- Ensure user exists in `auth.users` and `user_roles` tables

**RLS policy errors:**
- Check user role is set in `user_roles` table
- Verify RLS policies allow the operation
- Use service role key for admin operations (development only)

## Additional Resources

- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase CLI Docs:** [https://supabase.com/docs/reference/cli](https://supabase.com/docs/reference/cli)
- **React Documentation:** [https://react.dev](https://react.dev)
- **Vite Documentation:** [https://vitejs.dev](https://vitejs.dev)
- **shadcn/ui Components:** [https://ui.shadcn.com](https://ui.shadcn.com)

## License

[Add your license here]

---

**Built with ❤️ for BTEL**
