module.exports = {
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		node: true,
		es6: true,
		'cypress/globals': true,
	},
	extends: [
		'eslint:recommended',
		'plugin:cypress/recommended',
		'prettier',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
	overrides: [
		{
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
	parserOptions: {
		allowImportExportEverywhere: true,
		ecmaVersion: 2019,
		sourceType: 'module',
		// https://github.com/sveltejs/eslint-plugin-svelte3
		// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md

		// tsconfigRootDir: __dirname,
		// project: ['./tsconfig.json'],
		// extraFileExtensions: ['.svelte'],
	},
	plugins: [
		'svelte3', // https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md
		// https://github.com/sveltejs/eslint-plugin-svelte3
		'cypress',
		'@typescript-eslint',
	],
	settings: {
		'svelte3/typescript': require('typescript'),
		'svelte3/compiler-options': {
			customElement: true,
		},
	},
	rules: {
		'no-unused-vars': 'warn',
		'no-undef': 'off', // should be covered by "tsc". workaround for preventing this error:
		// clappy-button-monorepo\packages\web-component-svelte\src\components\clappy-button\animated-btn\animated-btn.svelte
		//	52:19  error    'NodeListOf' is not defined     no-undef
	},
};
