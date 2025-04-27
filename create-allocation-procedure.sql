-- Create a function to allocate a truck to a consignment
CREATE OR REPLACE FUNCTION allocate_truck(p_consignment_id TEXT, p_truck_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_truck_status TEXT;
BEGIN
    -- Check if the truck exists and is available
    SELECT status INTO v_truck_status FROM trucks WHERE id = p_truck_id;
    
    IF v_truck_status IS NULL THEN
        RAISE EXCEPTION 'Truck with ID % not found', p_truck_id;
    END IF;
    
    IF v_truck_status != 'available' THEN
        RAISE EXCEPTION 'Truck with ID % is not available (current status: %)', p_truck_id, v_truck_status;
    END IF;
    
    -- Update the consignment status and assign the truck
    UPDATE consignments 
    SET status = 'in-transit', truck_id = p_truck_id, updated_at = NOW()
    WHERE id = p_consignment_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Consignment with ID % not found', p_consignment_id;
    END IF;
    
    -- Update the truck status and assign the consignment
    UPDATE trucks 
    SET status = 'in-transit', assigned_consignment_id = p_consignment_id, updated_at = NOW()
    WHERE id = p_truck_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
