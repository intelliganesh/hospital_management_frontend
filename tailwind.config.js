/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // This tells Tailwind to look for classes in your JSX/TSX files
  ],
  darkMode: 'class',
  // Add to tailwind.config.js
  safelist: [
  { pattern: /^bg-primary-/ },
  { pattern: /^text-primary-/ },
  { pattern: /^border-primary-/ },
  { pattern: /^bg-secondary-/ },
  { pattern: /^text-secondary-/ },
  { pattern: /^border-secondary-/ },
  { pattern: /^bg-accent-/ },
  { pattern: /^text-accent-/ },
  { pattern: /^border-accent-/ },
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px'
        }
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          forg: "var(--primary-foreground)",
          background: "var(--primary-bg)",
          5: "var(--primary-5)",
          10: "var(--primary-10)",
          20: "var(--primary-20)",
          30: "var(--primary-30)",
          40: "var(--primary-40)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          forg: "var(--secondary-foreground)",
          background: "var(--secondary-bg)",
          5: "var(--secondary-5)",
          10: "var(--secondary-10)",
          20: "var(--secondary-20)",
          30: "var(--secondary-30)",
          40: "var(--secondary-40)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          forg: "var(--accent-foreground)",
          background: "var(--tertiary-bg)",
          5: "var(--accent-5)",
          10: "var(--accent-10)",
          20: "var(--accent-20)",
          30: "var(--accent-30)",
          40: "var(--accent-40)",
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
        neutral: {
          DEFAULT: '#F8F9FA',
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124',
        },
        text: {
          DEFAULT: '#202124',
          light: '#5F6368',
          lighter: '#9AA0A6',
        },
        success: '#36B37E',
        warning: '#FBBC05',
        danger: '#EA4335',
        info: '#4285F4',
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        drawer: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        dropdown: '0 2px 5px 0 rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.12)',
      },
      keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out'
			},
      fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			},
      borderRadius: {
				'none': '0',
				'sm': '0.125rem',
				DEFAULT: '0.375rem',
				'md': '0.5rem',
				'lg': '0.75rem',
				'xl': '1rem',
				'2xl': '1.5rem',
				'full': '9999px',
			}
    },
  },
  plugins: [],
};
