// TODO: .ts extension
// import type {RollupOptions} from 'rollup';
import typescript from '@rollup/plugin-typescript';

// eslint-disable-next-line no-console
console.log(`
******************************************************
Open "playground.html" in the browser to start playing
******************************************************
`);

const playground = {
	input: 'playground/playground.ts',
	plugins: [typescript()],
	output: {
		sourcemap: true,
		file: 'dev-bundles/playground.js',
		format: 'iife',
	},
};

export default [
	playground,
];
