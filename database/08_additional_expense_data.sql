-- =============================================
-- ADDITIONAL EXPENSE DATA FOR EQUIPMENT, TRANSPORT, AND UTILITIES
-- =============================================

-- Insert additional Equipment Expenses
INSERT INTO expenses (id, description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, vehicle_id, status, receipt_number, created_by) VALUES
-- Equipment Rental and Maintenance
('equip-001', 'Excavator JCB-220 rental for foundation work', 'equipment', 75000.00, 15, 'days', 5000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', 'EQUIP-001', '33333333-3333-3333-3333-333333333333'),
('equip-002', 'Crane TATA-50T rental for steel installation', 'equipment', 120000.00, 20, 'days', 6000.00, '2024-03-05', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'approved', 'EQUIP-002', '33333333-3333-3333-3333-333333333333'),
('equip-003', 'Concrete mixer maintenance and repair', 'equipment', 35000.00, 1, 'service', 35000.00, '2024-03-10', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'approved', 'EQUIP-003', '33333333-3333-3333-3333-333333333333'),
('equip-004', 'Bulldozer rental for site preparation', 'equipment', 45000.00, 10, 'days', 4500.00, '2024-03-15', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'approved', 'EQUIP-004', '33333333-3333-3333-3333-333333333333'),
('equip-005', 'Welding equipment rental', 'equipment', 15000.00, 5, 'days', 3000.00, '2024-03-20', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'pending', 'EQUIP-005', '33333333-3333-3333-3333-333333333333'),
('equip-006', 'Compactor rental for road construction', 'equipment', 25000.00, 8, 'days', 3125.00, '2024-03-25', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'approved', 'EQUIP-006', '33333333-3333-3333-3333-333333333333'),

-- Equipment Fuel and Operational Costs
('equip-007', 'Diesel fuel for excavator operations', 'equipment', 18000.00, 200, 'liters', 90.00, '2024-03-12', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'approved', 'FUEL-001', '33333333-3333-3333-3333-333333333333'),
('equip-008', 'Hydraulic oil for crane maintenance', 'equipment', 8500.00, 50, 'liters', 170.00, '2024-03-18', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'approved', 'OIL-001', '33333333-3333-3333-3333-333333333333'),
('equip-009', 'Equipment insurance premium Q1 2024', 'equipment', 45000.00, 1, 'policy', 45000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, 'approved', 'INS-001', '33333333-3333-3333-3333-333333333333'),

-- Insert additional Transport Expenses
INSERT INTO expenses (id, description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, status, receipt_number, created_by) VALUES
-- Vehicle Rental and Logistics
('trans-001', 'Truck rental for cement delivery', 'transport', 8000.00, 4, 'trips', 2000.00, '2024-03-02', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'TRANS-001', '33333333-3333-3333-3333-333333333333'),
('trans-002', 'Delivery truck for steel materials', 'transport', 12000.00, 3, 'trips', 4000.00, '2024-03-08', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'TRANS-002', '33333333-3333-3333-3333-333333333333'),
('trans-003', 'Pickup truck rental for site visits', 'transport', 15000.00, 30, 'days', 500.00, '2024-03-01', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'TRANS-003', '33333333-3333-3333-3333-333333333333'),
('trans-004', 'Crane transport to site', 'transport', 25000.00, 1, 'trip', 25000.00, '2024-03-15', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'TRANS-004', '33333333-3333-3333-3333-333333333333'),

-- Fuel and Operational Costs
('trans-005', 'Diesel fuel for site vehicles', 'transport', 22000.00, 250, 'liters', 88.00, '2024-03-10', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'FUEL-002', '33333333-3333-3333-3333-333333333333'),
('trans-006', 'Petrol for pickup trucks', 'transport', 8500.00, 100, 'liters', 85.00, '2024-03-12', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'FUEL-003', '33333333-3333-3333-3333-333333333333'),
('trans-007', 'Vehicle maintenance and service', 'transport', 18000.00, 1, 'service', 18000.00, '2024-03-20', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'MAINT-001', '33333333-3333-3333-3333-333333333333'),

-- Driver and Labor Costs
('trans-008', 'Driver wages for March', 'transport', 45000.00, 1, 'month', 45000.00, '2024-03-31', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'WAGE-001', '33333333-3333-3333-3333-333333333333'),
('trans-009', 'Logistics coordinator fees', 'transport', 12000.00, 1, 'month', 12000.00, '2024-03-31', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'LOG-001', '33333333-3333-3333-3333-333333333333'),

-- Toll and Miscellaneous
('trans-010', 'Highway toll charges', 'transport', 3500.00, 1, 'month', 3500.00, '2024-03-31', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'TOLL-001', '33333333-3333-3333-3333-333333333333'),
('trans-011', 'Vehicle insurance premium', 'transport', 15000.00, 1, 'policy', 15000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'pending', 'INS-002', '33333333-3333-3333-3333-333333333333'),

-- Insert additional Utilities Expenses
INSERT INTO expenses (id, description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, status, receipt_number, created_by) VALUES
-- Electricity and Power
('util-001', 'Site electricity bill - March 2024', 'utilities', 25000.00, 1, 'month', 25000.00, '2024-03-31', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'ELEC-001', '33333333-3333-3333-3333-333333333333'),
('util-002', 'Temporary power connection setup', 'utilities', 15000.00, 1, 'connection', 15000.00, '2024-03-05', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'POWER-001', '33333333-3333-3333-3333-333333333333'),
('util-003', 'Generator fuel for backup power', 'utilities', 18000.00, 200, 'liters', 90.00, '2024-03-15', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'GEN-001', '33333333-3333-3333-3333-333333333333'),
('util-004', 'Electrical equipment rental', 'utilities', 12000.00, 1, 'month', 12000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'ELEC-002', '33333333-3333-3333-3333-333333333333'),

-- Water and Sanitation
('util-005', 'Water supply connection charges', 'utilities', 12000.00, 1, 'connection', 12000.00, '2024-03-08', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'WATER-001', '33333333-3333-3333-3333-333333333333'),
('util-006', 'Water tanker delivery', 'utilities', 8000.00, 10, 'tankers', 800.00, '2024-03-12', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'WATER-002', '33333333-3333-3333-3333-333333333333'),
('util-007', 'Portable toilet rental', 'utilities', 15000.00, 5, 'units', 3000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'SAN-001', '33333333-3333-3333-3333-333333333333'),

-- Communication and Internet
('util-008', 'Internet and communication setup', 'utilities', 20000.00, 1, 'setup', 20000.00, '2024-03-10', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'COMM-001', '33333333-3333-3333-3333-333333333333'),
('util-009', 'Mobile data and phone expenses', 'utilities', 5000.00, 1, 'month', 5000.00, '2024-03-31', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'MOBILE-001', '33333333-3333-3333-3333-333333333333'),
('util-010', 'Satellite communication for remote site', 'utilities', 25000.00, 1, 'month', 25000.00, '2024-03-01', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'SAT-001', '33333333-3333-3333-3333-333333333333'),

-- Security and Miscellaneous
('util-011', 'Security services for site', 'utilities', 30000.00, 1, 'month', 30000.00, '2024-03-01', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'approved', 'SEC-001', '33333333-3333-3333-3333-333333333333'),
('util-012', 'Site office setup and maintenance', 'utilities', 18000.00, 1, 'setup', 18000.00, '2024-03-15', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'approved', 'OFFICE-001', '33333333-3333-3333-3333-333333333333'),
('util-013', 'Waste disposal and cleaning services', 'utilities', 12000.00, 1, 'month', 12000.00, '2024-03-31', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'pending', 'WASTE-001', '33333333-3333-3333-3333-333333333333');

-- Update some existing expenses to have proper status and approval
UPDATE expenses SET status = 'approved', approved_by = '22222222-2222-2222-2222-222222222222', approved_at = '2024-03-01 10:00:00' WHERE category = 'equipment' AND status = 'pending';
UPDATE expenses SET status = 'approved', approved_by = '33333333-3333-3333-3333-333333333333', approved_at = '2024-03-01 11:00:00' WHERE category = 'transport' AND status = 'pending';
UPDATE expenses SET status = 'approved', approved_by = '22222222-2222-2222-2222-222222222222', approved_at = '2024-03-01 12:00:00' WHERE category = 'utilities' AND status = 'pending';
