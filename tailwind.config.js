/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tar: '#26282C', // asphalt
        tar2: '#2F3237',
        paint: '#F4F4F0', // white line paint
        line: '#474A50',
        muted: '#A9ACB3',
        flag: '#FFD400', // yellow flag
      },
      fontFamily: {
        body: ['Barlow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        cond: ['"Barlow Condensed"', 'Barlow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
