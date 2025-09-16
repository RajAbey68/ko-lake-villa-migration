import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
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
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Tropical color palette
				tropical: {
					50: 'hsl(45, 85%, 97%)',   // Lightest cream
					100: 'hsl(42, 45%, 88%)',  // Light cream  
					200: 'hsl(43, 89%, 85%)',  // Soft golden
					300: 'hsl(43, 89%, 75%)',  // Light golden
					400: 'hsl(43, 89%, 70%)',  // Golden amber (primary)
					500: 'hsl(40, 85%, 65%)',  // Medium golden
					600: 'hsl(35, 85%, 60%)',  // Deeper golden
					700: 'hsl(30, 85%, 55%)',  // Warm golden
					800: 'hsl(25, 75%, 45%)',  // Deep golden
					900: 'hsl(20, 65%, 35%)',  // Darkest golden
				},
				ocean: {
					50: 'hsl(185, 65%, 95%)',  // Lightest turquoise
					100: 'hsl(185, 65%, 85%)', // Light turquoise
					200: 'hsl(185, 65%, 75%)', // Soft turquoise
					300: 'hsl(185, 65%, 65%)', // Medium turquoise
					400: 'hsl(180, 65%, 55%)', // Turquoise
					500: 'hsl(180, 65%, 45%)', // Primary turquoise
					600: 'hsl(175, 60%, 40%)', // Deeper turquoise
					700: 'hsl(170, 55%, 35%)', // Deep turquoise
					800: 'hsl(165, 50%, 30%)', // Darker turquoise
					900: 'hsl(160, 45%, 25%)', // Darkest turquoise
				},
				sunset: {
					50: 'hsl(25, 85%, 95%)',   // Lightest orange
					100: 'hsl(25, 85%, 85%)',  // Light orange
					200: 'hsl(25, 85%, 75%)',  // Soft orange
					300: 'hsl(25, 85%, 65%)',  // Medium orange
					400: 'hsl(22, 85%, 60%)',  // Orange
					500: 'hsl(22, 85%, 55%)',  // Primary orange
					600: 'hsl(20, 80%, 50%)',  // Deeper orange
					700: 'hsl(18, 75%, 45%)',  // Deep orange
					800: 'hsl(16, 70%, 40%)',  // Darker orange
					900: 'hsl(14, 65%, 35%)',  // Darkest orange
				},
				palm: {
					50: 'hsl(155, 60%, 95%)',  // Lightest green
					100: 'hsl(155, 60%, 85%)', // Light green
					200: 'hsl(155, 60%, 75%)', // Soft green
					300: 'hsl(155, 60%, 65%)', // Medium green
					400: 'hsl(150, 60%, 55%)', // Green
					500: 'hsl(150, 60%, 45%)', // Primary green
					600: 'hsl(145, 55%, 40%)', // Deeper green
					700: 'hsl(140, 50%, 35%)', // Deep green
					800: 'hsl(135, 45%, 30%)', // Darker green
					900: 'hsl(130, 40%, 25%)', // Darkest green
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				playfair: ['Playfair Display', 'serif'],
				inter: ['Inter', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-tropical': 'var(--gradient-tropical)',
				'gradient-ocean': 'var(--gradient-ocean)',
				'gradient-sunset': 'var(--gradient-sunset)',
				'gradient-palm': 'var(--gradient-palm)',
			},
			boxShadow: {
				'golden': 'var(--shadow-golden)',
				'ocean': 'var(--shadow-ocean)',
				'warm': 'var(--shadow-warm)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px)'
					},
					'50%': { 
						transform: 'translateY(-10px)'
					}
				},
				'shimmer': {
					'0%': { 
						backgroundPosition: '-1000px 0'
					},
					'100%': { 
						backgroundPosition: '1000px 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
