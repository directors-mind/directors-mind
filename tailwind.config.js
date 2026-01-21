/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'checkered': "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
      },
      backgroundSize: {
        'checkered': '20px 20px',
      },
      backgroundPosition: {
        'checkered': '0 0, 0 10px, 10px -10px, -10px 0px',
      }
    },
  },
  plugins: [
    // 这里的 require 写法在 ESM 里需要改一下，或者直接用字符串引用更稳妥，
    // 但最稳的是手动 import。为了不报错，我们用下面的写法：
    import('tailwind-scrollbar'),
  ],
}