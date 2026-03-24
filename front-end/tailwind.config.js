/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],

  safelist: [
    // layout
    "flex",
    "grid",
    "hidden",
    "block",

    // spacing
    "p-2", "p-3", "p-4", "p-6", "p-8",
    "px-4", "py-2", "py-3", "py-4",

    // colors
    "bg-orange-500",
    "bg-orange-600",
    "bg-gray-100",
    "bg-gray-200",
    "bg-light",
    "text-white",
    "text-black",
    "text-text",

    // borders & radius
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "border",
    "border-gray-200",

    // shadows
    "shadow",
    "shadow-md",
    "shadow-lg",

    // width / height
    "w-full",
    "h-full",
  ],

  theme: {
    extend: {
      colors: {
        // Renamed to match your component classes
        'primary': '#D84C38',
        'accent': '#FF7A00',
        'secondary-accent': '#FF7A00',
          'background-light': '#E4D6C3', // Your original --light
          'light': '#E4D6C3', // Changed from background-light
        'card-bg': '#FFFFFF',
        'text': '#332720',   // Changed from text-dark
        'muted': '#665345',  // Changed from text-muted
        'text-dark': '#332720', // Your original --text
        'text-muted': '#665345', // Your original --muted
        'error': '#EF4444',
        'red-alert': '#EF4444',
        'success': '#10B981', 
        'info': '#3B82F6',
        'warning': '#F59E0B'
      },
      borderRadius: {
        'report': '25px', // Standardized for your modals/cards
        'boarding': '35px',
        'large': '25px',
        'card': '15px',
        'btn': '12px',
      },
      boxShadow: {
        'custom': '0 6px 20px rgba(0,0,0,0.08)',
        'accent-hover': '0 4px 12px rgba(255, 122, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      },
    },
  },
  plugins: [],
}
