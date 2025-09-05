module.exports = {
  content: [
    "./pages/**/**/**/**/*.{js,ts,jsx,tsx}",
    "./components/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "spin-mid": "spin 2s linear infinite",
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
      },
      fontSize: {
        mashJijigiinJijig: ["12px", "12px"],
        mashJijigiinDundaj: ["10px", "10px"],
        buurJijig: ["8px", "8px"],
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
