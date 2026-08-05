// src/utils/colorUtils.ts

/**
 * Converts a hex color to RGB components
 * @param hex - Hex color string (e.g., "#1A73E8")
 * @returns Array of [r, g, b] values (0-255)
 */
export function hexToRgb(hex: string): [number, number, number] {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return [r, g, b];
  }
  
  /**
   * Converts RGB components to a hex color string
   * @param r - Red component (0-255)
   * @param g - Green component (0-255)
   * @param b - Blue component (0-255)
   * @returns Hex color string (e.g., "#1A73E8")
   */
  export function rgbToHex(r: number, g: number, b: number): string {
    // Ensure values are in valid range
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }
  
  /**
   * Lightens a color by the given amount
   * @param hex - Hex color string
   * @param amount - Amount to lighten (0-1)
   * @returns Lightened hex color
   */
  export function lightenColor(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex);
    
    // Mix with white based on amount
    const newR = r + (255 - r) * amount;
    const newG = g + (255 - g) * amount;
    const newB = b + (255 - b) * amount;
    
    return rgbToHex(newR, newG, newB);
  }
  
  /**
   * Darkens a color by the given amount
   * @param hex - Hex color string
   * @param amount - Amount to darken (0-1)
   * @returns Darkened hex color
   */
  export function darkenColor(hex: string, amount: number): string {
    const [r, g, b] = hexToRgb(hex);
    
    // Mix with black based on amount
    const newR = r * (1 - amount);
    const newG = g * (1 - amount);
    const newB = b * (1 - amount);
    
    return rgbToHex(newR, newG, newB);
  }
  
  /**
   * Calculates the relative luminance of a color
   * @param hex - Hex color string
   * @returns Luminance value (0-1)
   */
  export function getLuminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex);
    
    // Convert to relative luminance using the formula
    // Luminance = 0.299*R + 0.587*G + 0.114*B
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  
  /**
   * Determines if a color is light or dark
   * @param hex - Hex color string
   * @returns true if the color is light, false if dark
   */
  export function isLightColor(hex: string): boolean {
    return getLuminance(hex) > 0.5;
  }
  
  /**
   * Generates a palette of color variants from a base color
   * @param baseColor - The base color in hex format (e.g., "#1A73E8")
   * @returns An object with color variants from 50 to 900
   */
  export function generateColorPalette(baseColor: string) {
    // for very lighter variants (10, 20, 30, 40)
    const color5 = lightenColor(baseColor, 0.97);
    const color10 = lightenColor(baseColor, 0.97);
    const color20 = lightenColor(baseColor, 0.95);
    const color30 = lightenColor(baseColor, 0.92);
    const color40 = lightenColor(baseColor, 0.90);
    
    // For very light variants (50, 100)
    const color50 = lightenColor(baseColor, 0.93);
    const color100 = lightenColor(baseColor, 0.85);
    
    // For light variants (200, 300)
    const color200 = lightenColor(baseColor, 0.65);
    const color300 = lightenColor(baseColor, 0.45);
    
    // For medium variants (400)
    const color400 = lightenColor(baseColor, 0.25);
    
    // Base color is 500
    const color500 = baseColor;
    
    // For dark variants (600, 700, 800, 900)
    const color600 = darkenColor(baseColor, 0.15);
    const color700 = darkenColor(baseColor, 0.30);
    const color800 = darkenColor(baseColor, 0.45);
    const color900 = darkenColor(baseColor, 0.60);
    
    return {
      5: color5,
      10: color10,
      20: color20,
      30: color30,
      40: color40,
      50: color50,
      100: color100,
      200: color200,
      300: color300,
      400: color400,
      500: color500,
      600: color600,
      700: color700,
      800: color800,
      900: color900,
      DEFAULT: baseColor,
    };
  }
  
  /**
   * Generates a background color variant that complements the main color
   * @param baseColor - The base color in hex format
   * @returns A light background color variant
   */
  export function generateBackgroundColor(baseColor: string): string {
    return lightenColor(baseColor, 0.90); // Very light version for backgrounds
  }
  
  /**
   * Generates an appropriate text color based on background color
   * @param bgColor - The background color
   * @returns White for dark backgrounds, dark gray for light backgrounds
   */
  export function generateTextColor(bgColor: string): string {
    return isLightColor(bgColor) ? '#202124' : '#FFFFFF';
  }