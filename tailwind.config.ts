
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
			padding: "2rem",
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				meetease: {
					blue: "#5E5CE6",
					lightBlue: "#9b87f5",
					indigo: "#6E59A5",
					purple: "#9b87f5",
					pink: "#D6BCFA",
					red: "#FF3B30",
					orange: "#FF9500",
					yellow: "#FFCC00",
					green: "#34C759",
					mint: "#00C7BE",
					teal: "#30B0C7",
					cyan: "#32ADE6",
					gray: "#8E8E93",
					gray2: "#AEAEB2",
					gray3: "#C7C7CC",
					gray4: "#D1D1D6",
					gray5: "#E5E5EA",
					gray6: "#F2F2F7",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				subtle: "0 2px 10px rgba(0, 0, 0, 0.05)",
				card: "0 4px 16px rgba(0, 0, 0, 0.08)",
				elevated: "0 10px 30px rgba(0, 0, 0, 0.12)",
				button: "0 2px 5px rgba(0, 0, 0, 0.1)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"fade-in": {
					from: { opacity: "0", transform: "translateY(10px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"fade-out": {
					from: { opacity: "1", transform: "translateY(0)" },
					to: { opacity: "0", transform: "translateY(10px)" },
				},
				"scale-in": {
					from: { opacity: "0", transform: "scale(0.95)" },
					to: { opacity: "1", transform: "scale(1)" },
				},
				"scale-out": {
					from: { opacity: "1", transform: "scale(1)" },
					to: { opacity: "0", transform: "scale(0.95)" },
				},
				"slide-in": {
					from: { transform: "translateX(-100%)" },
					to: { transform: "translateX(0)" },
				},
				"slide-out": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(-100%)" },
				},
				shimmer: {
					"100%": { transform: "translateX(100%)" },
				},
				"bounce-slow": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				},
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				float: "float 6s ease-in-out infinite",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"scale-in": "scale-in 0.2s ease-out",
				"scale-out": "scale-out 0.2s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
				"slide-out": "slide-out 0.3s ease-out",
				shimmer: "shimmer 2s infinite",
				"bounce-slow": "bounce-slow 3s ease-in-out infinite",
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			transitionProperty: {
				height: "height",
				spacing: "margin, padding",
			},
			transitionTimingFunction: {
				"in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
				"out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
				"bezier-1": "cubic-bezier(0.25, 0.1, 0.25, 1)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
