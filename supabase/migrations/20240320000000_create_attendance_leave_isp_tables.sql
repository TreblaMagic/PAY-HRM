-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('On Time', 'Late', 'Very Late')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create leave_records table
CREATE TABLE IF NOT EXISTS leave_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_used INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ISP equipment table
CREATE TABLE IF NOT EXISTS isp_equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ISP internet speeds table
CREATE TABLE IF NOT EXISTS isp_internet_speeds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mbps INTEGER NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ISP setup costs table
CREATE TABLE IF NOT EXISTS isp_setup_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ISP managed services table
CREATE TABLE IF NOT EXISTS isp_managed_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ISP markup settings table
CREATE TABLE IF NOT EXISTS isp_markup_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_markup DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    mbps_markup DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    setup_markup DECIMAL(5,2) NOT NULL DEFAULT 20.00,
    managed_services_markup DECIMAL(5,2) NOT NULL DEFAULT 35.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_internet_speeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_setup_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_managed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_markup_settings ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Enable read access for authenticated users" ON attendance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON attendance
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON attendance
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON attendance
    FOR DELETE TO authenticated USING (true);

-- Leave records policies
CREATE POLICY "Enable read access for authenticated users" ON leave_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON leave_records
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON leave_records
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON leave_records
    FOR DELETE TO authenticated USING (true);

-- ISP Equipment policies
CREATE POLICY "Enable read access for authenticated users" ON isp_equipment
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_equipment
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_equipment
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_equipment
    FOR DELETE TO authenticated USING (true);

-- ISP Internet Speeds policies
CREATE POLICY "Enable read access for authenticated users" ON isp_internet_speeds
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_internet_speeds
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_internet_speeds
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_internet_speeds
    FOR DELETE TO authenticated USING (true);

-- ISP Setup Costs policies
CREATE POLICY "Enable read access for authenticated users" ON isp_setup_costs
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_setup_costs
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_setup_costs
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_setup_costs
    FOR DELETE TO authenticated USING (true);

-- ISP Managed Services policies
CREATE POLICY "Enable read access for authenticated users" ON isp_managed_services
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_managed_services
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_managed_services
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_managed_services
    FOR DELETE TO authenticated USING (true);

-- ISP Markup Settings policies
CREATE POLICY "Enable read access for authenticated users" ON isp_markup_settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_markup_settings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_markup_settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_markup_settings
    FOR DELETE TO authenticated USING (true); 