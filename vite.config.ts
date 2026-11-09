import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				name: "Watcharr",
				short_name: "Watcharr",
				description: "Your movie and show watched list.",
				background_color: "#f1da83",
				categories: ["entertainment"],
				start_url: "/",
				scope: "/",
				display: "standalone",
				icons: [
					{
						src: "/logo-sqre-144.png",
						sizes: "144x144",
						type: "image/png",
					},
					{
						src: "/logo-sqre-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/logo-sqre.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/logo-sqre.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
			devOptions: {
				enabled: true,
			},
			workbox: {
				// The SvelteKit integration adds a `prerendered/**` glob by default,
				// but this app prerenders nothing, so workbox warns about an unmatched
				// pattern on every build. Setting `modifyURLPrefix` opts out of the
				// default glob list so only the client output is precached.
				modifyURLPrefix: {},
				globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,webmanifest}"],
			},
		}),
	],
	build: {
		rolldownOptions: {
			checks: {
				// SvelteKit's own plugins dominate build time; the timing report is
				// noise for this project.
				pluginTimings: false,
			},
		},
	},
	define: {
		__WATCHARR_VERSION__: JSON.stringify(pkg.version),
	},
});
