-- =============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Sites indexes
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_client_id ON sites(client_id);
CREATE INDEX idx_sites_manager_id ON sites(manager_id);
CREATE INDEX idx_sites_start_date ON sites(start_date);
CREATE INDEX idx_sites_end_date ON sites(end_date);

-- Vendors indexes
CREATE INDEX idx_vendors_type ON vendors(type);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_rating ON vendors(rating);

-- Vehicles indexes
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_site_id ON vehicles(site_id);
CREATE INDEX idx_vehicles_operator_id ON vehicles(operator_id);
CREATE INDEX idx_vehicles_vendor_id ON vehicles(vendor_id);

-- Materials indexes
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_site_id ON materials(site_id);
CREATE INDEX idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX idx_materials_purchase_date ON materials(purchase_date);
CREATE INDEX idx_materials_expiry_date ON materials(expiry_date);

-- Labour indexes
CREATE INDEX idx_labour_skill ON labour(skill);
CREATE INDEX idx_labour_site_id ON labour(site_id);
CREATE INDEX idx_labour_status ON labour(status);
CREATE INDEX idx_labour_contractor_id ON labour(contractor_id);

-- Expenses indexes
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_site_id ON expenses(site_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_vendor_id ON expenses(vendor_id);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);

-- Payments indexes
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_site_id ON payments(site_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_invoice_number ON payments(invoice_number);

-- Activities indexes
CREATE INDEX idx_activities_site_id ON activities(site_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_start_date ON activities(start_date);
CREATE INDEX idx_activities_end_date ON activities(end_date);
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);

-- Vehicle rentals indexes
CREATE INDEX idx_vehicle_rentals_vehicle_id ON vehicle_rentals(vehicle_id);
CREATE INDEX idx_vehicle_rentals_site_id ON vehicle_rentals(site_id);
CREATE INDEX idx_vehicle_rentals_status ON vehicle_rentals(status);
CREATE INDEX idx_vehicle_rentals_start_date ON vehicle_rentals(rental_start_date);
CREATE INDEX idx_vehicle_rentals_end_date ON vehicle_rentals(rental_end_date);

-- Audit log indexes
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);

-- Composite indexes for common queries
CREATE INDEX idx_expenses_site_date ON expenses(site_id, expense_date);
CREATE INDEX idx_materials_site_category ON materials(site_id, category);
CREATE INDEX idx_vehicles_site_status ON vehicles(site_id, status);
CREATE INDEX idx_activities_site_status ON activities(site_id, status);
