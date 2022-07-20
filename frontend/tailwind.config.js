const colorDefinition = {
  cinnabar: {
    DEFAULT: '#EB4747',
    50: '#FDEDED',
    100: '#FBDADA',
    200: '#F7B5B5',
    300: '#F39191',
    400: '#EF6C6C',
    500: '#EB4747',
    600: '#E11919',
    700: '#AF1313',
    800: '#7C0E0E',
    900: '#4A0808',
  },
  'mountain-meadow': {
    DEFAULT: '#2BE377',
    50: '#CDF8DF',
    100: '#BBF6D3',
    200: '#97F1BC',
    300: '#73EDA5',
    400: '#4FE88E',
    500: '#2BE377',
    600: '#19BD5D',
    700: '#128B44',
    800: '#0C5A2C',
    900: '#052814',
  },
}

const colors = {
  ...colorDefinition,
  primary: colorDefinition.cinnabar,
  secondary: colorDefinition['mountain-meadow'],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: { colors },
  },
  plugins: [require('@tailwindcss/forms')],
}
