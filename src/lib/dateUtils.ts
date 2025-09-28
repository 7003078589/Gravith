/**
 * Utility functions for date handling
 */

/**
 * Converts a Date object to YYYY-MM-DD format without timezone issues
 * @param date - The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format or empty string if date is null/undefined
 */
export function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Converts a date string (YYYY-MM-DD) to a Date object
 * @param dateString - The date string to convert
 * @returns Date object or null if invalid
 */
export function parseDateFromInput(dateString: string): Date | null {
  if (!dateString) return null;
  
  // Create date in local timezone to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}