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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  manager TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  established_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  branch_id INTEGER REFERENCES branches(id),
  hire_date TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'active',
  salary NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for consignments
ALTER TABLE consignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public consignments are viewable by everyone" ON consignments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert consignments" ON consignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update consignments" ON consignments FOR UPDATE USING (true);

-- Create RLS policies for trucks
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public trucks are viewable by everyone" ON trucks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert trucks" ON trucks FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update trucks" ON trucks FOR UPDATE USING (true);

-- Create RLS policies for branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public branches are viewable by everyone" ON branches FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert branches" ON branches FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update branches" ON branches FOR UPDATE USING (true);

-- Create RLS policies for employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public employees are viewable by everyone" ON employees FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert employees" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update employees" ON employees FOR UPDATE USING (true);

-- Create RLS policies for support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public support_tickets are viewable by everyone" ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert support_tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update support_tickets" ON support_tickets FOR UPDATE USING (true);

-- Insert sample data for branches
INSERT INTO branches (name, location, manager, contact, email, established_date, status)
VALUES
  ('Main Branch', 'New York', 'John Smith', '+1-555-123-4567', 'john.smith@courier.com', '2020-01-15', 'active'),
  ('West Coast Hub', 'Los Angeles', 'Emily Johnson', '+1-555-987-6543', 'emily.johnson@courier.com', '2020-03-22', 'active'),
  ('Midwest Center', 'Chicago', 'Michael Brown', '+1-555-456-7890', 'michael.brown@courier.com', '2020-06-10', 'active'),
  ('Southern Operations', 'Dallas', 'Sarah Davis', '+1-555-789-0123', 'sarah.davis@courier.com', '2021-02-05', 'active'),
  ('East Coast Hub', 'Boston', 'David Wilson', '+1-555-234-5678', 'david.wilson@courier.com', '2021-05-18', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for employees
INSERT INTO employees (name, position, branch_id, hire_date, contact, email, status, salary)
VALUES
  ('Robert Anderson', 'Branch Manager', 1, '2020-01-20', '+1-555-111-2222', 'robert.anderson@courier.com', 'active', 75000.00),
  ('Jennifer Martinez', 'Logistics Coordinator', 1, '2020-02-15', '+1-555-222-3333', 'jennifer.martinez@courier.com', 'active', 58000.00),
  ('Thomas Clark', 'Driver', 1, '2020-03-10', '+1-555-333-4444', 'thomas.clark@courier.com', 'active', 45000.00),
  ('Lisa Rodriguez', 'Customer Service', 1, '2020-04-05', '+1-555-444-5555', 'lisa.rodriguez@courier.com', 'active', 42000.00),
  ('Kevin Lewis', 'Warehouse Supervisor', 2, '2020-05-12', '+1-555-555-6666', 'kevin.lewis@courier.com', 'active', 52000.00),
  ('Amanda Walker', 'Driver', 2, '2020-06-18', '+1-555-666-7777', 'amanda.walker@courier.com', 'active', 45000.00),
  ('Brian Hall', 'Logistics Coordinator', 3, '2020-07-22', '+1-555-777-8888', 'brian.hall@courier.com', 'active', 58000.00),
  ('Michelle Young', 'Customer Service', 3, '2020-08-30', '+1-555-888-9999', 'michelle.young@courier.com', 'active', 42000.00),
  ('Christopher Allen', 'Driver', 4, '2020-09-15', '+1-555-999-0000', 'christopher.allen@courier.com', 'active', 45000.00),
  ('Stephanie King', 'Warehouse Supervisor', 5, '2020-10-20', '+1-555-000-1111', 'stephanie.king@courier.com', 'active', 52000.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for support_tickets
INSERT INTO support_tickets (customer_name, customer_email, subject, description, status, priority, assigned_to)
VALUES
  ('James Wilson', 'james.wilson@example.com', 'Delayed Delivery', 'My package was supposed to arrive yesterday but has not been delivered yet.', 'open', 'high', 'Lisa Rodriguez'),
  ('Mary Johnson', 'mary.johnson@example.com', 'Wrong Address', 'My package was delivered to the wrong address.', 'in-progress', 'medium', 'Lisa Rodriguez'),
  ('Robert Brown', 'robert.brown@example.com', 'Damaged Package', 'My package arrived damaged.', 'open', 'high', NULL),
  ('Patricia Davis', 'patricia.davis@example.com', 'Missing Item', 'One item from my order is missing.', 'closed', 'medium', 'Michelle Young'),
  ('John Miller', 'john.miller@example.com', 'Billing Question', 'I was charged twice for my delivery.', 'open', 'low', NULL)
ON CONFLICT (id) DO NOTHING;
