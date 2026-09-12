/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#0a0f1d',
          800: '#111827',
        },
        hud: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          anomaly: '#ef4444',
          muted: '#64748b',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}