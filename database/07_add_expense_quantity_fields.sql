-- =============================================
-- ADD QUANTITY AND PER-UNIT COST FIELDS TO EXPENSES
-- =============================================

-- Add quantity and per-unit cost fields to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS quantity DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS unit VARCHAR(20),
ADD COLUMN IF NOT EXISTS cost_per_unit DECIMAL(10,2);

-- Add comments to explain the new fields
COMMENT ON COLUMN expenses.quantity IS 'Quantity of items/services for this expense';
COMMENT ON COLUMN expenses.unit IS 'Unit of measurement (e.g., TON, KG, HOURS, etc.)';
COMMENT ON COLUMN expenses.cost_per_unit IS 'Cost per unit of the quantity';

-- Update existing expenses to have default values
-- For expenses that don't have quantity, we'll set quantity = 1 and cost_per_unit = amount
UPDATE expenses 
SET 
  quantity = 1,
  unit = 'UNIT',
  cost_per_unit = amount
WHERE quantity IS NULL OR cost_per_unit IS NULL;

-- Make the new fields NOT NULL with defaults
ALTER TABLE expenses 
ALTER COLUMN quantity SET DEFAULT 1,
ALTER COLUMN unit SET DEFAULT 'UNIT',
ALTER COLUMN cost_per_unit SET DEFAULT 0;

-- Update the constraints to make them NOT NULL
ALTER TABLE expenses 
ALTER COLUMN quantity SET NOT NULL,
ALTER COLUMN unit SET NOT NULL,
ALTER COLUMN cost_per_unit SET NOT NULL;
