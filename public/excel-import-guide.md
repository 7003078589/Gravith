# Excel Import Guide

## 📋 How to Prepare Your Excel Files

### 📁 File Structure
Your Excel file should contain separate sheets for different data types. Each sheet should be named exactly as shown below:

### 🏗️ **Sites Sheet**
Required columns for construction sites:
- `name` or `site_name` or `project_name` - Site name (required)
- `location` or `address` - Site address (required)
- `status` - active/inactive (default: active)
- `progress` or `completion` - Progress percentage (0-100)
- `budget` or `total_budget` - Total budget amount
- `spent` or `amount_spent` - Amount already spent
- `client` or `client_name` - Client name
- `manager` or `project_manager` - Project manager name
- `start_date` or `project_start` - Project start date (YYYY-MM-DD)
- `end_date` or `project_end` - Project end date (YYYY-MM-DD)

### 🚛 **Vehicles Sheet**
Required columns for vehicles and equipment:
- `type` or `vehicle_type` or `equipment_type` - Vehicle type (required)
- `make` or `brand` - Vehicle make/brand
- `model` - Vehicle model
- `year` - Manufacturing year
- `registration_number` or `reg_number` or `plate_number` - Registration number
- `capacity` or `load_capacity` - Load capacity
- `fuel_type` or `fuel` - Fuel type (default: diesel)
- `per_day_cost` or `daily_rate` - Cost per day
- `per_hour_cost` or `hourly_rate` - Cost per hour
- `status` - available/rented/maintenance (default: available)
- `site_id` - Associated site ID (optional)

### 📦 **Materials Sheet**
Required columns for materials:
- `name` or `material_name` or `item_name` - Material name (required)
- `category` or `material_category` - Material category
- `unit` or `measurement_unit` - Unit of measurement (kg, bags, etc.)
- `quantity` or `qty` - Quantity
- `unit_price` or `price_per_unit` - Price per unit
- `total_cost` or `total_price` - Total cost
- `supplier` or `vendor` or `supplier_name` - Supplier name
- `purchase_date` or `date_purchased` - Purchase date (YYYY-MM-DD)
- `site_id` - Associated site ID (optional)

### 💰 **Expenses Sheet**
Required columns for expenses:
- `description` or `expense_description` or `purpose` - Expense description (required)
- `amount` or `expense_amount` - Expense amount (required)
- `category` or `expense_category` - Expense category
- `date` or `expense_date` or `transaction_date` - Expense date (YYYY-MM-DD)
- `site_id` - Associated site ID (optional)
- `vendor_id` - Associated vendor ID (optional)

### 👷 **Labour Sheet**
Required columns for labour:
- `name` or `worker_name` or `labour_name` - Worker name (required)
- `skill` or `skill_type` or `specialization` - Worker skill (required)
- `phone` or `contact_number` or `phone_number` - Contact number
- `wage_per_day` or `daily_wage` or `rate_per_day` - Daily wage
- `join_date` or `start_date` or `date_joined` - Join date (YYYY-MM-DD)
- `status` - active/inactive (default: active)
- `site_id` - Associated site ID (optional)

### 🏪 **Vendors Sheet**
Required columns for vendors:
- `name` or `vendor_name` or `company_name` - Vendor name (required)
- `contact_person` or `contact_name` - Contact person
- `phone` or `contact_phone` or `phone_number` - Phone number
- `email` or `contact_email` - Email address
- `address` or `location` - Address
- `specialization` or `service_type` or `category` - Specialization
- `rating` - Rating (1-5, default: 5)
- `status` - active/inactive (default: active)

## 📝 **Important Notes:**

1. **Sheet Names**: Must match exactly (case-sensitive): Sites, Vehicles, Materials, Expenses, Labour, Vendors
2. **Required Fields**: Marked with (required) - these must have values
3. **Date Format**: Use YYYY-MM-DD format (e.g., 2024-01-15)
4. **Numeric Fields**: Should contain only numbers
5. **Optional Sheets**: You don't need all sheets - include only what you want to import
6. **File Size**: Maximum 10MB
7. **File Format**: .xlsx or .xls files only

## 🔄 **Import Process:**

1. Prepare your Excel file with the correct sheet names and column headers
2. Go to the Data Import page in the application
3. Upload your Excel file by dragging and dropping or clicking "Choose File"
4. Review the import results and any error messages
5. Check your data in the respective management pages

## 🆘 **Troubleshooting:**

- **Missing required fields**: Check that all required columns have data
- **Invalid date format**: Ensure dates are in YYYY-MM-DD format
- **Sheet name errors**: Verify sheet names match exactly
- **Data type errors**: Ensure numeric fields contain only numbers

## 📞 **Need Help?**

If you encounter issues, check the error messages displayed after import. They will guide you to specific problems in your Excel file.
