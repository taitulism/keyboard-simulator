import {JSDOM, DOMWindow} from 'jsdom';
import {beforeAll, afterAll, describe, it, expect} from 'vitest';
import {pkgName} from '../src/index';

export function apiSpec () {
	let defaultGlobalDocument: Document;
	let window: DOMWindow;
	let document: Document;

	beforeAll(() => {
		const dom = new JSDOM('');

		/* eslint-disable prefer-destructuring */
		window = dom.window;
		document = dom.window.document;
		/* eslint-enable prefer-destructuring */

		defaultGlobalDocument = globalThis.document;
		globalThis.document = document;
	});

	afterAll(() => {
		window.close();
		globalThis.document = defaultGlobalDocument;
	});

	describe('.thing', () => {
		it('is ok', () => {
			expect(document).to.be.ok;
			expect(pkgName).to.be.a('function');
		});
	});
}
