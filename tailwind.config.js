/** @type {import('tailwindcss').Config} */
export default {
   content: ['src/**/*.{html,svelte,css}'],
   theme: {
      extend: {
         keyframes: {
            slide: {
               '0%': { transform: 'translateY(16px)', opacity: 0 },
               '100%': { transform: 'translateY(0)', opacity: 1 }
            }
         },
         animation: {
            'slide-in': 'slide 750ms ease',
            'slide-out': 'slide 750ms ease reverse'
         }
      },
      fontFamily: {
         'sans': ['Outfit'],
         'code': ['JetBrains Mono']
      },
   },
   plugins: [],
}

