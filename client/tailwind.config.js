/** @type {import('tailwindcss').Config} */
export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93bbfd',
              400: '#609afa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            }
          },
          animation: {
            'gradient-x': 'gradient-x 15s ease infinite',
            'gradient-y': 'gradient-y 15s ease infinite',
            'gradient-xy': 'gradient-xy 15s ease infinite',
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            'gradient-y': {
              '0%, 100%': {
                'background-size': '400% 400%',
                'background-position': 'center top'
              },
              '50%': {
                'background-size': '200% 200%',
                'background-position': 'center center'
              }
            },
            'gradient-x': {
              '0%, 100%': {
                'background-size': '200% 200%',
                'background-position': 'left center'
              },
              '50%': {
                'background-size': '200% 200%',
                'background-position': 'right center'
              }
            },
            'gradient-xy': {
              '0%, 100%': {
                'background-size': '400% 400%',
                'background-position': 'left center'
              },
              '50%': {
                'background-size': '200% 200%',
                'background-position': 'right center'
              }
            }
          }
        },
      },
      plugins: [],
    }