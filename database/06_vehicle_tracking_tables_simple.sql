-- Simple script to create vehicle tracking tables
-- Run this if the previous script didn't work completely

-- Drop tables if they exist (for clean recreation)
DROP TABLE IF EXISTS vehicle_usage CASCADE;
DROP TABLE IF EXISTS vehicle_refueling CASCADE;

-- Vehicle Refueling Table
CREATE TABLE vehicle_refueling (
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
CREATE TABLE vehicle_usage (
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

-- Create indexes for better performance
CREATE INDEX idx_vehicle_refueling_vehicle_id ON vehicle_refueling(vehicle_id);
CREATE INDEX idx_vehicle_refueling_date ON vehicle_refueling(refueling_date);
CREATE INDEX idx_vehicle_usage_vehicle_id ON vehicle_usage(vehicle_id);
CREATE INDEX idx_vehicle_usage_date ON vehicle_usage(usage_date);
CREATE INDEX idx_vehicle_usage_driver ON vehicle_usage(driver_name);

-- Create update triggers
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

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('vehicle_refueling', 'vehicle_usage')
ORDER BY table_name, ordinal_position;
