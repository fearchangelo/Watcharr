import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";

const nodeAdapter = adapter();

/**
 * adapter-node re-bundles the server output with one chunk per module
 * (see https://github.com/sveltejs/kit/issues/16092). Modules whose code is
 * only needed on the client (e.g. `notify`) tree-shake to nothing on the
 * server, so rollup reports "Generated an empty chunk" even though the output
 * is correct. Filter that one message so builds stay warning-free.
 *
 * @type {import('@sveltejs/kit').Adapter}
 */
const quietNodeAdapter = {
	...nodeAdapter,
	async adapt(builder) {
		const warn = console.warn;
		console.warn = (...args) => {
			if (
				typeof args[0] === "string" &&
				args[0].startsWith("Generated an empty chunk")
			) {
				return;
			}
			warn(...args);
		};
		try {
			await nodeAdapter.adapt(builder);
		} finally {
			console.warn = warn;
		}
	},
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		sveltePreprocess({
			scss: {
				// Only prepend partials that we want access to everywhere
				// by default. They can't have css otherwise our css output
				// will be bloated. Global styles can be in our `norm.scss` file
				// which is imported (`@use`d) in our root `+layout.svelte` file.
				prependData:
					`@use "./src/styles/_vars.scss" as *;` +
					`@use "./src/styles/_mixins.scss" as *;`,
			},
		}),
		vitePreprocess(),
	],

	kit: {
		adapter: quietNodeAdapter,

		alias: {
			"@": "src",
		},
	},
};

export default config;
