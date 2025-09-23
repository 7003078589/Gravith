-- =============================================
-- GRAVITH CONSTRUCTION MANAGEMENT DATABASE
-- Complete Schema Creation Script
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS & AUTHENTICATION
-- =============================================

-- Users table for authentication and user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'supervisor', 'operator')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. CLIENTS
-- =============================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. SITES/PROJECTS
-- =============================================

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    client_id UUID REFERENCES clients(id),
    manager_id UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    description TEXT,
    coordinates POINT, -- For GPS coordinates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. VENDORS/SUPPLIERS
-- =============================================

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('supplier', 'contractor', 'service-provider', 'equipment-rental')),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(20),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_orders INTEGER DEFAULT 0,
    last_order_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. VEHICLES/EQUIPMENT
-- =============================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('excavator', 'crane', 'truck', 'concrete-mixer', 'bulldozer', 'generator', 'loader', 'compactor')),
    registration_number VARCHAR(50) UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'maintenance', 'idle', 'retired')),
    location VARCHAR(255),
    fuel_level INTEGER DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    last_service_date DATE,
    next_service_date DATE,
    operator_id UUID REFERENCES users(id),
    site_id UUID REFERENCES sites(id),
    vendor_id UUID REFERENCES vendors(id),
    purchase_date DATE,
    purchase_price DECIMAL(15,2),
    warranty_expiry DATE,
    insurance_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. MATERIALS
-- =============================================

CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('cement', 'steel', 'bricks', 'sand', 'aggregate', 'tiles', 'paint', 'electrical', 'plumbing', 'other')),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    supplier_id UUID REFERENCES vendors(id),
    site_id UUID REFERENCES sites(id),
    purchase_date DATE,
    expiry_date DATE,
    min_threshold DECIMAL(10,2) DEFAULT 0,
    max_threshold DECIMAL(10,2),
    quality_grade VARCHAR(50),
    batch_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. LABOUR/WORKERS
-- =============================================

CREATE TABLE labour (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    experience_years INTEGER DEFAULT 0,
    wage_per_day DECIMAL(10,2),
    wage_per_hour DECIMAL(10,2),
    phone VARCHAR(20),
    address TEXT,
    aadhar_number VARCHAR(20),
    join_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    site_id UUID REFERENCES sites(id),
    contractor_id UUID REFERENCES vendors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. EXPENSES
-- =============================================

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('labor', 'materials', 'equipment', 'fuel', 'utilities', 'transport', 'miscellaneous')),
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    site_id UUID REFERENCES sites(id),
    vendor_id UUID REFERENCES vendors(id),
    vehicle_id UUID REFERENCES vehicles(id),
    material_id UUID REFERENCES materials(id),
    labour_id UUID REFERENCES labour(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    receipt_number VARCHAR(100),
    receipt_image_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 9. PAYMENTS
-- =============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    site_id UUID REFERENCES sites(id),
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'overdue', 'paid', 'cancelled')),
    invoice_number VARCHAR(100) UNIQUE,
    invoice_date DATE,
    payment_date DATE,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. ACTIVITIES/MILESTONES
-- =============================================

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    planned_duration INTEGER, -- in days
    actual_duration INTEGER, -- in days
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'delayed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    site_id UUID REFERENCES sites(id),
    assigned_to UUID REFERENCES users(id),
    parent_activity_id UUID REFERENCES activities(id),
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 11. VEHICLE RENTALS
-- =============================================

CREATE TABLE vehicle_rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    site_id UUID REFERENCES sites(id),
    vendor_id UUID REFERENCES vendors(id),
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    per_day_cost DECIMAL(10,2),
    per_hour_cost DECIMAL(10,2),
    diesel_cost_per_liter DECIMAL(10,2),
    total_cost DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 12. SITE EQUIPMENT SUGGESTIONS
-- =============================================

CREATE TABLE site_equipment_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id),
    activity_type VARCHAR(100),
    suggested_equipment TEXT[], -- Array of equipment types
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 13. AUDIT LOG
-- =============================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 14. SYSTEM SETTINGS
-- =============================================

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
