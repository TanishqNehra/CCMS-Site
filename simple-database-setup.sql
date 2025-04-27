-- Create simple tables with minimal columns to avoid schema cache issues

-- Drop tables if they exist
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS consignments;

-- Create consignments table with minimal columns
CREATE TABLE consignments (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    type TEXT NOT NULL,
    weight TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    date TEXT NOT NULL
);

-- Create trucks table with minimal columns
CREATE TABLE trucks (
    id TEXT PRIMARY KEY,
    driver TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    last_maintenance TEXT NOT NULL
);

-- Insert some sample data
INSERT INTO consignments (id, customer, type, weight, destination, status, date)
VALUES 
('CCM1234567', 'John Doe', 'Parcel', '2kg', 'Chicago, IL', 'pending', 'Apr 11, 2023'),
('CCM7654321', 'Jane Smith', 'Package', '5kg', 'Los Angeles, CA', 'pending', 'Apr 12, 2023'),
('CCM9876543', 'Robert Johnson', 'Freight', '50kg', 'Miami, FL', 'delivered', 'Apr 10, 2023');

INSERT INTO trucks (id, driver, type, capacity, location, status, last_maintenance)
VALUES 
('TRK-001', 'Michael Johnson', 'Delivery Van', '1000kg', 'New York, NY', 'available', 'Apr 05, 2023'),
('TRK-002', 'Sarah Davis', 'Box Truck', '3000kg', 'Chicago, IL', 'available', 'Mar 28, 2023'),
('TRK-003', 'Robert Wilson', 'Semi-Trailer', '15000kg', 'Los Angeles, CA', 'available', 'Apr 02, 2023');
