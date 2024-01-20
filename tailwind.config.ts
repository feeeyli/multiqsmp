import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        squirrel: {
          DEFAULT: 'hsl(var(--squirrel-primary))',
          secondary: 'hsl(var(--squirrel-secondary))',
        },
        crab: {
          DEFAULT: 'hsl(var(--crab-primary))',
          secondary: 'hsl(var(--crab-secondary))',
        },
        capybara: {
          DEFAULT: 'hsl(var(--capybara-primary))',
          secondary: 'hsl(var(--capybara-secondary))',
        },
        crow: {
          DEFAULT: 'hsl(var(--crow-primary))',
          secondary: 'hsl(var(--crow-secondary))',
        },
        goose: {
          DEFAULT: 'hsl(var(--goose-primary))',
          secondary: 'hsl(var(--goose-secondary))',
        },
        axolotl: {
          DEFAULT: 'hsl(var(--axolotl-primary))',
          secondary: 'hsl(var(--axolotl-secondary))',
        },
        raccoon: {
          DEFAULT: 'hsl(var(--raccoon-primary))',
          secondary: 'hsl(var(--raccoon-secondary))',
        },
        panda: {
          DEFAULT: 'hsl(var(--panda-primary))',
          secondary: 'hsl(var(--panda-secondary))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'on-watch-initial': {
          0: {
            transform: 'translateX(0%)',
          },
          99: {
            transform: 'translateX(100%)',
          },
          100: {
            animation: 'on-watch-end 1s liner',
          },
        },
        'on-watch-end': {
          from: {
            transform: 'translateX(-100%)',
          },
          to: {
            transform: 'translateX(0%)',
          },
        },
        wow: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'on-watch-initial': 'on-watch-initial 1s liner',
        wow: 'wow 400ms cubic-bezier(0.72, 0.01, 0.22, 0.96)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};

export default config;
