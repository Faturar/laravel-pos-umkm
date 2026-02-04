import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "lms-purple": "var(--color-lms-purple)",
        "lms-red": "var(--color-lms-red)",
        "lms-grey": "var(--color-lms-grey)",
        "lms-grey-border": "var(--color-lms-grey-border)",
        "lms-orange": "var(--color-lms-orange)",
        "lms-text-secondary": "var(--color-lms-text-secondary)",
        "lms-background": "var(--color-lms-background)",
      },
    },
  },
  plugins: [],
} satisfies Config
