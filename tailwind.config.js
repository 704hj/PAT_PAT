/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        dunggeunmis: ["var(--font-dunggeunmis)"],
      },
      keyframes: {
        loaderFill: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        starFollow: {
          "0%": { transform: "translateX(0)" },
          // 트랙 끝(컨테이너 100%)에서 별 크기만큼 빼기
          "100%": { transform: "translateX(calc(100% - var(--star-size)))" },
        },
      },
      animation: {
        loaderFill: "loaderFill 2.4s linear infinite",
        starFollow: "starFollow 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
