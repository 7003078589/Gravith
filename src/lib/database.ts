import { Pool } from 'pg';
import { dbConfig } from '@/config/database';

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Generic query function
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Database helper functions
export const db = {
  // Sites
  getSites: async () => {
    const result = await query('SELECT * FROM sites ORDER BY created_at DESC');
    return result.rows;
  },
  
  getSiteById: async (id: string) => {
    const result = await query('SELECT * FROM sites WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  createSite: async (siteData: any) => {
    const { name, location, status, budget, client_id, manager_id, start_date, end_date, description } = siteData;
    const result = await query(
      'INSERT INTO sites (name, location, status, budget, client_id, manager_id, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, location, status, budget, client_id, manager_id, start_date, end_date, description]
    );
    return result.rows[0];
  },
  
  updateSite: async (id: string, siteData: any) => {
    const { name, location, status, budget, client_id, manager_id, start_date, end_date, description } = siteData;
    const result = await query(
      'UPDATE sites SET name = $1, location = $2, status = $3, budget = $4, client_id = $5, manager_id = $6, start_date = $7, end_date = $8, description = $9 WHERE id = $10 RETURNING *',
      [name, location, status, budget, client_id, manager_id, start_date, end_date, description, id]
    );
    return result.rows[0];
  },

  deleteSite: async (id: string) => {
    const result = await query('DELETE FROM sites WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  },


  // Materials
  getMaterials: async () => {
    const result = await query('SELECT * FROM materials ORDER BY created_at DESC');
    return result.rows;
  },
  
  getMaterialsBySite: async (siteId: string) => {
    const result = await query('SELECT * FROM materials WHERE site_id = $1', [siteId]);
    return result.rows;
  },
  
  createMaterial: async (materialData: any) => {
    const { name, category, quantity, unit, cost_per_unit, supplier_id, site_id, purchase_date, min_threshold, quality_grade, batch_number } = materialData;
    const result = await query(
      'INSERT INTO materials (name, category, quantity, unit, cost_per_unit, supplier_id, site_id, purchase_date, min_threshold, quality_grade, batch_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, category, quantity, unit, cost_per_unit, supplier_id, site_id, purchase_date, min_threshold, quality_grade, batch_number]
    );
    return result.rows[0];
  },

  // Expenses
  getExpenses: async () => {
    const result = await query(`
      SELECT 
        id,
        description,
        category,
        amount::numeric,
        quantity::numeric,
        unit,
        cost_per_unit::numeric,
        TO_CHAR(expense_date, 'DD/MM/YYYY') as date,
        site_id as "siteId",
        vendor_id as vendor,
        status,
        receipt_number as "receiptNumber",
        approved_by as "approvedBy"
      FROM expenses 
      ORDER BY expense_date DESC
    `);
    return result.rows;
  },
  
  getExpensesBySite: async (siteId: string) => {
    const result = await query(`
      SELECT 
        id,
        description,
        category,
        amount::numeric,
        quantity::numeric,
        unit,
        cost_per_unit::numeric,
        TO_CHAR(expense_date, 'DD/MM/YYYY') as date,
        site_id as "siteId",
        vendor_id as vendor,
        status,
        receipt_number as "receiptNumber",
        approved_by as "approvedBy"
      FROM expenses 
      WHERE site_id = $1 
      ORDER BY expense_date DESC
    `, [siteId]);
    return result.rows;
  },
  
  createExpense: async (expenseData: any) => {
    const { description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, vehicle_id, material_id, labour_id, status, created_by } = expenseData;
    const result = await query(
      'INSERT INTO expenses (description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, vehicle_id, material_id, labour_id, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [description, category, amount, quantity, unit, cost_per_unit, expense_date, site_id, vendor_id, vehicle_id, material_id, labour_id, status, created_by]
    );
    return result.rows[0];
  },

  // Vendors
  getVendors: async () => {
    const result = await query('SELECT * FROM vendors ORDER BY created_at DESC');
    return result.rows;
  },
  
  createVendor: async (vendorData: any) => {
    const { name, type, contact_person, email, phone, address, city, state, pincode, gst_number, rating } = vendorData;
    const result = await query(
      'INSERT INTO vendors (name, type, contact_person, email, phone, address, city, state, pincode, gst_number, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, type, contact_person, email, phone, address, city, state, pincode, gst_number, rating]
    );
    return result.rows[0];
  },

  // Vehicles
  getVehicles: async () => {
    const result = await query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows;
  },
  
  getVehiclesBySite: async (siteId: string) => {
    const result = await query('SELECT * FROM vehicles WHERE site_id = $1 ORDER BY created_at DESC', [siteId]);
    return result.rows;
  },
  
  createVehicle: async (vehicleData: any) => {
    const { name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price, warranty_expiry, insurance_expiry } = vehicleData;
    const result = await query(
      'INSERT INTO vehicles (name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price, warranty_expiry, insurance_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price, warranty_expiry, insurance_expiry]
    );
    return result.rows[0];
  },
  
  updateVehicle: async (id: string, vehicleData: any) => {
    const { name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price, warranty_expiry, insurance_expiry } = vehicleData;
    const result = await query(
      'UPDATE vehicles SET name = $1, type = $2, registration_number = $3, status = $4, location = $5, fuel_level = $6, last_service_date = $7, next_service_date = $8, operator_id = $9, site_id = $10, vendor_id = $11, purchase_date = $12, purchase_price = $13, warranty_expiry = $14, insurance_expiry = $15, updated_at = CURRENT_TIMESTAMP WHERE id = $16 RETURNING *',
      [name, type, registration_number, status, location, fuel_level, last_service_date, next_service_date, operator_id, site_id, vendor_id, purchase_date, purchase_price, warranty_expiry, insurance_expiry, id]
    );
    return result.rows[0];
  },
  
  deleteVehicle: async (id: string) => {
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
    return result.rowCount;
  },

  // Labour
  getLabour: async () => {
    const result = await query('SELECT * FROM labour ORDER BY created_at DESC');
    return result.rows;
  },
  
  getLabourBySite: async (siteId: string) => {
    const result = await query('SELECT * FROM labour WHERE site_id = $1', [siteId]);
    return result.rows;
  },
  
  createLabour: async (labourData: any) => {
    const { name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, aadhar_number, join_date, site_id, contractor_id } = labourData;
    const result = await query(
      'INSERT INTO labour (name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, aadhar_number, join_date, site_id, contractor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, skill, experience_years, wage_per_day, wage_per_hour, phone, address, aadhar_number, join_date, site_id, contractor_id]
    );
    return result.rows[0];
  },

  // Activities
  getActivities: async () => {
    const result = await query('SELECT * FROM activities ORDER BY created_at DESC');
    return result.rows;
  },
  
  getActivitiesBySite: async (siteId: string) => {
    const result = await query('SELECT * FROM activities WHERE site_id = $1', [siteId]);
    return result.rows;
  },
  
  createActivity: async (activityData: any) => {
    const { name, description, activity_type, start_date, end_date, planned_duration, status, priority, site_id, assigned_to, estimated_cost } = activityData;
    const result = await query(
      'INSERT INTO activities (name, description, activity_type, start_date, end_date, planned_duration, status, priority, site_id, assigned_to, estimated_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, description, activity_type, start_date, end_date, planned_duration, status, priority, site_id, assigned_to, estimated_cost]
    );
    return result.rows[0];
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const result = await query('SELECT * FROM dashboard_stats');
    return result.rows[0];
  },

  // Site Summary with relationships
  getSiteSummary: async () => {
    const result = await query('SELECT * FROM site_summary ORDER BY created_at DESC');
    return result.rows;
  },

  // Utility functions
  getSuggestedMaterials: async (activityType: string) => {
    const result = await query('SELECT * FROM get_suggested_materials($1)', [activityType]);
    return result.rows;
  },
  
  getSuggestedVehicles: async (activityType: string) => {
    const result = await query('SELECT * FROM get_suggested_vehicles($1)', [activityType]);
    return result.rows;
  },
  
  getSuggestedSkills: async (activityType: string) => {
    const result = await query('SELECT * FROM get_suggested_skills($1)', [activityType]);
    return result.rows;
  },
  
  calculateVehicleRentalCost: async (perDayCost: number, perHourCost: number, startDate: string, endDate: string, dieselCostPerLiter: number) => {
    const result = await query('SELECT calculate_vehicle_rental_cost($1, $2, $3, $4, $5) as total_cost', [perDayCost, perHourCost, startDate, endDate, dieselCostPerLiter]);
    return result.rows[0].total_cost;
  },
};

export default pool;
