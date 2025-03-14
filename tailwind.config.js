/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "govuk-blue": "#1d70b8",
        "govuk-dark-blue": "#003078",
        "govuk-light-blue": "#5694ca",
        "govuk-green": "#00703c",
        "govuk-light-green": "#85994b",
        "govuk-red": "#d4351c",
        "govuk-yellow": "#ffdd00",
        "govuk-orange": "#f47738",
        "govuk-brown": "#b58840",
        "govuk-purple": "#4c2c92",
        "govuk-pink": "#d53880",
        "govuk-grey": "#f3f2f1",
        "govuk-dark-grey": "#505a5f",
        "govuk-mid-grey": "#b1b4b6",
        "govuk-light-grey": "#f8f8f8",
        "govuk-black": "#0b0c0c",
        "govuk-white": "#ffffff",
      },
      backgroundColor: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          tertiary: '#404040'
        }
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#a0aec0',
          tertiary: '#718096'
        }
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'strong': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-in-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};