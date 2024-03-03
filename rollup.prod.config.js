import terser from '@rollup/plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import {dts} from 'rollup-plugin-dts';
import pkg from './package.json';

console.log('*** DELETE THIS LOG after reading the comment in `rollup.prod.config.js` ***');
/*
	`nodeResolve` is a rollup plugin to resolve imports like node, i.e. how importing from
		an absolute path checks the `node_modules` directory.
	It's needed when using any dependency package (e.g. import from 'react').
	If you have no dependencies - remove @rollup/plugin-node-resolve
*/

const pkgNameAndVersion = pkg.name + ' v' + pkg.version;
const license = `${pkg.license} License`;
const author = `© ${pkg.author.name}`;
const year = new Date().getFullYear();
const repoUrl = pkg.repository.url.substring(0, pkg.repository.url.length - 4); // removes tail ".git"
const banner = `/*! ${pkgNameAndVersion} | ${license} | ${author} ${year} | ${repoUrl} */`;

const withTypeDeclarations = {
	compilerOptions: {
		declaration: true,
		declarationMap: true,
		declarationDir: './dist/esm/temp-dts',
	},
};

const esm = {
	input: pkg.main,
	plugins: [typescript(withTypeDeclarations), nodeResolve()],
	output: {
		banner,
		dir: './dist/esm',
		format: 'es',
		entryFileNames:'pkg-name.esm.js',
	},
};

const declarationFile = {
	input: './dist/esm/temp-dts/src/index.d.ts',
	plugins: [dts()],
	output: [{
		file: pkg.types,
		format: 'es',
	}],
};

const browserMini = {
	input: pkg.main,
	plugins: [typescript(), nodeResolve(), terser()],
	output: {
		banner,
		esModule: false,
		file: pkg.browser,
		format: 'iife',
		name: 'pkgName',
	},
};

export default [
	esm,
	declarationFile,
	browserMini,
];
