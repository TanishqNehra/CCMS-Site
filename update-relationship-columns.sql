-- Add truck_id column to consignments table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consignments' AND column_name = 'truck_id'
    ) THEN
        ALTER TABLE consignments ADD COLUMN truck_id TEXT;
    END IF;
END $$;

-- Add assigned_consignment_id column to trucks table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trucks' AND column_name = 'assigned_consignment_id'
    ) THEN
        ALTER TABLE trucks ADD COLUMN assigned_consignment_id TEXT;
    END IF;
END $$;

-- Create a function to allocate a truck to a consignment
CREATE OR REPLACE FUNCTION allocate_truck_to_consignment(
    p_consignment_id TEXT,
    p_truck_id TEXT
) RETURNS VOID AS $$
BEGIN
    -- Update the consignment
    UPDATE consignments
    SET 
        status = 'in-transit',
        truck_id = p_truck_id
    WHERE id = p_consignment_id;
    
    -- Update the truck
    UPDATE trucks
    SET 
        status = 'in-transit',
        assigned_consignment_id = p_consignment_id
    WHERE id = p_truck_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to mark a consignment as delivered
CREATE OR REPLACE FUNCTION mark_consignment_delivered(
    p_consignment_id TEXT
) RETURNS VOID AS $$
DECLARE
    v_truck_id TEXT;
BEGIN
    -- Get the truck_id from the consignment
    SELECT truck_id INTO v_truck_id
    FROM consignments
    WHERE id = p_consignment_id;
    
    -- Update the consignment
    UPDATE consignments
    SET 
        status = 'delivered',
        truck_id = NULL
    WHERE id = p_consignment_id;
    
    -- If there's an assigned truck, update it
    IF v_truck_id IS NOT NULL THEN
        UPDATE trucks
        SET 
            status = 'available',
            assigned_consignment_id = NULL
        WHERE id = v_truck_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to mark a truck as available
CREATE OR REPLACE FUNCTION mark_truck_available(
    p_truck_id TEXT
) RETURNS VOID AS $$
DECLARE
    v_consignment_id TEXT;
BEGIN
    -- Get the assigned_consignment_id from the truck
    SELECT assigned_consignment_id INTO v_consignment_id
    FROM trucks
    WHERE id = p_truck_id;
    
    -- Update the truck
    UPDATE trucks
    SET 
        status = 'available',
        assigned_consignment_id = NULL
    WHERE id = p_truck_id;
    
    -- If there's an assigned consignment, update it
    IF v_consignment_id IS NOT NULL THEN
        UPDATE consignments
        SET 
            status = 'pending',
            truck_id = NULL
        WHERE id = v_consignment_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
