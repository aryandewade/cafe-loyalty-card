/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBF9F5',
          subtle: '#F4EFE6'
        },
        espresso: {
          DEFAULT: '#181311',
          subtle: '#2D2320'
        },
        roast: {
          deep: '#3D302B',
          medium: '#6E5A52',
          muted: '#9E8B82'
        },
        terracotta: {
          DEFAULT: '#BC5A2B',
          hover: '#A74C20',
          light: '#FDF1EA'
        },
        foil: {
          gold: '#C89D4B',
          light: '#FBF4E6'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
