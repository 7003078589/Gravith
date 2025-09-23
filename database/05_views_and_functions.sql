-- =============================================
-- VIEWS AND UTILITY FUNCTIONS
-- =============================================

-- View for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM sites WHERE status = 'active') as total_sites,
    (SELECT COUNT(*) FROM sites WHERE status = 'active') as active_sites,
    (SELECT COALESCE(SUM(budget), 0) FROM sites WHERE status = 'active') as total_budget,
    (SELECT COALESCE(SUM(spent), 0) FROM sites WHERE status = 'active') as total_spent,
    (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments,
    (SELECT COUNT(*) FROM payments WHERE status = 'overdue') as overdue_payments,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'active') as active_vehicles,
    (SELECT COUNT(*) FROM materials WHERE quantity <= min_threshold) as low_stock_materials;

-- View for site summary with client information
CREATE OR REPLACE VIEW site_summary AS
SELECT 
    s.*,
    c.name as client_name,
    c.contact_person as client_contact,
    c.email as client_email,
    c.phone as client_phone,
    u.first_name || ' ' || u.last_name as manager_name,
    u.phone as manager_phone,
    CASE 
        WHEN s.end_date < CURRENT_DATE THEN 'Overdue'
        WHEN s.end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Due Soon'
        ELSE 'On Track'
    END as timeline_status,
    ROUND((s.spent / NULLIF(s.budget, 0)) * 100, 2) as budget_utilization_percent
FROM sites s
LEFT JOIN clients c ON s.client_id = c.id
LEFT JOIN users u ON s.manager_id = u.id;

-- View for expense summary with related information
CREATE OR REPLACE VIEW expense_summary AS
SELECT 
    e.*,
    s.name as site_name,
    s.location as site_location,
    v.name as vendor_name,
    v.type as vendor_type,
    veh.name as vehicle_name,
    veh.type as vehicle_type,
    m.name as material_name,
    m.category as material_category,
    l.name as labour_name,
    l.skill as labour_skill,
    u.first_name || ' ' || u.last_name as created_by_name,
    approver.first_name || ' ' || approver.last_name as approved_by_name
FROM expenses e
LEFT JOIN sites s ON e.site_id = s.id
LEFT JOIN vendors v ON e.vendor_id = v.id
LEFT JOIN vehicles veh ON e.vehicle_id = veh.id
LEFT JOIN materials m ON e.material_id = m.id
LEFT JOIN labour l ON e.labour_id = l.id
LEFT JOIN users u ON e.created_by = u.id
LEFT JOIN users approver ON e.approved_by = approver.id;

-- View for vehicle utilization
CREATE OR REPLACE VIEW vehicle_utilization AS
SELECT 
    v.*,
    s.name as site_name,
    s.location as site_location,
    u.first_name || ' ' || u.last_name as operator_name,
    ven.name as vendor_name,
    CASE 
        WHEN v.fuel_level < 20 THEN 'Low Fuel'
        WHEN v.fuel_level < 50 THEN 'Medium Fuel'
        ELSE 'Good Fuel'
    END as fuel_status,
    CASE 
        WHEN v.next_service_date <= CURRENT_DATE THEN 'Service Due'
        WHEN v.next_service_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Service Soon'
        ELSE 'Service OK'
    END as service_status,
    (SELECT COUNT(*) FROM vehicle_rentals vr WHERE vr.vehicle_id = v.id AND vr.status = 'active') as active_rentals
FROM vehicles v
LEFT JOIN sites s ON v.site_id = s.id
LEFT JOIN users u ON v.operator_id = u.id
LEFT JOIN vendors ven ON v.vendor_id = ven.id;

-- View for material inventory status
CREATE OR REPLACE VIEW material_inventory AS
SELECT 
    m.*,
    s.name as site_name,
    s.location as site_location,
    v.name as supplier_name,
    v.contact_person as supplier_contact,
    v.phone as supplier_phone,
    CASE 
        WHEN m.quantity <= m.min_threshold THEN 'Critical'
        WHEN m.quantity <= (m.min_threshold * 1.5) THEN 'Low'
        WHEN m.quantity >= COALESCE(m.max_threshold, m.min_threshold * 5) THEN 'High'
        ELSE 'Normal'
    END as stock_status,
    (m.quantity * m.cost_per_unit) as total_value,
    CASE 
        WHEN m.expiry_date IS NOT NULL AND m.expiry_date <= CURRENT_DATE THEN 'Expired'
        WHEN m.expiry_date IS NOT NULL AND m.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
        ELSE 'Fresh'
    END as expiry_status
FROM materials m
LEFT JOIN sites s ON m.site_id = s.id
LEFT JOIN vendors v ON m.supplier_id = v.id;

-- Function to get site expenses by category
CREATE OR REPLACE FUNCTION get_site_expenses_by_category(site_uuid UUID)
RETURNS TABLE(category VARCHAR, total_amount DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.category,
        COALESCE(SUM(e.amount), 0) as total_amount
    FROM expenses e
    WHERE e.site_id = site_uuid AND e.status = 'approved'
    GROUP BY e.category
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate vehicle rental cost
CREATE OR REPLACE FUNCTION calculate_vehicle_rental_cost(
    p_per_day_cost DECIMAL,
    p_per_hour_cost DECIMAL,
    p_start_date DATE,
    p_end_date DATE,
    p_diesel_cost_per_liter DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    rental_days INTEGER;
    rental_hours INTEGER;
    rental_cost DECIMAL;
    fuel_cost DECIMAL;
    total_cost DECIMAL;
BEGIN
    -- Calculate rental period
    rental_days := p_end_date - p_start_date + 1;
    rental_hours := rental_days * 8; -- Assuming 8 hours per day
    
    -- Calculate rental cost
    rental_cost := (p_per_day_cost * rental_days) + (p_per_hour_cost * rental_hours);
    
    -- Calculate fuel cost (assuming 50 liters per day consumption)
    fuel_cost := (50 * rental_days) * p_diesel_cost_per_liter;
    
    -- Total cost
    total_cost := rental_cost + fuel_cost;
    
    RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to get suggested materials for activity type
CREATE OR REPLACE FUNCTION get_suggested_materials(activity_type VARCHAR)
RETURNS TABLE(material_name VARCHAR, category VARCHAR, typical_quantity DECIMAL, unit VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE activity_type
            WHEN 'excavation' THEN 'Sand'
            WHEN 'concrete-work' THEN 'Cement'
            WHEN 'steel-work' THEN 'Steel Bars'
            WHEN 'masonry' THEN 'Bricks'
            WHEN 'electrical' THEN 'Electrical Wires'
            WHEN 'plumbing' THEN 'Pipes'
            ELSE 'General Materials'
        END as material_name,
        CASE activity_type
            WHEN 'excavation' THEN 'sand'
            WHEN 'concrete-work' THEN 'cement'
            WHEN 'steel-work' THEN 'steel'
            WHEN 'masonry' THEN 'bricks'
            WHEN 'electrical' THEN 'electrical'
            WHEN 'plumbing' THEN 'plumbing'
            ELSE 'other'
        END as category,
        CASE activity_type
            WHEN 'excavation' THEN 50.0
            WHEN 'concrete-work' THEN 100.0
            WHEN 'steel-work' THEN 500.0
            WHEN 'masonry' THEN 1000.0
            WHEN 'electrical' THEN 10.0
            WHEN 'plumbing' THEN 20.0
            ELSE 1.0
        END as typical_quantity,
        CASE activity_type
            WHEN 'excavation' THEN 'cubic_meters'
            WHEN 'concrete-work' THEN 'bags'
            WHEN 'steel-work' THEN 'kg'
            WHEN 'masonry' THEN 'pieces'
            WHEN 'electrical' THEN 'meters'
            WHEN 'plumbing' THEN 'meters'
            ELSE 'units'
        END as unit;
END;
$$ LANGUAGE plpgsql;

-- Function to get suggested vehicles for activity type
CREATE OR REPLACE FUNCTION get_suggested_vehicles(activity_type VARCHAR)
RETURNS TABLE(vehicle_type VARCHAR, priority INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE activity_type
            WHEN 'excavation' THEN 'excavator'
            WHEN 'concrete-work' THEN 'concrete-mixer'
            WHEN 'steel-work' THEN 'crane'
            WHEN 'transport' THEN 'truck'
            WHEN 'compaction' THEN 'compactor'
            WHEN 'loading' THEN 'loader'
            WHEN 'demolition' THEN 'bulldozer'
            ELSE 'general'
        END as vehicle_type,
        CASE activity_type
            WHEN 'excavation' THEN 1
            WHEN 'concrete-work' THEN 1
            WHEN 'steel-work' THEN 1
            WHEN 'transport' THEN 2
            WHEN 'compaction' THEN 2
            WHEN 'loading' THEN 2
            WHEN 'demolition' THEN 2
            ELSE 3
        END as priority;
END;
$$ LANGUAGE plpgsql;

-- Function to get suggested skills for activity type
CREATE OR REPLACE FUNCTION get_suggested_skills(activity_type VARCHAR)
RETURNS TABLE(skill VARCHAR, experience_required INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE activity_type
            WHEN 'excavation' THEN 'Excavator Operator'
            WHEN 'concrete-work' THEN 'Concrete Worker'
            WHEN 'steel-work' THEN 'Steel Fitter'
            WHEN 'masonry' THEN 'Mason'
            WHEN 'electrical' THEN 'Electrician'
            WHEN 'plumbing' THEN 'Plumber'
            WHEN 'carpentry' THEN 'Carpenter'
            ELSE 'General Labor'
        END as skill,
        CASE activity_type
            WHEN 'excavation' THEN 3
            WHEN 'concrete-work' THEN 2
            WHEN 'steel-work' THEN 5
            WHEN 'masonry' THEN 3
            WHEN 'electrical' THEN 4
            WHEN 'plumbing' THEN 4
            WHEN 'carpentry' THEN 3
            ELSE 1
        END as experience_required;
END;
$$ LANGUAGE plpgsql;

-- Function to validate date within site period
CREATE OR REPLACE FUNCTION validate_date_within_site_period(
    p_date DATE,
    p_site_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    site_start_date DATE;
    site_end_date DATE;
BEGIN
    SELECT start_date, end_date INTO site_start_date, site_end_date
    FROM sites
    WHERE id = p_site_id;
    
    IF site_start_date IS NULL OR site_end_date IS NULL THEN
        RETURN TRUE; -- If site dates are not set, allow any date
    END IF;
    
    RETURN p_date >= site_start_date AND p_date <= site_end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to sync activity dates with vehicle rental
CREATE OR REPLACE FUNCTION sync_activity_dates_with_vehicle_rental(
    p_activity_id UUID,
    p_vehicle_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    activity_start_date DATE;
    activity_end_date DATE;
    rental_start_date DATE;
    rental_end_date DATE;
BEGIN
    -- Get activity dates
    SELECT start_date, end_date INTO activity_start_date, activity_end_date
    FROM activities
    WHERE id = p_activity_id;
    
    -- Get vehicle rental dates
    SELECT rental_start_date, rental_end_date INTO rental_start_date, rental_end_date
    FROM vehicle_rentals
    WHERE vehicle_id = p_vehicle_id AND status = 'active'
    ORDER BY rental_start_date DESC
    LIMIT 1;
    
    -- If no active rental found, return true
    IF rental_start_date IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Check if activity dates are within rental period
    IF activity_start_date IS NOT NULL AND activity_start_date < rental_start_date THEN
        RETURN FALSE;
    END IF;
    
    IF activity_end_date IS NOT NULL AND activity_end_date > rental_end_date THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
