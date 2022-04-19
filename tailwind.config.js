module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["VisbyCF", "sans-serif"],
      serif: ["Qedysans-Bold", "sans-serif"],
    },
    container: {
      center: true,
      screens: {
        sm: "1800px",
        md: "1800px",
        lg: "1800px",
        xl: "1800px",
      },
    },
    extend: {
      colors: {
        connected: "#84DCCF",
        lightPurple: "#AEB0D5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
