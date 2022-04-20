module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "2xl": { min: "1800px" },
      // => @media (min-width: 1800px) { ... }

      xl: { max: "1799px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    fontFamily: {
      sans: ["VisbyCF", "sans-serif"],
      serif: ["Qedysans-Bold", "sans-serif"],
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        connected: "#84DCCF",
        lightPurple: "#AEB0D5",
        hoverBlue: "#3F4A99",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
