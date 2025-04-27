-- Add truck_id column to consignments table if it doesn't exist
ALTER TABLE consignments ADD COLUMN IF NOT EXISTS truck_id TEXT;

-- Add assigned_consignment_id column to trucks table if it doesn't exist
ALTER TABLE trucks ADD COLUMN IF NOT EXISTS assigned_consignment_id TEXT;
