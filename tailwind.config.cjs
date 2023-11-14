/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'sans': ['Outfit'],
        'code': ['JetBrains Mono']
     },
    },
  },

  plugins: [],
};

module.exports = config;
