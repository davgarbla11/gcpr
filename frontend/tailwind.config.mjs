/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				ritsi: {
					DEFAULT: '#da2724', // Color oficial 
					hover: '#c42320',   // Color Nº7 para hover [cite: 323, 325]
					dark: '#2D2D2D',    // Pantone 419 [cite: 361, 363]
				}
			},
			fontFamily: {
				raleway: ['Raleway', 'sans-serif'], // Para la marca/títulos [cite: 213]
				exo: ['Exo', 'sans-serif'],         // Para el cuerpo [cite: 244]
			}
		},
	},
	plugins: [],
}