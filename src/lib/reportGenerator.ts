import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  title: string;
  dateRange?: {
    from: string;
    to: string;
  };
  month?: string;
  site?: string;
  materials?: any[];
  expenses?: any[];
  vehicles?: any[];
  labour?: any[];
  summary?: {
    totalMaterials: number;
    totalExpenses: number;
    totalVehicles: number;
    totalLabour: number;
  };
}

export class ReportGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  // Generate PDF report from data
  generatePDFReport(data: ReportData): void {
    try {
      this.doc = new jsPDF();
      
      // Add header
      this.addHeader(data.title);
      
      // Add date range or month info
      if (data.dateRange) {
        this.addDateRange(data.dateRange.from, data.dateRange.to);
      } else if (data.month) {
        this.addMonthInfo(data.month);
      }
      
      // Add site info if specified
      if (data.site) {
        this.addSiteInfo(data.site);
      }
      
      // Add summary
      if (data.summary) {
        this.addSummary(data.summary);
      }
      
      // Add materials section
      if (data.materials && data.materials.length > 0) {
        this.addMaterialsSection(data.materials);
      } else {
        this.addNoDataSection('Materials', 'No materials data available for the selected period.');
      }
      
      // Add expenses section
      if (data.expenses && data.expenses.length > 0) {
        this.addExpensesSection(data.expenses);
      } else {
        this.addNoDataSection('Expenses', 'No expenses data available for the selected period.');
      }
      
      // Add vehicles section
      if (data.vehicles && data.vehicles.length > 0) {
        this.addVehiclesSection(data.vehicles);
      } else {
        this.addNoDataSection('Vehicles', 'No vehicles data available for the selected period.');
      }
      
      // Add labour section
      if (data.labour && data.labour.length > 0) {
        this.addLabourSection(data.labour);
      } else {
        this.addNoDataSection('Labour', 'No labour data available for the selected period.');
      }
      
      // Add footer
      this.addFooter();
      
      // Save the PDF
      const fileName = this.generateFileName(data);
      this.doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private addHeader(title: string): void {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, 30);
    
    // Add company info
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Gravith Construction System', 20, 45);
    this.doc.text('Construction Management Report', 20, 55);
    
    // Add line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 65, 190, 65);
  }

  private addDateRange(from: string, to: string): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Report Period:', 20, 80);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`From: ${from}`, 20, 90);
    this.doc.text(`To: ${to}`, 20, 100);
  }

  private addMonthInfo(month: string): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Report Month:', 20, 80);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(month, 20, 90);
  }

  private addSiteInfo(site: string): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Site:', 20, 110);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(site, 20, 120);
  }

  private addSummary(summary: any): void {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Summary', 20, 140);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Total Materials: ${summary.totalMaterials}`, 20, 155);
    this.doc.text(`Total Expenses: ₹${summary.totalExpenses.toLocaleString()}`, 20, 165);
    this.doc.text(`Total Vehicles: ${summary.totalVehicles}`, 20, 175);
    this.doc.text(`Total Labour: ${summary.totalLabour}`, 20, 185);
  }

  private addMaterialsSection(materials: any[]): void {
    let yPosition = 200;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Materials', 20, yPosition);
    yPosition += 15;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Name', 20, yPosition);
    this.doc.text('Category', 60, yPosition);
    this.doc.text('Quantity', 100, yPosition);
    this.doc.text('Unit', 130, yPosition);
    this.doc.text('Cost/Unit', 150, yPosition);
    this.doc.text('Total Cost', 180, yPosition);
    yPosition += 10;
    
    this.doc.setFont('helvetica', 'normal');
    materials.forEach((material, index) => {
      if (yPosition > 280) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(material.name || 'N/A', 20, yPosition);
      this.doc.text(material.category || 'N/A', 60, yPosition);
      this.doc.text((material.quantity || 0).toString(), 100, yPosition);
      this.doc.text(material.unit || 'N/A', 130, yPosition);
      this.doc.text(`₹${(material.cost_per_unit || 0).toLocaleString()}`, 150, yPosition);
      this.doc.text(`₹${((material.quantity || 0) * (material.cost_per_unit || 0)).toLocaleString()}`, 180, yPosition);
      yPosition += 10;
    });
  }

  private addExpensesSection(expenses: any[]): void {
    let yPosition = this.doc.internal.pageSize.height - 50;
    
    // Check if we need a new page
    if (yPosition < 100) {
      this.doc.addPage();
      yPosition = 20;
    }
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Expenses', 20, yPosition);
    yPosition += 15;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Date', 20, yPosition);
    this.doc.text('Category', 50, yPosition);
    this.doc.text('Description', 90, yPosition);
    this.doc.text('Amount', 150, yPosition);
    this.doc.text('Vendor', 180, yPosition);
    yPosition += 10;
    
    this.doc.setFont('helvetica', 'normal');
    expenses.forEach((expense, index) => {
      if (yPosition > 280) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(expense.date || 'N/A', 20, yPosition);
      this.doc.text(expense.category || 'N/A', 50, yPosition);
      this.doc.text((expense.description || 'N/A').substring(0, 20), 90, yPosition);
      this.doc.text(`₹${(expense.amount || 0).toLocaleString()}`, 150, yPosition);
      this.doc.text(expense.vendor || 'N/A', 180, yPosition);
      yPosition += 10;
    });
  }

  private addVehiclesSection(vehicles: any[]): void {
    let yPosition = this.doc.internal.pageSize.height - 50;
    
    // Check if we need a new page
    if (yPosition < 100) {
      this.doc.addPage();
      yPosition = 20;
    }
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Vehicles', 20, yPosition);
    yPosition += 15;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Name', 20, yPosition);
    this.doc.text('Type', 60, yPosition);
    this.doc.text('Status', 100, yPosition);
    this.doc.text('Purchase Price', 130, yPosition);
    this.doc.text('Current Value', 180, yPosition);
    yPosition += 10;
    
    this.doc.setFont('helvetica', 'normal');
    vehicles.forEach((vehicle, index) => {
      if (yPosition > 280) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(vehicle.name || 'N/A', 20, yPosition);
      this.doc.text(vehicle.type || 'N/A', 60, yPosition);
      this.doc.text(vehicle.status || 'N/A', 100, yPosition);
      this.doc.text(`₹${(vehicle.purchase_price || 0).toLocaleString()}`, 130, yPosition);
      this.doc.text(`₹${(vehicle.current_value || 0).toLocaleString()}`, 180, yPosition);
      yPosition += 10;
    });
  }

  private addLabourSection(labour: any[]): void {
    let yPosition = this.doc.internal.pageSize.height - 50;
    
    // Check if we need a new page
    if (yPosition < 100) {
      this.doc.addPage();
      yPosition = 20;
    }
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Labour', 20, yPosition);
    yPosition += 15;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Name', 20, yPosition);
    this.doc.text('Role', 60, yPosition);
    this.doc.text('Daily Rate', 100, yPosition);
    this.doc.text('Status', 130, yPosition);
    this.doc.text('Join Date', 180, yPosition);
    yPosition += 10;
    
    this.doc.setFont('helvetica', 'normal');
    labour.forEach((worker, index) => {
      if (yPosition > 280) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(worker.name || 'N/A', 20, yPosition);
      this.doc.text(worker.role || 'N/A', 60, yPosition);
      this.doc.text(`₹${(worker.daily_rate || 0).toLocaleString()}`, 100, yPosition);
      this.doc.text(worker.status || 'N/A', 130, yPosition);
      this.doc.text(worker.join_date || 'N/A', 180, yPosition);
      yPosition += 10;
    });
  }

  private addNoDataSection(title: string, message: string): void {
    let yPosition = this.doc.internal.pageSize.height - 50;
    
    // Check if we need a new page
    if (yPosition < 100) {
      this.doc.addPage();
      yPosition = 20;
    }
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, yPosition);
    yPosition += 15;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(message, 20, yPosition);
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Page ${i} of ${pageCount}`, 20, this.doc.internal.pageSize.height - 10);
      this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, this.doc.internal.pageSize.height - 10);
    }
  }

  private generateFileName(data: ReportData): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const siteName = data.site ? `_${data.site.replace(/\s+/g, '_')}` : '';
    
    if (data.dateRange) {
      return `Construction_Report_${data.dateRange.from}_to_${data.dateRange.to}${siteName}_${timestamp}.pdf`;
    } else if (data.month) {
      return `Monthly_Report_${data.month.replace(/\s+/g, '_')}${siteName}_${timestamp}.pdf`;
    } else {
      return `Construction_Report${siteName}_${timestamp}.pdf`;
    }
  }

  // Generate report from HTML element (for complex layouts)
  async generatePDFFromHTML(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  }
}

// Utility functions for data processing
export const processReportData = {
  getMaterialsData: async (siteId?: string, dateRange?: { from: string; to: string }) => {
    try {
      const response = await fetch('/api/materials');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      let materials = data.materials || [];
      
      if (siteId) {
        materials = materials.filter((material: any) => material.site_id === siteId);
      }
      
      if (dateRange) {
        materials = materials.filter((material: any) => {
          if (!material.purchase_date) return false;
          const materialDate = new Date(material.purchase_date);
          const fromDate = new Date(dateRange.from);
          const toDate = new Date(dateRange.to);
          return materialDate >= fromDate && materialDate <= toDate;
        });
      }
      
      return materials;
    } catch (error) {
      console.error('Error fetching materials data:', error);
      return [];
    }
  },

  getExpensesData: async (siteId?: string, dateRange?: { from: string; to: string }) => {
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      let expenses = data.expenses || [];
      
      if (siteId) {
        expenses = expenses.filter((expense: any) => expense.site === siteId);
      }
      
      if (dateRange) {
        expenses = expenses.filter((expense: any) => {
          const expenseDate = new Date(expense.date);
          const fromDate = new Date(dateRange.from);
          const toDate = new Date(dateRange.to);
          return expenseDate >= fromDate && expenseDate <= toDate;
        });
      }
      
      return expenses;
    } catch (error) {
      console.error('Error fetching expenses data:', error);
      return [];
    }
  },

  getVehiclesData: async (siteId?: string) => {
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      let vehicles = data.vehicles || [];
      
      if (siteId) {
        vehicles = vehicles.filter((vehicle: any) => vehicle.site_id === siteId);
      }
      
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles data:', error);
      return [];
    }
  },

  getLabourData: async (siteId?: string) => {
    try {
      const response = await fetch('/api/labour');
      const data = await response.json();
      let labour = data.labour || [];
      
      if (siteId) {
        labour = labour.filter((worker: any) => worker.site_id === siteId);
      }
      
      return labour;
    } catch (error) {
      console.error('Error fetching labour data:', error);
      return [];
    }
  },

  calculateSummary: (materials: any[], expenses: any[], vehicles: any[], labour: any[]) => {
    const totalMaterials = materials.length;
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalVehicles = vehicles.length;
    const totalLabour = labour.length;

    return {
      totalMaterials,
      totalExpenses,
      totalVehicles,
      totalLabour
    };
  }
};
