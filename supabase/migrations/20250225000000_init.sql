-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- USER ROLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('HR', 'Finance', 'IT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- EMPLOYEES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  leave_days_allocated INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('On Time', 'Late', 'Very Late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(employee_id, date)
);

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- LEAVE RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS leave_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_used INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CHECK (end_date >= start_date)
);

CREATE TRIGGER update_leave_records_updated_at
  BEFORE UPDATE ON leave_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP EQUIPMENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_isp_equipment_updated_at
  BEFORE UPDATE ON isp_equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP INTERNET SPEEDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_internet_speeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mbps INTEGER NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_isp_internet_speeds_updated_at
  BEFORE UPDATE ON isp_internet_speeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP SETUP COSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_setup_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_isp_setup_costs_updated_at
  BEFORE UPDATE ON isp_setup_costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP MANAGED SERVICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_managed_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_isp_managed_services_updated_at
  BEFORE UPDATE ON isp_managed_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP MARKUP SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_markup_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_markup DECIMAL(5,2) NOT NULL DEFAULT 25.00,
  mbps_markup DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  setup_markup DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  managed_services_markup DECIMAL(5,2) NOT NULL DEFAULT 35.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default markup settings
INSERT INTO isp_markup_settings (equipment_markup, mbps_markup, setup_markup, managed_services_markup)
VALUES (25.00, 30.00, 20.00, 35.00)
ON CONFLICT DO NOTHING;

CREATE TRIGGER update_isp_markup_settings_updated_at
  BEFORE UPDATE ON isp_markup_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ISP SETTINGS TABLE (JSONB storage)
-- ============================================================================
CREATE TABLE IF NOT EXISTS isp_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
  internet_speeds JSONB NOT NULL DEFAULT '[]'::jsonb,
  setup_costs JSONB NOT NULL DEFAULT '[]'::jsonb,
  managed_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  markup_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_isp_settings_updated_at
  BEFORE UPDATE ON isp_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('base', 'markup', 'full')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
  notes TEXT
);

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PAYMENT STATUS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  months JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(employee_id, year)
);

CREATE TRIGGER update_payment_status_updated_at
  BEFORE UPDATE ON payment_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BONUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bonuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER update_bonuses_updated_at
  BEFORE UPDATE ON bonuses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_internet_speeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_setup_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_managed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_markup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonuses ENABLE ROW LEVEL SECURITY;

-- User Roles Policies
CREATE POLICY "Enable all access for authenticated users" ON user_roles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Employees Policies
CREATE POLICY "Enable all access for authenticated users" ON employees
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Attendance Policies
CREATE POLICY "Enable all access for authenticated users" ON attendance
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leave Records Policies
CREATE POLICY "Enable all access for authenticated users" ON leave_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Customers Policies
CREATE POLICY "Enable all access for authenticated users" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Equipment Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_equipment
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Internet Speeds Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_internet_speeds
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Setup Costs Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_setup_costs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Managed Services Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_managed_services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Markup Settings Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_markup_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ISP Settings Policies
CREATE POLICY "Enable all access for authenticated users" ON isp_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Invoices Policies
CREATE POLICY "Enable all access for authenticated users" ON invoices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Payment Status Policies
CREATE POLICY "Enable all access for authenticated users" ON payment_status
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Bonuses Policies
CREATE POLICY "Enable all access for authenticated users" ON bonuses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
