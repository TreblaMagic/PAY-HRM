-- Create markup settings table
CREATE TABLE IF NOT EXISTS isp_markup_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_markup DECIMAL(5,2) NOT NULL DEFAULT 0,
  mbps_markup DECIMAL(5,2) NOT NULL DEFAULT 0,
  setup_markup DECIMAL(5,2) NOT NULL DEFAULT 0,
  managed_services_markup DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default markup settings
INSERT INTO isp_markup_settings (equipment_markup, mbps_markup, setup_markup, managed_services_markup)
VALUES (10.00, 15.00, 20.00, 25.00)
ON CONFLICT DO NOTHING;

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
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

-- Add RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = customer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 