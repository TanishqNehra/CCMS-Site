-- Create consignments table
CREATE TABLE IF NOT EXISTS consignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer TEXT NOT NULL,
  type TEXT NOT NULL,
  weight TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  date TEXT NOT NULL,
  truckId UUID REFERENCES trucks(id),
  contact TEXT,
  email TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  lastMaintenance TEXT NOT NULL,
  assignedConsignmentId UUID REFERENCES consignments(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE consignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

-- Create policies for consignments
CREATE POLICY "Allow public read access to consignments" 
  ON consignments FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to consignments" 
  ON consignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to consignments" 
  ON consignments FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from consignments" 
  ON consignments FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for trucks
CREATE POLICY "Allow public read access to trucks" 
  ON trucks FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to trucks" 
  ON trucks FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to trucks" 
  ON trucks FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from trucks" 
  ON trucks FOR DELETE USING (auth.role() = 'authenticated');
