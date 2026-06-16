import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080808',
          card: '#101010',
          elevated: '#161616',
          muted: '#1c1c1c',
        },
        border: {
          DEFAULT: '#1e1e1e',
          muted: '#141414',
          strong: '#2a2a2a',
        },
        text: {
          primary: '#f0f0f0',
          secondary: '#888',
          muted: '#444',
        },
        status: {
          draft:        { DEFAULT: '#444', bg: '#1a1a1a' },
          active:       { DEFAULT: '#10b981', bg: '#052e1c' },
          approaching:  { DEFAULT: '#f59e0b', bg: '#2d1f00' },
          triggered:    { DEFAULT: '#3b82f6', bg: '#0d1f3c' },
          fulfilled:    { DEFAULT: '#8b5cf6', bg: '#1e0d3c' },
          invalidated:  { DEFAULT: '#ef4444', bg: '#2d0d0d' },
          archived:     { DEFAULT: '#333',    bg: '#0f0f0f' },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
