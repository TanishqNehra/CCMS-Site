-- First, let's check if the tables exist and create them if they don't
CREATE TABLE IF NOT EXISTS consignments (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    type TEXT NOT NULL,
    weight TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trucks (
    id TEXT PRIMARY KEY,
    driver TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    last_maintenance TEXT NOT NULL
);

-- Insert sample data if tables are empty
INSERT INTO consignments (id, customer, type, weight, destination, status, date)
SELECT 'CCM1234567', 'John Doe', 'Parcel', '2kg', 'Chicago, IL', 'pending', 'Apr 11, 2023'
WHERE NOT EXISTS (SELECT 1 FROM consignments LIMIT 1);

INSERT INTO consignments (id, customer, type, weight, destination, status, date)
SELECT 'CCM7654321', 'Jane Smith', 'Package', '5kg', 'Los Angeles, CA', 'pending', 'Apr 12, 2023'
WHERE NOT EXISTS (SELECT 1 FROM consignments LIMIT 1);

INSERT INTO trucks (id, driver, type, capacity, location, status, last_maintenance)
SELECT 'TRK-001', 'Michael Johnson', 'Delivery Van', '1000kg', 'New York, NY', 'available', 'Apr 05, 2023'
WHERE NOT EXISTS (SELECT 1 FROM trucks LIMIT 1);

INSERT INTO trucks (id, driver, type, capacity, location, status, last_maintenance)
SELECT 'TRK-002', 'Sarah Davis', 'Box Truck', '3000kg', 'Chicago, IL', 'available', 'Mar 28, 2023'
WHERE NOT EXISTS (SELECT 1 FROM trucks LIMIT 1);
