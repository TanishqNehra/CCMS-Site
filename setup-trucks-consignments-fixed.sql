-- Create trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id TEXT PRIMARY KEY,
  driver TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  last_maintenance TEXT NOT NULL,
  assigned_consignment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consignments table
CREATE TABLE IF NOT EXISTS consignments (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  type TEXT NOT NULL,
  weight TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  date TEXT NOT NULL,
  truck_id TEXT,
  contact TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (truck_id) REFERENCES trucks(id)
);

-- Add foreign key constraint to trucks table
ALTER TABLE trucks 
ADD CONSTRAINT fk_assigned_consignment 
FOREIGN KEY (assigned_consignment_id) 
REFERENCES consignments(id);

-- Create RLS policies for trucks
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to trucks"
  ON trucks FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert trucks"
  ON trucks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update trucks"
  ON trucks FOR UPDATE
  USING (true);

-- Create RLS policies for consignments
ALTER TABLE consignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to consignments"
  ON consignments FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert consignments"
  ON consignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update consignments"
  ON consignments FOR UPDATE
  USING (true);

-- Insert sample trucks
INSERT INTO trucks (id, driver, type, capacity, location, status, last_maintenance)
VALUES
  ('TRK-001', 'John Doe', 'Heavy Duty', '20 tons', 'New York', 'available', '2023-01-15'),
  ('TRK-002', 'Jane Smith', 'Light Duty', '5 tons', 'Los Angeles', 'available', '2023-02-20'),
  ('TRK-003', 'Mike Johnson', 'Medium Duty', '10 tons', 'Chicago', 'available', '2023-03-10'),
  ('TRK-004', 'Sarah Williams', 'Heavy Duty', '25 tons', 'Houston', 'available', '2023-01-05'),
  ('TRK-005', 'David Brown', 'Light Duty', '3 tons', 'Phoenix', 'available', '2023-02-25')
ON CONFLICT (id) DO NOTHING;

-- Insert sample consignments
INSERT INTO consignments (id, customer, type, weight, destination, status, date, contact, email)
VALUES
  ('CCM1001', 'Acme Corp', 'Electronics', '500 kg', 'Boston', 'pending', '2023-04-01', '555-1234', 'contact@acme.com'),
  ('CCM1002', 'Global Industries', 'Machinery', '1200 kg', 'Seattle', 'pending', '2023-04-02', '555-5678', 'info@global.com'),
  ('CCM1003', 'Tech Solutions', 'Computers', '300 kg', 'Miami', 'pending', '2023-04-03', '555-9012', 'support@techsol.com'),
  ('CCM1004', 'Food Distributors', 'Perishables', '800 kg', 'Denver', 'pending', '2023-04-04', '555-3456', 'orders@fooddist.com'),
  ('CCM1005', 'Fashion Outlet', 'Clothing', '400 kg', 'Atlanta', 'pending', '2023-04-05', '555-7890', 'sales@fashion.com')
ON CONFLICT (id) DO NOTHING;
