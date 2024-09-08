import {describe, expect, it} from 'vitest';
import {KeyAlias, KeyAliases, KeyMap} from '../src';

describe('KeyMap', () => {
	it('has 116 Keys', () => {
		expect(Object.entries(KeyMap)).to.have.lengthOf(116);
	});
});

describe('Aliases', () => {
	it('Each alias maps to a key', () => {
		Object.keys(KeyAliases).forEach((alias) => {
			expect(KeyAliases[alias as KeyAlias] in KeyMap).toBe(true);
		});
	});
});
