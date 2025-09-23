-- =============================================
-- TRIGGERS FOR DATA VALIDATION AND AUTO-UPDATES
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    user_id_val UUID;
BEGIN
    -- Try to get created_by from NEW or OLD record, but handle cases where it doesn't exist
    BEGIN
        IF TG_OP = 'DELETE' THEN
            user_id_val := OLD.created_by;
        ELSE
            user_id_val := NEW.created_by;
        END IF;
    EXCEPTION WHEN undefined_column THEN
        user_id_val := '00000000-0000-0000-0000-000000000000'::uuid;
    END;
    
    -- If still null, use default
    IF user_id_val IS NULL THEN
        user_id_val := '00000000-0000-0000-0000-000000000000'::uuid;
    END IF;
    
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        user_id_val
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to update site spent amount when expenses are added/updated
CREATE OR REPLACE FUNCTION update_site_spent_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update site spent amount
    UPDATE sites 
    SET spent = (
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses 
        WHERE site_id = COALESCE(NEW.site_id, OLD.site_id)
        AND status = 'approved'
    )
    WHERE id = COALESCE(NEW.site_id, OLD.site_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to update site progress based on completed activities
CREATE OR REPLACE FUNCTION update_site_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sites 
    SET progress = (
        SELECT CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100)
        END
        FROM activities 
        WHERE site_id = COALESCE(NEW.site_id, OLD.site_id)
    )
    WHERE id = COALESCE(NEW.site_id, OLD.site_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to validate vehicle assignment to site
CREATE OR REPLACE FUNCTION validate_vehicle_site_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if vehicle is already assigned to another site
    IF NEW.site_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM vehicles 
        WHERE id != NEW.id 
        AND site_id = NEW.site_id 
        AND status = 'active'
    ) THEN
        -- Allow multiple vehicles per site, but log warning
        RAISE NOTICE 'Vehicle % assigned to site %', NEW.id, NEW.site_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update vendor total orders
CREATE OR REPLACE FUNCTION update_vendor_orders()
RETURNS TRIGGER AS $$
BEGIN
    -- Update vendor total orders count
    UPDATE vendors 
    SET total_orders = (
        SELECT COUNT(*)
        FROM expenses 
        WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
    ),
    last_order_date = (
        SELECT MAX(expense_date)
        FROM expenses 
        WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
    )
    WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- =============================================
-- APPLY TRIGGERS TO TABLES
-- =============================================

-- Updated timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_labour_updated_at BEFORE UPDATE ON labour FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicle_rentals_updated_at BEFORE UPDATE ON vehicle_rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Simplified audit log function for tables without created_by
CREATE OR REPLACE FUNCTION create_audit_log_simple()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        '00000000-0000-0000-0000-000000000000'::uuid
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Audit log triggers - use simple version for tables without created_by
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_clients AFTER INSERT OR UPDATE OR DELETE ON clients FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_sites AFTER INSERT OR UPDATE OR DELETE ON sites FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_vendors AFTER INSERT OR UPDATE OR DELETE ON vendors FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_vehicles AFTER INSERT OR UPDATE OR DELETE ON vehicles FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_materials AFTER INSERT OR UPDATE OR DELETE ON materials FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_labour AFTER INSERT OR UPDATE OR DELETE ON labour FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expenses FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_activities AFTER INSERT OR UPDATE OR DELETE ON activities FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();
CREATE TRIGGER audit_vehicle_rentals AFTER INSERT OR UPDATE OR DELETE ON vehicle_rentals FOR EACH ROW EXECUTE FUNCTION create_audit_log_simple();

-- Business logic triggers
CREATE TRIGGER update_site_spent_on_expense AFTER INSERT OR UPDATE OR DELETE ON expenses FOR EACH ROW EXECUTE FUNCTION update_site_spent_amount();
CREATE TRIGGER update_site_progress_on_activity AFTER INSERT OR UPDATE OR DELETE ON activities FOR EACH ROW EXECUTE FUNCTION update_site_progress();
CREATE TRIGGER validate_vehicle_assignment BEFORE INSERT OR UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION validate_vehicle_site_assignment();
CREATE TRIGGER update_vendor_orders_on_expense AFTER INSERT OR UPDATE OR DELETE ON expenses FOR EACH ROW EXECUTE FUNCTION update_vendor_orders();
