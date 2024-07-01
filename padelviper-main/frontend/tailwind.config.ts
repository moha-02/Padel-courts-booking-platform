module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': '#FFE74C',
        'secondary': '#FF5964',
        'terciary': '#FFFFFF',
        'success': '#6BF178',
        'info': '#35AF77',
        'error': '#FF5A5F',
        'warning': '#FFC06C',
        'padel-green': "#E9FD6F",
      },
      animation: {
        backgroundPositionSpin: "background-position-spin 3000ms infinite alternate",
      },
      keyframes: {
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
      },
    },
  },
  plugins: [],
};