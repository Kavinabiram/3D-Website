/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cocoa: {
          900: '#1A0E0A', // Dark Cocoa primary background
          850: '#23130E', // Darker mid tone
          800: '#2D140F', // Premium Chocolate secondary
          700: '#4B2418', // Melted Chocolate
        },
        cream: {
          100: '#FDFBF7',
          200: '#F5E8D3', // Cream Beige secondary
          300: '#EAD3B3',
        },
        gold: {
          400: '#F7B955', // Soft Amber Glow
          500: '#D6A85F', // Luxury Gold
          600: '#B97A3D', // Caramel Bronze
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(26, 14, 10, 0.37)',
      }
    },
  },
  plugins: [],
}
