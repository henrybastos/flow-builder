/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'sans': ['Outfit'],
        'code': ['JetBrains Mono']
     },
     colors: {
      primary: {
        100: '#FF0001',
        200: '#FF0002'
      }
     }
    },
  },

  plugins: [],
};

module.exports = config;
