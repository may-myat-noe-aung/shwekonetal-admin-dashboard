/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "Padauk", "sans-serif"],
    },
    extend: {
      backgroundImage:{
        'custom-gradient':'linear-gradient(to top, #ebc0fd 0%, #d9ded8 100%)',
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};
