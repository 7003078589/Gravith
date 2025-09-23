-- =============================================
-- GRAVITH DATABASE SETUP - RUN THIS STEP BY STEP
-- =============================================

-- STEP 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 2: Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS site_equipment_suggestions CASCADE;
DROP TABLE IF EXISTS vehicle_rentals CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS labour CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- STEP 3: Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_audit_log() CASCADE;
DROP FUNCTION IF EXISTS create_audit_log_simple() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_site_spent_amount() CASCADE;
DROP FUNCTION IF EXISTS update_site_progress() CASCADE;
DROP FUNCTION IF EXISTS validate_vehicle_site_assignment() CASCADE;
DROP FUNCTION IF EXISTS update_vendor_orders() CASCADE;

-- Now run the main scripts in order:
-- 1. Copy and paste content from 01_create_tables.sql
-- 2. Copy and paste content from 02_create_indexes.sql  
-- 3. Copy and paste content from 03_create_triggers.sql
-- 4. Copy and paste content from 04_seed_data.sql
-- 5. Copy and paste content from 05_views_and_functions.sql
