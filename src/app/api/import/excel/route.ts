import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { query } from '@/lib/database';

export const dynamic = 'force-dynamic';

interface ExcelData {
  sites?: any[];
  vehicles?: any[];
  materials?: any[];
  expenses?: any[];
  labour?: any[];
  vendors?: any[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if file is Excel format
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      return NextResponse.json({ error: 'Please upload an Excel file (.xlsx or .xls)' }, { status: 400 });
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    
    const results: ExcelData = {};
    const errors: string[] = [];

    // Process each worksheet
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`Processing sheet: ${sheetName} with ${data.length} rows`);

      try {
        switch (sheetName.toLowerCase()) {
          case 'sites':
            results.sites = await processSitesData(data);
            break;
          case 'vehicles':
            results.vehicles = await processVehiclesData(data);
            break;
          case 'materials':
            results.materials = await processMaterialsData(data);
            break;
          case 'expenses':
            results.expenses = await processExpensesData(data);
            break;
          case 'labour':
            results.labour = await processLabourData(data);
            break;
          case 'vendors':
            results.vendors = await processVendorsData(data);
            break;
          default:
            console.log(`Unknown sheet: ${sheetName}`);
        }
      } catch (error) {
        errors.push(`Error processing ${sheetName}: ${error}`);
        console.error(`Error processing sheet ${sheetName}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Excel file processed successfully',
      results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        sites: results.sites?.length || 0,
        vehicles: results.vehicles?.length || 0,
        materials: results.materials?.length || 0,
        expenses: results.expenses?.length || 0,
        labour: results.labour?.length || 0,
        vendors: results.vendors?.length || 0,
      }
    });

  } catch (error) {
    console.error('Excel import error:', error);
    return NextResponse.json({ 
      error: 'Failed to process Excel file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Process Sites data
async function processSitesData(data: any[]) {
  const sites = [];
  
  for (const row of data) {
    try {
      const site = {
        id: generateUUID(),
        name: row.name || row.site_name || row.project_name,
        location: row.location || row.address,
        status: (row.status || 'active').toLowerCase(),
        progress: parseFloat(row.progress || row.completion || '0'),
        budget: parseFloat(row.budget || row.total_budget || '0'),
        spent: parseFloat(row.spent || row.amount_spent || '0'),
        client: row.client || row.client_name,
        manager: row.manager || row.project_manager,
        start_date: formatDate(row.start_date || row.start_date || row.project_start),
        end_date: formatDate(row.end_date || row.end_date || row.project_end),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Validate required fields
      if (!site.name || !site.location) {
        throw new Error(`Missing required fields for site: ${JSON.stringify(row)}`);
      }

      // Insert into database
      await query(`
        INSERT INTO sites (id, name, location, status, progress, budget, spent, client, manager, start_date, end_date, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          location = EXCLUDED.location,
          status = EXCLUDED.status,
          progress = EXCLUDED.progress,
          budget = EXCLUDED.budget,
          spent = EXCLUDED.spent,
          client = EXCLUDED.client,
          manager = EXCLUDED.manager,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          updated_at = EXCLUDED.updated_at
      `, [
        site.id, site.name, site.location, site.status, site.progress,
        site.budget, site.spent, site.client, site.manager,
        site.start_date, site.end_date, site.created_at, site.updated_at
      ]);

      sites.push(site);
    } catch (error) {
      console.error(`Error processing site row:`, error);
      throw error;
    }
  }
  
  return sites;
}

// Process Vehicles data
async function processVehiclesData(data: any[]) {
  const vehicles = [];
  
  for (const row of data) {
    try {
      const vehicle = {
        id: generateUUID(),
        type: row.type || row.vehicle_type || row.equipment_type,
        make: row.make || row.brand,
        model: row.model,
        year: parseInt(row.year || '0'),
        registration_number: row.registration_number || row.reg_number || row.plate_number,
        capacity: parseFloat(row.capacity || row.load_capacity || '0'),
        fuel_type: row.fuel_type || row.fuel || 'diesel',
        per_day_cost: parseFloat(row.per_day_cost || row.daily_rate || '0'),
        per_hour_cost: parseFloat(row.per_hour_cost || row.hourly_rate || '0'),
        status: (row.status || 'available').toLowerCase(),
        site_id: row.site_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!vehicle.type) {
        throw new Error(`Missing required fields for vehicle: ${JSON.stringify(row)}`);
      }

      await query(`
        INSERT INTO vehicles (id, type, make, model, year, registration_number, capacity, fuel_type, per_day_cost, per_hour_cost, status, site_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          type = EXCLUDED.type,
          make = EXCLUDED.make,
          model = EXCLUDED.model,
          year = EXCLUDED.year,
          registration_number = EXCLUDED.registration_number,
          capacity = EXCLUDED.capacity,
          fuel_type = EXCLUDED.fuel_type,
          per_day_cost = EXCLUDED.per_day_cost,
          per_hour_cost = EXCLUDED.per_hour_cost,
          status = EXCLUDED.status,
          site_id = EXCLUDED.site_id,
          updated_at = EXCLUDED.updated_at
      `, [
        vehicle.id, vehicle.type, vehicle.make, vehicle.model, vehicle.year,
        vehicle.registration_number, vehicle.capacity, vehicle.fuel_type,
        vehicle.per_day_cost, vehicle.per_hour_cost, vehicle.status, vehicle.site_id,
        vehicle.created_at, vehicle.updated_at
      ]);

      vehicles.push(vehicle);
    } catch (error) {
      console.error(`Error processing vehicle row:`, error);
      throw error;
    }
  }
  
  return vehicles;
}

// Process Materials data
async function processMaterialsData(data: any[]) {
  const materials = [];
  
  for (const row of data) {
    try {
      const material = {
        id: generateUUID(),
        name: row.name || row.material_name || row.item_name,
        category: row.category || row.material_category || 'Construction',
        unit: row.unit || row.measurement_unit || 'kg',
        quantity: parseFloat(row.quantity || row.qty || '0'),
        unit_price: parseFloat(row.unit_price || row.price_per_unit || '0'),
        total_cost: parseFloat(row.total_cost || row.total_price || '0'),
        supplier: row.supplier || row.vendor || row.supplier_name,
        purchase_date: formatDate(row.purchase_date || row.date_purchased),
        site_id: row.site_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!material.name) {
        throw new Error(`Missing required fields for material: ${JSON.stringify(row)}`);
      }

      await query(`
        INSERT INTO materials (id, name, category, unit, quantity, unit_price, total_cost, supplier, purchase_date, site_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          unit = EXCLUDED.unit,
          quantity = EXCLUDED.quantity,
          unit_price = EXCLUDED.unit_price,
          total_cost = EXCLUDED.total_cost,
          supplier = EXCLUDED.supplier,
          purchase_date = EXCLUDED.purchase_date,
          site_id = EXCLUDED.site_id,
          updated_at = EXCLUDED.updated_at
      `, [
        material.id, material.name, material.category, material.unit,
        material.quantity, material.unit_price, material.total_cost,
        material.supplier, material.purchase_date, material.site_id,
        material.created_at, material.updated_at
      ]);

      materials.push(material);
    } catch (error) {
      console.error(`Error processing material row:`, error);
      throw error;
    }
  }
  
  return materials;
}

// Process Expenses data
async function processExpensesData(data: any[]) {
  const expenses = [];
  
  for (const row of data) {
    try {
      const expense = {
        id: generateUUID(),
        description: row.description || row.expense_description || row.purpose,
        amount: parseFloat(row.amount || row.expense_amount || '0'),
        category: row.category || row.expense_category || 'Other',
        date: formatDate(row.date || row.expense_date || row.transaction_date),
        site_id: row.site_id || null,
        vendor_id: row.vendor_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!expense.description || !expense.amount) {
        throw new Error(`Missing required fields for expense: ${JSON.stringify(row)}`);
      }

      await query(`
        INSERT INTO expenses (id, description, amount, category, date, site_id, vendor_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          description = EXCLUDED.description,
          amount = EXCLUDED.amount,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          site_id = EXCLUDED.site_id,
          vendor_id = EXCLUDED.vendor_id,
          updated_at = EXCLUDED.updated_at
      `, [
        expense.id, expense.description, expense.amount, expense.category,
        expense.date, expense.site_id, expense.vendor_id,
        expense.created_at, expense.updated_at
      ]);

      expenses.push(expense);
    } catch (error) {
      console.error(`Error processing expense row:`, error);
      throw error;
    }
  }
  
  return expenses;
}

// Process Labour data
async function processLabourData(data: any[]) {
  const labour = [];
  
  for (const row of data) {
    try {
      const labourData = {
        id: generateUUID(),
        name: row.name || row.worker_name || row.labour_name,
        skill: row.skill || row.skill_type || row.specialization,
        phone: row.phone || row.contact_number || row.phone_number,
        wage_per_day: parseFloat(row.wage_per_day || row.daily_wage || row.rate_per_day || '0'),
        join_date: formatDate(row.join_date || row.start_date || row.date_joined),
        status: (row.status || 'active').toLowerCase(),
        site_id: row.site_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!labourData.name || !labourData.skill) {
        throw new Error(`Missing required fields for labour: ${JSON.stringify(row)}`);
      }

      await query(`
        INSERT INTO labour (id, name, skill, phone, wage_per_day, join_date, status, site_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          skill = EXCLUDED.skill,
          phone = EXCLUDED.phone,
          wage_per_day = EXCLUDED.wage_per_day,
          join_date = EXCLUDED.join_date,
          status = EXCLUDED.status,
          site_id = EXCLUDED.site_id,
          updated_at = EXCLUDED.updated_at
      `, [
        labourData.id, labourData.name, labourData.skill, labourData.phone,
        labourData.wage_per_day, labourData.join_date, labourData.status, labourData.site_id,
        labourData.created_at, labourData.updated_at
      ]);

      labour.push(labourData);
    } catch (error) {
      console.error(`Error processing labour row:`, error);
      throw error;
    }
  }
  
  return labour;
}

// Process Vendors data
async function processVendorsData(data: any[]) {
  const vendors = [];
  
  for (const row of data) {
    try {
      const vendor = {
        id: generateUUID(),
        name: row.name || row.vendor_name || row.company_name,
        contact_person: row.contact_person || row.contact_name,
        phone: row.phone || row.contact_phone || row.phone_number,
        email: row.email || row.contact_email,
        address: row.address || row.location,
        specialization: row.specialization || row.service_type || row.category,
        rating: parseFloat(row.rating || '5'),
        status: (row.status || 'active').toLowerCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (!vendor.name) {
        throw new Error(`Missing required fields for vendor: ${JSON.stringify(row)}`);
      }

      await query(`
        INSERT INTO vendors (id, name, contact_person, phone, email, address, specialization, rating, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          contact_person = EXCLUDED.contact_person,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          address = EXCLUDED.address,
          specialization = EXCLUDED.specialization,
          rating = EXCLUDED.rating,
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
      `, [
        vendor.id, vendor.name, vendor.contact_person, vendor.phone,
        vendor.email, vendor.address, vendor.specialization, vendor.rating,
        vendor.status, vendor.created_at, vendor.updated_at
      ]);

      vendors.push(vendor);
    } catch (error) {
      console.error(`Error processing vendor row:`, error);
      throw error;
    }
  }
  
  return vendors;
}

// Helper functions
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDate(dateInput: any): string | null {
  if (!dateInput) return null;
  
  try {
    let date: Date;
    
    if (typeof dateInput === 'string') {
      // Handle various date formats
      if (dateInput.includes('/')) {
        // DD/MM/YYYY or MM/DD/YYYY
        const parts = dateInput.split('/');
        if (parts.length === 3) {
          // Assume DD/MM/YYYY format
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        } else {
          date = new Date(dateInput);
        }
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === 'number') {
      // Excel date serial number
      date = new Date((dateInput - 25569) * 86400 * 1000);
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateInput}`);
      return null;
    }
    
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch (error) {
    console.warn(`Error formatting date ${dateInput}:`, error);
    return null;
  }
}
