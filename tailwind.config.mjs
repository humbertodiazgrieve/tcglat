/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F5F0E8',
          blue: '#3B82F6',
          red: '#EF4444',
          dark: '#1a1a2e',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};