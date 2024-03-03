// TODO: .ts extension
// import type {RollupOptions} from 'rollup';
import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';

console.log('*** DELETE THIS LOG after reading the comment in `rollup.prod.config.js` ***');
/*
	`nodeResolve` is a rollup plugin to resolve imports like node, i.e. how importing from
		an absolute path checks the `node_modules` directory.
	It's needed when using any dependency package (e.g. import from 'react').
	If you have no dependencies - remove @rollup/plugin-node-resolve
*/

// eslint-disable-next-line no-console
console.log(`
******************************************************
Open "playground.html" in the browser to start playing
******************************************************
`);

const playground = {
	input: 'playground/playground.ts',
	plugins: [typescript(), nodeResolve()],
	output: {
		sourcemap: true,
		file: 'dev-bundles/playground.js',
		format: 'iife',
	},
};

export default [
	playground,
];
