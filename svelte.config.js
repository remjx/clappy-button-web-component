const sveltePreprocess = require('svelte-preprocess');
const { sveltePreprocessConfig } = require('./svelte-preprocess.config');

module.exports = {
	preprocess: sveltePreprocess(sveltePreprocessConfig),
};
