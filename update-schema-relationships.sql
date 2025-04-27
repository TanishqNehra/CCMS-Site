-- Make sure consignments table exists
CREATE TABLE IF NOT EXISTS consignments (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    type TEXT NOT NULL,
    weight TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    date TEXT NOT NULL,
    truck_id TEXT REFERENCES trucks(id),
    contact TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make sure trucks table exists
CREATE TABLE IF NOT EXISTS trucks (
    id TEXT PRIMARY KEY,
    driver TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    last_maintenance TEXT NOT NULL,
    assigned_consignment_id TEXT REFERENCES consignments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add truck_id column to consignments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'truck_id'
    ) THEN
        ALTER TABLE consignments ADD COLUMN truck_id TEXT REFERENCES trucks(id);
    END IF;
END $$;

-- Add assigned_consignment_id column to trucks table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trucks' AND column_name = 'assigned_consignment_id'
    ) THEN
        ALTER TABLE trucks ADD COLUMN assigned_consignment_id TEXT REFERENCES consignments(id);
    END IF;
END $$;

-- Add contact and email columns to consignments table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'contact'
    ) THEN
        ALTER TABLE consignments ADD COLUMN contact TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'email'
    ) THEN
        ALTER TABLE consignments ADD COLUMN email TEXT;
    END IF;
END $$;

-- Add timestamp columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE consignments ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consignments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trucks' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE trucks ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trucks' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE trucks ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
