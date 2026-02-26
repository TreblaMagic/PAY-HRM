# PAY & HRM

A comprehensive business management platform

> **Note:** This repository represents a limited showcase from a much larger internal platform developed for Briclinks Africa Plc (BTEL), supporting telecom and ISP operations across employee management, payroll, attendance tracking, leave management, ISP service invoicing, and additional operational systems. Due to NDA and client confidentiality agreements, the full production system cannot be publicly shared. This repo highlights selected features and architecture used within the broader solution.

## Overview

PAY & HRM is a full-stack web application designed to streamline operations for telecom and internet service providers. The platform manages the complete employee lifecycle, from hiring to payroll, while also handling customer relationships and service invoicing. Built with modern web technologies, it provides a secure, role-based interface for HR, Finance, and IT departments.

## Features

### Core Modules
- **Authentication & Authorization**
- **Employee Management**
- **Attendance Tracking**
- **Leave Management**
- **Payroll System**
- **ISP Services & Invoicing**
- **Document Management**
- **Dashboard & Analytics**

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

**Built with ❤️ for BTEL**
