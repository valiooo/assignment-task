import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    transitionProperty: {
      DEFAULT: 'color, background-color, border-color, opacity, transform',
    },
    transitionDuration: {
      DEFAULT: '300ms',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        smoke: '#E0E6F2',
        gray: '#A2A2A2',
        green: '#26D643',
        black: '#232222',
        'green-hover': '#17BD32',
        red: '#d04474',
      },
      boxShadow: {
        theme: '0 0 20px rgba(0, 0, 0, 0.4)',
      },
      screens: {
        xsm: '460px',
      },
    },
  },
  plugins: [],
} satisfies Config;
