/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'custom': '1560px', // Define un breakpoint específico llamado "custom"
        },
      },
    },
    plugins: [],
  }