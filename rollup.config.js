import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { visualizer } from 'rollup-plugin-visualizer';
const replace = require('@rollup/plugin-replace');
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
const { sveltePreprocessConfig } = require('./svelte-preprocess.config');
import css from 'rollup-plugin-css-only';
import copy from "rollup-plugin-copy";

const watch = process.env.ROLLUP_WATCH;
const env = process.env.NODE_ENV;
if (!env) throw new Error('env not defined');
const isDevelopment = env === 'development';
function serve() {

	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn(
				'npm',
				['run', 'start', '--', '--dev', '--host'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				}
			);
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		},
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		file: 'dist/bundle.js',
		name: 'dist/bundle.js.map'
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: isDevelopment,
				customElement: true,
			},
			include: /\.wc\.svelte$/,
			preprocess: sveltePreprocess(sveltePreprocessConfig),
		}),
		copy({
			targets: [
				{ src: "public/**/*", dest: "dist" },
				{ src: "assets/**/*", dest: "dist" },
			],
		}),
		svelte({
			compilerOptions: {
				dev: isDevelopment,
				customElement: false,
			},
			exclude: /\.wc\.svelte$/,
			preprocess: sveltePreprocess(sveltePreprocessConfig),
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({
			sourceMap: isDevelopment,
			inlineSources: isDevelopment,
			composite: false,
		}),
		watch && serve(),
		watch && livereload({ watch: "dist", delay: 200 }),

		// HACK! Fix svelte/transitions in web components
		// https://github.com/sveltejs/svelte/issues/1825#issuecomment-717885496
		// alternative: https://github.com/sveltejs/svelte/issues/4735#issuecomment-707044039
		// Use shadow root instead of document for transition style injecting
		replace({
			'.ownerDocument': '.getRootNode()',
			delimiters: ['', ''],
			preventAssignment: true,
		}),
		// Append styles to shadow root
		replace({
			'.head.appendChild': '.appendChild',
			delimiters: ['', ''],
			preventAssignment: true,
		}),
		// END HACK

		isDevelopment && visualizer({ filename: 'dist/stats.html' }),
	],
	watch: {
		clearScreen: false,
	},
};
