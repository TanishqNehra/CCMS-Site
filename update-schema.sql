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

-- Add updated_at column to both tables if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE consignments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trucks' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE trucks ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add created_at column to both tables if they don't exist
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
        WHERE table_name = 'trucks' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE trucks ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
