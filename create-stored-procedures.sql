-- Create stored procedure to update consignment with truck
CREATE OR REPLACE FUNCTION update_consignment_truck(p_consignment_id TEXT, p_truck_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE consignments 
    SET 
        status = 'in-transit', 
        truck_id = p_truck_id, 
        updated_at = NOW()
    WHERE id = p_consignment_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to update truck with assigned consignment
CREATE OR REPLACE FUNCTION update_truck_assignment(p_truck_id TEXT, p_consignment_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE trucks 
    SET 
        status = 'in-transit', 
        assigned_consignment_id = p_consignment_id, 
        updated_at = NOW()
    WHERE id = p_truck_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to mark consignment as delivered
CREATE OR REPLACE FUNCTION mark_consignment_delivered(p_consignment_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE consignments 
    SET 
        status = 'delivered', 
        updated_at = NOW()
    WHERE id = p_consignment_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to free a truck (make it available)
CREATE OR REPLACE FUNCTION free_truck(p_truck_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE trucks 
    SET 
        status = 'available', 
        assigned_consignment_id = NULL, 
        updated_at = NOW()
    WHERE id = p_truck_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to reset a consignment to pending
CREATE OR REPLACE FUNCTION reset_consignment(p_consignment_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE consignments 
    SET 
        status = 'pending', 
        truck_id = NULL, 
        updated_at = NOW()
    WHERE id = p_consignment_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
