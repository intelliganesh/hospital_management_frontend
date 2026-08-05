/**
 * Converts a time string from 24-hour format (HH:MM:SS) to 12-hour format (h:MM AM/PM)
 * @param time - Time string in HH:MM:SS or HH:MM format
 * @returns Formatted time string in 12-hour format or "N/A" if input is invalid
 */
export function formatTime(time: string | null | undefined): string {
    if (!time) return "N/A";
    
    // Extract hours and minutes from HH:MM:SS or HH:MM format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    
    if (isNaN(hour) || !minutes) return "N/A";
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12
    
    return `${hour12}:${minutes} ${period}`;
  }
  
  /**
   * Formats a date string to a localized date format
   * @param date - Date string or Date object
   * @param format - Format style: 'short', 'medium', 'long', or 'full'
   * @returns Formatted date string or "N/A" if input is invalid
   */
  export function formatDate(
    date: Date | string | null | undefined,
    format: 'short' | 'medium' | 'long' | 'full' = 'medium'
  ): string {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: format === 'short' ? 'numeric' : 'long',
        day: 'numeric'
      };
      
      return dateObj.toLocaleDateString('en-US', options);
    } catch (error) {
      return "N/A";
    }
  }
  
  /**
   * Formats a date and time string to a localized format
   * @param dateTime - Date string or Date object
   * @param dateFormat - Format style for the date part
   * @returns Formatted date and time string or "N/A" if input is invalid
   */
  export function formatDateTime(
    dateTime: Date | string | null | undefined,
    dateFormat: 'short' | 'medium' | 'long' | 'full' = 'medium'
  ): string {
    if (!dateTime) return "N/A";
    
    try {
      const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
      
      const formattedDate = formatDate(dateObj, dateFormat);
      const formattedTime = formatTime(
        dateObj.toTimeString().split(' ')[0].substring(0, 5)
      );
      
      return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
      return "N/A";
    }
  }
  
  /**
   * Calculates age from date of birth
   * @param dob - Date of birth string or Date object
   * @returns Age as a number or "N/A" if input is invalid
   */
  export function calculateAge(dob: Date | string | null | undefined): string {
    if (!dob) return "N/A";
    
    try {
      const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      
      return age.toString();
    } catch (error) {
      return "N/A";
    }
  }