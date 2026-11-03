/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Tông màu Thảo Mộc Rừng Sâu (Deep Forest Sage)
        primary: "#1f3627",
        "primary-container": "#354d3d",
        "primary-fixed": "#cee9d4",
        "primary-fixed-dim": "#b2cdb8",
        "on-primary": "#ffffff",
        "on-primary-container": "#a2bda9",
        "on-primary-fixed": "#082013",
        "on-primary-fixed-variant": "#344c3c",

        // Tông màu Lá Cây Xám Mộc (Secondary Muted Foliage)
        secondary: "#54634c",
        "secondary-container": "#d7e8cb",
        "secondary-fixed": "#d7e8cb",
        "secondary-fixed-dim": "#bbccb0",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5a6952",

        // Tông màu Đất Nung / Vỏ Quế Ấm (Terracotta & Amber Accent)
        tertiary: "#50250e",
        "tertiary-container": "#6b3b22",
        "tertiary-fixed": "#ffdbcb",
        "tertiary-fixed-dim": "#fcb796",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#eaa786",

        // Tông màu Giấy Mộc / Vải Đũi Ngà (Linen & Parchment Canvas)
        surface: "#fbf9f2",
        "surface-dim": "#dcdad3",
        "surface-bright": "#fbf9f2",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f4ed",
        "surface-container": "#f0eee7",
        "surface-container-high": "#eae8e1",
        "surface-container-highest": "#e4e2dc",
        background: "#fbf9f2",

        // Chữ & Mực
        "on-surface": "#1b1c18",
        "on-surface-variant": "#424843",
        "on-background": "#1b1c18",

        // Đường viền sợi tự nhiên (1px Natural Borders)
        outline: "#737973",
        "outline-variant": "#c2c8c1",
        "border-herbal": "#d8c9aa",

        // Báo lỗi
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        serif: ["'Noto Serif'", "Georgia", "serif"],
        sans: ["'Be Vietnam Pro'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(31, 54, 39, 0.05)",
        DEFAULT: "0 2px 4px 0 rgba(31, 54, 39, 0.08)",
        md: "0 4px 8px -1px rgba(31, 54, 39, 0.1), 0 2px 4px -2px rgba(31, 54, 39, 0.06)",
      }
    },
  },
  plugins: [],
}

