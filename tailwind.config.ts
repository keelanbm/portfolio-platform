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
        // Layers.to inspired dark theme - refined and professional
        background: {
          primary: '#0A0A0A',      // Deep black background like Layers
          secondary: '#111111',    // Card backgrounds - subtle contrast
          tertiary: '#1A1A1A',     // Hover states and elevated surfaces
          overlay: '#000000',      // Pure black overlay for modals
        },
        accent: {
          primary: '#6366F1',      // Indigo for primary actions
          secondary: '#8B5CF6',    // Purple for secondary actions
          success: '#10B981',      // Green for success states
          warning: '#F59E0B',      // Orange for warnings
          error: '#EF4444',        // Red for errors
          pink: '#EC4899',         // Pink for likes/hearts
        },
        text: {
          primary: '#FFFFFF',      // Pure white for primary text
          secondary: '#A3A3A3',    // Light grey for secondary text
          muted: '#737373',        // Darker grey for muted text
          accent: '#6366F1',       // Links and interactive elements
        },
        border: {
          primary: '#262626',      // Subtle dark borders
          secondary: '#404040',    // Slightly lighter borders
          accent: '#6366F1',       // Accent color borders
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Portfolio-optimized spacing (8pt grid system)
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        // Additional spacing for masonry layouts
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      borderRadius: {
        'card': '16px',          // Professional card radius
        'button': '12px',        // Button radius
        'image': '12px',         // Image container radius
        'modal': '20px',         // Modal container radius
      },
      boxShadow: {
        // Dark theme shadow system - subtle and refined
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        'overlay': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        // Smooth animations for professional feel
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      gridTemplateColumns: {
        // Masonry grid configurations
        'masonry-sm': 'repeat(1, minmax(0, 1fr))',    // Mobile: 1 column
        'masonry-md': 'repeat(2, minmax(0, 1fr))',    // Tablet: 2 columns
        'masonry-lg': 'repeat(3, minmax(0, 1fr))',    // Desktop: 3 columns
        'masonry-xl': 'repeat(4, minmax(0, 1fr))',    // Large: 4 columns
        'masonry-2xl': 'repeat(5, minmax(0, 1fr))',   // XL: 5 columns
      },
      gap: {
        // Generous gaps for professional layouts
        '7': '1.75rem',
        '9': '2.25rem',
        '11': '2.75rem',
        '13': '3.25rem',
        '15': '3.75rem',
      }
    }
  },
  plugins: [],
}

export default config 