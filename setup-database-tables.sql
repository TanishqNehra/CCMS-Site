-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS consignments;

-- Create consignments table first (without foreign key reference)
CREATE TABLE consignments (
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
CREATE TABLE trucks (
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

-- Now add foreign key constraints
ALTER TABLE consignments 
ADD CONSTRAINT fk_truck_id 
FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE SET NULL;

ALTER TABLE trucks 
ADD CONSTRAINT fk_assigned_consignment_id 
FOREIGN KEY (assigned_consignment_id) REFERENCES consignments(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_consignments_truck_id ON consignments(truck_id);
CREATE INDEX idx_trucks_assigned_consignment_id ON trucks(assigned_consignment_id);
