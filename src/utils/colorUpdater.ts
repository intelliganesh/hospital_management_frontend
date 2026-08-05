// src/utils/colorUpdater.ts
import { generateColorPalette } from './colorUtils';

/**
 * Updates CSS variables for all color variants based on the main colors
 * @param colors - Object containing primary_color, secondary_color, and tertiary_color
 */
export function updateColorVariables(colors: {
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
}) {
  const root = document.documentElement;
  
  // Update primary color variants
  if (colors.primary_color) {
    root.style.setProperty('--primary-base', colors.primary_color);
    const primaryPalette = generateColorPalette(colors.primary_color);
    
    // Set all primary color variants as CSS variables
    Object.entries(primaryPalette).forEach(([key, value]) => {
        if (key === 'DEFAULT') return;
        root.style.setProperty(`--primary-${key}-base`, value);
      });

    // root.style.setProperty('--primary-50', primaryPalette[50]);
    // root.style.setProperty('--primary-100', primaryPalette[100]);
    // root.style.setProperty('--primary-200', primaryPalette[200]);
    // root.style.setProperty('--primary-300', primaryPalette[300]);
    // root.style.setProperty('--primary-400', primaryPalette[400]);
    // root.style.setProperty('--primary-500', primaryPalette[500]);
    // root.style.setProperty('--primary-600', primaryPalette[600]);
    // root.style.setProperty('--primary-700', primaryPalette[700]);
    // root.style.setProperty('--primary-800', primaryPalette[800]);
    // root.style.setProperty('--primary-900', primaryPalette[900]);
  }
  
  // Update secondary color variants
  if (colors.secondary_color) {
    root.style.setProperty('--secondary-base', colors.secondary_color);
    const secondaryPalette = generateColorPalette(colors.secondary_color);
    
    // Set all secondary color variants as CSS variables
    Object.entries(secondaryPalette).forEach(([key, value]) => {      
        if (key === 'DEFAULT') return;
        root.style.setProperty(`--secondary-${key}-base`, value);
      });
    // root.style.setProperty('--secondary-50', secondaryPalette[50]);
    // root.style.setProperty('--secondary-100', secondaryPalette[100]);
    // root.style.setProperty('--secondary-200', secondaryPalette[200]);
    // root.style.setProperty('--secondary-300', secondaryPalette[300]);
    // root.style.setProperty('--secondary-400', secondaryPalette[400]);
    // root.style.setProperty('--secondary-500', secondaryPalette[500]);
    // root.style.setProperty('--secondary-600', secondaryPalette[600]);
    // root.style.setProperty('--secondary-700', secondaryPalette[700]);
    // root.style.setProperty('--secondary-800', secondaryPalette[800]);
    // root.style.setProperty('--secondary-900', secondaryPalette[900]);
  }
  
  // Update accent/tertiary color variants
  if (colors.tertiary_color) {
    root.style.setProperty('--accent-base', colors.tertiary_color);
    const accentPalette = generateColorPalette(colors.tertiary_color);
    
    // Set all accent color variants as CSS variables
    Object.entries(accentPalette).forEach(([key, value]) => {
        if (key === 'DEFAULT') return;
        root.style.setProperty(`--accent-${key}-base`, value);
      });
    // root.style.setProperty('--accent-50', accentPalette[50]);
    // root.style.setProperty('--accent-100', accentPalette[100]);
    // root.style.setProperty('--accent-200', accentPalette[200]);
    // root.style.setProperty('--accent-300', accentPalette[300]);
    // root.style.setProperty('--accent-400', accentPalette[400]);
    // root.style.setProperty('--accent-500', accentPalette[500]);
    // root.style.setProperty('--accent-600', accentPalette[600]);
    // root.style.setProperty('--accent-700', accentPalette[700]);
    // root.style.setProperty('--accent-800', accentPalette[800]);
    // root.style.setProperty('--accent-900', accentPalette[900]);
  }
}