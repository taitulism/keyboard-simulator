import {JSDOM} from 'jsdom';
import {describe, expect, it, vi} from 'vitest';
import {extractLastEvents} from './utils';
import {KeyboardSimulator, KeyAliases, KeyMap, type KeyAlias} from '../src';

describe('KeyMap', () => {
	it('has 117 Keys', () => {
		expect(Object.entries(KeyMap)).to.have.lengthOf(117);
	});
});

describe('Aliases', () => {
	it('Each alias maps to a key', () => {
		Object.keys(KeyAliases).forEach((alias) => {
			expect(KeyAliases[alias as KeyAlias] in KeyMap).toBe(true);
		});
	});
});

describe('Case InSeNsiTiViTy', () => {
	it('Case insensitivity & extra aliases', () => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		const doc = dom.window.document;
		const spy = vi.spyOn(doc, 'dispatchEvent');
		const kbSim = new KeyboardSimulator(doc);

		kbSim.keyDown('control', 'a', 'pgdn');
		kbSim.keyUp('PgDn', 'A', 'CTRL');

		const [ev1, ev2, ev3, ev4, ev5, ev6] = extractLastEvents(spy, 6);

		expect(ev1.key).to.equal('Control');
		expect(ev1.code).to.equal('ControlLeft');
		expect(ev1.type).to.equal('keydown');

		expect(ev2.key).to.equal('a');
		expect(ev2.code).to.equal('KeyA');
		expect(ev2.type).to.equal('keydown');

		expect(ev3.key).to.equal('PageDown');
		expect(ev3.code).to.equal('PageDown');
		expect(ev3.type).to.equal('keydown');

		expect(ev4.key).to.equal('PageDown');
		expect(ev4.code).to.equal('PageDown');
		expect(ev4.type).to.equal('keyup');

		expect(ev5.key).to.equal('a');
		expect(ev5.code).to.equal('KeyA');
		expect(ev5.type).to.equal('keyup');

		expect(ev6.key).to.equal('Control');
		expect(ev6.code).to.equal('ControlLeft');
		expect(ev6.type).to.equal('keyup');

		spy.mockRestore();
	});
});
