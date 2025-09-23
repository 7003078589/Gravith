# 🏗️ Gravith Construction Management Database

Complete PostgreSQL database schema for the Gravith Construction Management System.

## 📁 Database Files

1. **`01_create_tables.sql`** - Main table definitions
2. **`02_create_indexes.sql`** - Performance optimization indexes
3. **`03_create_triggers.sql`** - Data validation and auto-update triggers
4. **`04_seed_data.sql`** - Sample data for testing
5. **`05_views_and_functions.sql`** - Views and utility functions

## 🚀 Quick Setup

### Step 1: Create Database
```sql
-- In pgAdmin, create a new database
CREATE DATABASE gravith_db;
```

### Step 2: Run Scripts in Order
```bash
# Connect to your database in pgAdmin and run these in sequence:

1. 01_create_tables.sql
2. 02_create_indexes.sql  
3. 03_create_triggers.sql
4. 04_seed_data.sql
5. 05_views_and_functions.sql
```

## 📊 Database Schema Overview

### Core Tables
- **`users`** - System users (admin, manager, supervisor, operator)
- **`clients`** - Construction clients
- **`sites`** - Construction sites/projects
- **`vendors`** - Suppliers, contractors, service providers
- **`vehicles`** - Equipment and vehicles
- **`materials`** - Construction materials inventory
- **`labour`** - Workers and their skills
- **`expenses`** - All financial transactions
- **`payments`** - Client payments and invoices
- **`activities`** - Project activities/milestones
- **`vehicle_rentals`** - Vehicle rental tracking

### Supporting Tables
- **`site_equipment_suggestions`** - Equipment suggestions per site
- **`audit_log`** - Change tracking
- **`system_settings`** - System configuration

## 🔧 Key Features

### 1. **Form Interconnections**
- Auto-expense creation from materials, vehicles, labour
- Real-time cost calculations
- Site-vehicle compatibility validation
- Timeline synchronization

### 2. **Smart Suggestions**
- Material suggestions based on activity type
- Vehicle type recommendations
- Skill requirements for activities
- Equipment compatibility checks

### 3. **Financial Tracking**
- Real-time budget vs spent calculations
- Category-wise expense breakdown
- Vendor payment tracking
- Invoice management

### 4. **Resource Management**
- Vehicle utilization tracking
- Material inventory with low-stock alerts
- Labour skill matching
- Equipment maintenance scheduling

## 📈 Views Available

- **`dashboard_stats`** - Key metrics for dashboard
- **`site_summary`** - Complete site information
- **`expense_summary`** - Detailed expense data
- **`vehicle_utilization`** - Vehicle status and usage
- **`material_inventory`** - Stock levels and alerts

## 🛠️ Utility Functions

- **`get_site_expenses_by_category()`** - Expense breakdown by category
- **`calculate_vehicle_rental_cost()`** - Rental cost calculation
- **`get_suggested_materials()`** - Material suggestions for activities
- **`get_suggested_vehicles()`** - Vehicle recommendations
- **`get_suggested_skills()`** - Required skills for activities
- **`validate_date_within_site_period()`** - Date validation
- **`sync_activity_dates_with_vehicle_rental()`** - Timeline sync

## 🔄 Triggers

- **Auto-update timestamps** on record changes
- **Audit logging** for all data changes
- **Site spent amount** updates when expenses change
- **Site progress** updates based on completed activities
- **Vendor order count** updates
- **Vehicle assignment validation**

## 📝 Sample Data

The seed data includes:
- 4 sample users with different roles
- 3 construction clients
- 4 vendors (suppliers, contractors, equipment rental)
- 3 active construction sites
- 3 vehicles with different types
- 4 material types with inventory
- 3 labour workers with different skills
- Sample expenses, payments, and activities

## 🔍 Testing Queries

```sql
-- Get dashboard statistics
SELECT * FROM dashboard_stats;

-- Get site summary with client info
SELECT * FROM site_summary WHERE status = 'active';

-- Get expenses by category for a site
SELECT * FROM get_site_expenses_by_category('11111111-1111-1111-1111-111111111111');

-- Get vehicle utilization
SELECT * FROM vehicle_utilization WHERE status = 'active';

-- Get material inventory status
SELECT * FROM material_inventory WHERE stock_status = 'Critical';
```

## 🚨 Important Notes

1. **UUID Extension**: Make sure `uuid-ossp` extension is enabled
2. **Foreign Keys**: All relationships are properly defined with constraints
3. **Data Types**: Uses appropriate PostgreSQL data types
4. **Indexes**: Optimized for common query patterns
5. **Triggers**: Maintain data integrity and auto-calculations

## 🔗 Frontend Integration

This database schema directly supports all the form interconnections implemented in your frontend:

- ✅ Site-Vehicle interconnections
- ✅ Material cost calculations
- ✅ Expense auto-creation
- ✅ Timeline synchronization
- ✅ Resource suggestions
- ✅ Real-time validation

## 📞 Support

For any issues with the database setup, check:
1. PostgreSQL version compatibility (12+)
2. Extension availability
3. User permissions
4. Foreign key constraints

---

**Ready to connect your frontend to this database!** 🚀
