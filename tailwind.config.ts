import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Softer dark theme for better image focus
        background: {
          primary: '#0F1014',      // Slightly warmer than pure black
          secondary: '#1C1D26',    // More contrast from primary
          tertiary: '#2A2B36',     // Cards and elevated surfaces
          overlay: '#34354A',      // Modals, dropdowns
        },
        accent: {
          primary: '#6366F1',      // Indigo instead of cyan (more creative)
          secondary: '#8B5CF6',    // Purple for secondary actions
          success: '#10B981',      // Keep green for success
          warning: '#F59E0B',      // Keep orange for warnings
          error: '#EF4444',        // Keep red for errors
          pink: '#EC4899',         // Add pink for likes/hearts
        },
        text: {
          primary: '#F8FAFC',      // Softer white
          secondary: '#A1A1AA',    // Darker grey for better contrast
          muted: '#71717A',        // Darker muted text
          accent: '#6366F1',       // Links and interactive
        },
        border: {
          primary: 'rgba(255, 255, 255, 0.15)',    // More visible borders
          secondary: 'rgba(255, 255, 255, 0.25)',  // Much more visible borders
          accent: 'rgba(99, 102, 241, 0.4)',       // Stronger accent borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Portfolio-optimized spacing (more generous)
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
      },
      borderRadius: {
        'card': '16px',          // Larger radius for modern feel
        'button': '12px',        // Larger button radius
        'image': '12px',         // Image container radius
      },
      gridTemplateColumns: {
        // Portfolio grid optimizations
        'portfolio-sm': 'repeat(auto-fill, minmax(320px, 1fr))',  // Mobile
        'portfolio-md': 'repeat(auto-fill, minmax(380px, 1fr))',  // Tablet
        'portfolio-lg': 'repeat(auto-fill, minmax(420px, 1fr))',  // Desktop
      },
      gap: {
        // Larger gaps for portfolio layouts
        '7': '1.75rem',
        '9': '2.25rem',
        '11': '2.75rem',
      }
    }
  },
  plugins: [],
}

export default config 