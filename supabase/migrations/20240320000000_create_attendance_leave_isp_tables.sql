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

-- Create isp_settings table
CREATE TABLE IF NOT EXISTS isp_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment JSONB NOT NULL,
    internet_speeds JSONB NOT NULL,
    markup_settings JSONB NOT NULL,
    setup_costs JSONB NOT NULL,
    managed_services JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE isp_settings ENABLE ROW LEVEL SECURITY;

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

-- ISP settings policies
CREATE POLICY "Enable read access for authenticated users" ON isp_settings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON isp_settings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON isp_settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON isp_settings
    FOR DELETE TO authenticated USING (true); 