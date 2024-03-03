![Build Status](https://github.com/taitulism/keyboard-simulator/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


First Thing's First
===================
### Rename all pkg-name strings:
* package.json
* README.md
* src/pkg-name.ts (use vs-code refactor)
* src/index.ts
* rollup.prod.config.js
* playground/playground.html
* tests/index.spec.ts
* tests/api.spec.ts

### Then:
* Read the "version" note below

&nbsp;

Development
===========

TDD
---
`npm run dev` - Vitest + watch

&nbsp;

Browser Playground
------------------
1. `npm run play`
2. Open file in the browser:
	* `./playground/playground.html` 

&nbsp;

Check Stuff
-----------
* `npm run lint`   - Eslint check issues
* `npm run types`  - TypeScript type checking
* `npm run test`   - Vitest (for build)
* `npm run checks` - lint + types + test (all)

&nbsp;

Publish a new version
---------------------
> **`version` script Note:**  
> If something from `dist` folder is git tracked - add `" && git add dist"` to end of the script 

&nbsp;

1.
	```sh
	$ npm version major|minor|patch
	```  
	triggers:

	* `preversion`  - Runs the `check:all` script
	* `version`     - Runs the `build` script
		* `prebuild`  - Delete `"dist"` folder
		* `build`     - Rollup build for production
		* `postbuild` - Delete temporary declaration folder inside `"dist"`
	* `postversion` - Git push + tags

	&nbsp;
	
2.
	```sh
	$ npm publish
	``` 
	triggers:

	* `prepublishOnly` - Runs the `check:all` script

