-- =============================================
-- SEED DATA FOR TESTING
-- =============================================

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@gravith.com', '$2b$10$example_hash', 'Admin', 'User', 'admin', '+91-9876543210', TRUE),
('22222222-2222-2222-2222-222222222222', 'manager@gravith.com', '$2b$10$example_hash', 'Rajesh', 'Kumar', 'manager', '+91-9876543211', TRUE),
('33333333-3333-3333-3333-333333333333', 'supervisor@gravith.com', '$2b$10$example_hash', 'Priya', 'Sharma', 'supervisor', '+91-9876543212', TRUE),
('44444444-4444-4444-4444-444444444444', 'operator@gravith.com', '$2b$10$example_hash', 'Amit', 'Patel', 'operator', '+91-9876543213', TRUE);

-- Insert sample clients
INSERT INTO clients (id, name, contact_person, email, phone, address, city, state, pincode, gst_number) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ABC Developers', 'Mr. Ravi Sharma', 'contact@abcdevelopers.com', '+91-9876543210', '123 Business Park, Sector 15', 'Navi Mumbai', 'Maharashtra', '400706', '27AABCU9603R1ZX'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'XYZ Corp', 'Ms. Sunita Singh', 'projects@xyzcorp.com', '+91-9876543211', '456 Corporate Hub, Business District', 'Pune', 'Maharashtra', '411001', '27BXYZU9603R1ZX'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Government of Maharashtra', 'Mr. Pradeep Kumar', 'projects@govmaharashtra.gov.in', '+91-9876543212', 'Mantralaya, Mumbai', 'Mumbai', 'Maharashtra', '400032', '27CGOVU9603R1ZX');

-- Insert sample vendors
INSERT INTO vendors (id, name, type, contact_person, email, phone, address, city, state, pincode, gst_number, rating, total_orders, status) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Tata Steel Ltd', 'supplier', 'Mr. Vikram Singh', 'sales@tatasteel.com', '+91-9876543213', 'Bombay House, Homi Mody Street', 'Mumbai', 'Maharashtra', '400001', '27DTATA9603R1ZX', 4.5, 25, 'active'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'UltraTech Cement', 'supplier', 'Ms. Rekha Verma', 'orders@ultratechcement.com', '+91-9876543214', 'Bandra Kurla Complex', 'Mumbai', 'Maharashtra', '400051', '27EULTR9603R1ZX', 4.2, 18, 'active'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'JCB India', 'equipment-rental', 'Mr. Rajesh Kumar', 'rentals@jcb.com', '+91-9876543215', 'Ballabgarh Industrial Area', 'Faridabad', 'Haryana', '121004', '27FJCB9603R1ZX', 4.7, 12, 'active'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'Mahindra Construction', 'contractor', 'Mr. Suresh Patel', 'contracts@mahindra.com', '+91-9876543216', 'Gateway Building, Apollo Mills', 'Mumbai', 'Maharashtra', '400031', '27GMAHI9603R1ZX', 4.3, 8, 'active');

-- Insert sample sites
INSERT INTO sites (id, name, location, status, progress, budget, spent, client_id, manager_id, start_date, end_date, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Residential Complex A', 'Sector 15, Navi Mumbai', 'active', 64, 50000000.00, 32000000.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '2024-01-15', '2024-12-15', 'High-end residential complex with 200 apartments'),
('22222222-2222-2222-2222-222222222222', 'Commercial Plaza B', 'Business District, Pune', 'active', 55, 75000000.00, 41250000.00, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '2024-02-01', '2024-11-30', 'Commercial office complex with retail spaces'),
('33333333-3333-3333-3333-333333333333', 'Highway Bridge Project', 'Mumbai-Pune Highway', 'active', 96, 120000000.00, 115200000.00, 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '2023-06-01', '2024-03-31', '6-lane highway bridge construction');

-- Insert sample vehicles
INSERT INTO vehicles (id, name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Excavator JCB-220', 'excavator', 'MH-01-AB-1234', 'active', 'Sector 15, Navi Mumbai', 85, '2024-01-15', '2024-04-15', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2023-12-01', 2500000.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Crane TATA-50T', 'crane', 'MH-02-CD-5678', 'active', 'Business District, Pune', 70, '2024-02-01', '2024-05-01', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2023-11-15', 4500000.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Concrete Mixer', 'concrete-mixer', 'MH-03-EF-9012', 'maintenance', 'Mumbai-Pune Highway', 60, '2024-01-30', '2024-04-30', NULL, '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2023-10-01', 800000.00);

-- Insert sample materials
INSERT INTO materials (id, name, category, quantity, unit, cost_per_unit, supplier_id, site_id, purchase_date, min_threshold, quality_grade, batch_number) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Portland Cement', 'cement', 500.00, 'bags', 450.00, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '2024-01-20', 50.00, 'Grade 53', 'BATCH-2024-001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TMT Steel Bars', 'steel', 2000.00, 'kg', 65.00, 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '2024-01-25', 200.00, 'Fe-500D', 'STEEL-2024-002'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Red Clay Bricks', 'bricks', 50000.00, 'pieces', 8.50, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '22222222-2222-2222-2222-222222222222', '2024-02-05', 5000.00, 'First Class', 'BRICK-2024-003'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'River Sand', 'sand', 100.00, 'cubic_meters', 1200.00, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '22222222-2222-2222-2222-222222222222', '2024-02-10', 10.00, 'Fine Grade', 'SAND-2024-004');

-- Insert sample labour
INSERT INTO labour (id, name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, aadhar_number, join_date, status, site_id, contractor_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ramesh Kumar', 'Mason', 15, 800.00, 100.00, '+91-9876543217', 'Village: Sonipat, Haryana', '123456789012', '2024-01-20', 'active', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Suresh Singh', 'Carpenter', 12, 750.00, 95.00, '+91-9876543218', 'Village: Meerut, Uttar Pradesh', '234567890123', '2024-01-22', 'active', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Vikram Patel', 'Electrician', 8, 900.00, 115.00, '+91-9876543219', 'City: Ahmedabad, Gujarat', '345678901234', '2024-02-01', 'active', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab');

-- Insert sample expenses
INSERT INTO expenses (id, description, category, amount, expense_date, site_id, vendor_id, vehicle_id, material_id, labour_id, status, approved_by, approved_at, receipt_number, created_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Purchase of Portland Cement', 'materials', 225000.00, '2024-01-20', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-01-21 10:30:00', 'REC-001', '33333333-3333-3333-3333-333333333333'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Excavator rental for 30 days', 'equipment', 150000.00, '2024-01-25', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-01-26 14:20:00', 'REC-002', '33333333-3333-3333-3333-333333333333'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Labour wages for masonry work', 'labor', 24000.00, '2024-01-30', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', NULL, NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', '22222222-2222-2222-2222-222222222222', '2024-01-31 16:45:00', 'REC-003', '33333333-3333-3333-3333-333333333333'),

-- Equipment Expenses
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Crane maintenance and repair', 'equipment', 45000.00, '2024-02-05', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, NULL, 'approved', '33333333-3333-3333-3333-333333333333', '2024-02-06 09:15:00', 'REC-004', '33333333-3333-3333-3333-333333333333'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Concrete mixer fuel costs', 'equipment', 8500.00, '2024-02-10', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-02-11 11:30:00', 'REC-005', '33333333-3333-3333-3333-333333333333'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Equipment insurance premium', 'equipment', 25000.00, '2024-02-15', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NULL, 'pending', NULL, NULL, 'REC-006', '33333333-3333-3333-3333-333333333333'),

-- Transport Expenses
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Truck rental for material transport', 'transport', 12000.00, '2024-02-08', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-02-09 14:20:00', 'REC-007', '33333333-3333-3333-3333-333333333333'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Fuel costs for site vehicles', 'transport', 18500.00, '2024-02-12', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NULL, 'approved', '33333333-3333-3333-3333-333333333333', '2024-02-13 16:45:00', 'REC-008', '33333333-3333-3333-3333-333333333333'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Driver wages for February', 'transport', 32000.00, '2024-02-28', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', NULL, NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-03-01 10:00:00', 'REC-009', '33333333-3333-3333-3333-333333333333'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'Toll charges for material delivery', 'transport', 3500.00, '2024-03-02', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NULL, 'pending', NULL, NULL, 'REC-010', '33333333-3333-3333-3333-333333333333'),

-- Utilities Expenses
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'Site electricity bill - February', 'utilities', 18500.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', NULL, NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-03-02 12:30:00', 'REC-011', '33333333-3333-3333-3333-333333333333'),
('llllllll-llll-llll-llll-llllllllllll', 'Water supply connection charges', 'utilities', 8500.00, '2024-02-20', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', NULL, NULL, NULL, 'approved', '33333333-3333-3333-3333-333333333333', '2024-02-21 15:20:00', 'REC-012', '33333333-3333-3333-3333-333333333333'),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'Generator fuel and maintenance', 'utilities', 12500.00, '2024-02-25', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL, NULL, 'approved', '22222222-2222-2222-2222-222222222222', '2024-02-26 09:45:00', 'REC-013', '33333333-3333-3333-3333-333333333333'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'Internet and communication setup', 'utilities', 15000.00, '2024-03-05', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', NULL, NULL, NULL, 'pending', NULL, NULL, 'REC-014', '33333333-3333-3333-3333-333333333333');

-- Insert sample payments
INSERT INTO payments (id, client_id, site_id, amount, due_date, status, invoice_number, invoice_date, payment_date, payment_method, reference_number, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 15000000.00, '2024-02-15', 'pending', 'INV-2024-001', '2024-01-15', NULL, NULL, NULL, 'Milestone payment for foundation completion'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 25000000.00, '2024-02-28', 'pending', 'INV-2024-002', '2024-02-01', NULL, NULL, NULL, 'Progress payment for structural work'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 5000000.00, '2024-01-31', 'paid', 'INV-2024-003', '2024-01-01', '2024-01-30', 'Bank Transfer', 'TXN-2024-001', 'Final payment for bridge completion');

-- Insert sample activities
INSERT INTO activities (id, name, description, activity_type, start_date, end_date, planned_duration, actual_duration, status, priority, progress, site_id, assigned_to, estimated_cost, actual_cost) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Foundation Excavation', 'Excavation work for building foundation', 'excavation', '2024-01-15', '2024-01-25', 10, 12, 'completed', 'high', 100, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 150000.00, 175000.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Concrete Pouring', 'Pouring concrete for foundation', 'concrete-work', '2024-01-26', '2024-02-05', 10, 8, 'completed', 'high', 100, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 200000.00, 185000.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Structural Steel Work', 'Installation of structural steel framework', 'steel-work', '2024-02-06', '2024-02-20', 14, NULL, 'in-progress', 'critical', 65, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 300000.00, NULL);

-- Insert sample vehicle rentals
INSERT INTO vehicle_rentals (id, vehicle_id, site_id, vendor_id, rental_start_date, rental_end_date, per_day_cost, per_hour_cost, diesel_cost_per_liter, total_cost, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-01-15', '2024-02-14', 5000.00, 500.00, 95.00, 150000.00, 'completed'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-02-01', '2024-04-30', 8000.00, 800.00, 95.00, 240000.00, 'active');

-- Insert sample site equipment suggestions
INSERT INTO site_equipment_suggestions (id, site_id, activity_type, suggested_equipment) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'excavation', ARRAY['excavator', 'bulldozer', 'truck']),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'concrete-work', ARRAY['concrete-mixer', 'crane', 'truck']),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'steel-work', ARRAY['crane', 'welding-equipment', 'truck']);

-- Insert system settings
INSERT INTO system_settings (id, key, value, description, updated_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'company_name', 'Gravith Construction', 'Company name for reports and invoices', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'currency', 'INR', 'Default currency for the system', '11111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'fuel_cost_per_liter', '95.00', 'Current fuel cost per liter', '11111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'working_hours_per_day', '8', 'Standard working hours per day', '11111111-1111-1111-1111-111111111111');
