-- =============================================
-- FIX AUDIT TRIGGERS - Run this in pgAdmin
-- =============================================

-- Drop existing audit triggers
DROP TRIGGER IF EXISTS audit_users ON users;
DROP TRIGGER IF EXISTS audit_clients ON clients;
DROP TRIGGER IF EXISTS audit_sites ON sites;
DROP TRIGGER IF EXISTS audit_vendors ON vendors;
DROP TRIGGER IF EXISTS audit_vehicles ON vehicles;
DROP TRIGGER IF EXISTS audit_materials ON materials;
DROP TRIGGER IF EXISTS audit_labour ON labour;
DROP TRIGGER IF EXISTS audit_expenses ON expenses;
DROP TRIGGER IF EXISTS audit_payments ON payments;
DROP TRIGGER IF EXISTS audit_activities ON activities;
DROP TRIGGER IF EXISTS audit_vehicle_rentals ON vehicle_rentals;

-- Drop the problematic function
DROP FUNCTION IF EXISTS create_audit_log() CASCADE;

-- Create the simplified audit function
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

-- Create the audit function for tables with created_by
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

-- Recreate audit triggers with correct functions
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

-- Test the fix by inserting a test record
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('test@example.com', 'test_hash', 'Test', 'User', 'operator');

-- Clean up test record
DELETE FROM users WHERE email = 'test@example.com';

-- Show success message
SELECT 'Audit triggers fixed successfully!' as status;
