-- Vehicle Refueling Table
CREATE TABLE IF NOT EXISTS vehicle_refueling (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    refueling_date DATE NOT NULL,
    mileage INTEGER NOT NULL,
    fuel_amount DECIMAL(10,2) NOT NULL,
    fuel_cost DECIMAL(12,2) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL DEFAULT 'Diesel',
    station_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Usage Table
CREATE TABLE IF NOT EXISTS vehicle_usage (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    start_mileage INTEGER NOT NULL,
    end_mileage INTEGER NOT NULL,
    distance INTEGER GENERATED ALWAYS AS (end_mileage - start_mileage) STORED,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    fuel_consumed DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_refueling_vehicle_id ON vehicle_refueling(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_refueling_date ON vehicle_refueling(refueling_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_usage_vehicle_id ON vehicle_usage(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_usage_date ON vehicle_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_usage_driver ON vehicle_usage(driver_name);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicle_refueling_updated_at 
    BEFORE UPDATE ON vehicle_refueling 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_usage_updated_at 
    BEFORE UPDATE ON vehicle_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (using actual vehicle UUIDs from the database)
-- Note: These will be inserted only if vehicles exist in the database
INSERT INTO vehicle_refueling (vehicle_id, refueling_date, mileage, fuel_amount, fuel_cost, fuel_type, station_name, notes) 
SELECT 
    v.id,
    '2024-01-15'::date,
    45000,
    50.0,
    3500.00,
    'Diesel',
    'HP Petrol Pump',
    'Full tank refill'
FROM vehicles v 
WHERE v.name = 'Excavator E-001' 
LIMIT 1;

INSERT INTO vehicle_refueling (vehicle_id, refueling_date, mileage, fuel_amount, fuel_cost, fuel_type, station_name, notes) 
SELECT 
    v.id,
    '2024-01-20'::date,
    45600,
    45.0,
    3150.00,
    'Diesel',
    'IOC Petrol Pump',
    'Partial refill'
FROM vehicles v 
WHERE v.name = 'Excavator E-001' 
LIMIT 1;

INSERT INTO vehicle_usage (vehicle_id, usage_date, start_mileage, end_mileage, start_location, end_location, purpose, driver_name, fuel_consumed, notes) 
SELECT 
    v.id,
    '2024-01-15'::date,
    45000,
    45080,
    'Construction Site A',
    'Material Depot',
    'Material Transport',
    'Rajesh Kumar',
    8.0,
    'Heavy load transport'
FROM vehicles v 
WHERE v.name = 'Excavator E-001' 
LIMIT 1;

INSERT INTO vehicle_usage (vehicle_id, usage_date, start_mileage, end_mileage, start_location, end_location, purpose, driver_name, fuel_consumed, notes) 
SELECT 
    v.id,
    '2024-01-16'::date,
    45080,
    45120,
    'Material Depot',
    'Construction Site B',
    'Material Delivery',
    'Rajesh Kumar',
    4.0,
    'Standard delivery'
FROM vehicles v 
WHERE v.name = 'Excavator E-001' 
LIMIT 1;
