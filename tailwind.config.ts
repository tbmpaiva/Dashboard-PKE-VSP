import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pke: {
          blue: "#1D57A0",
          "blue-dark": "#0D1B2A",
          "blue-mid": "#163D72",
          "blue-light": "#3A86FF",
          "surface": "#0F2240",
          "card": "#132C52",
          "border": "#1E3D6B",
          "text": "#E8F1FF",
          "muted": "#7A9CC4",
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
