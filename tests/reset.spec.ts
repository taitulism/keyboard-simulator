import {JSDOM} from 'jsdom';
import {MockInstance, beforeAll, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('.reset()', () => {
	let doc: Document;
	let spy: MockInstance;
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		doc = dom.window.document;
		spy = vi.spyOn(dom.window.HTMLElement.prototype, 'dispatchEvent');
		kbSim = new KeyboardSimulator(doc);
	});

	afterEach(() => {
		kbSim.reset();
		spy.mockClear();
	});

	afterAll(() => {
		spy.mockRestore();
	});

	it('Resets pressed modifiers', () => {
		kbSim.keyDown('Ctrl', 'A');

		let ev = extractLastEvent(spy);

		expect(ev.key).to.equal('a');
		expect(ev.ctrlKey).toBe(true); // <--

		kbSim.keyUp('A');
		kbSim.keyDown('B');

		ev = extractLastEvent(spy);
		expect(ev.key).to.equal('b');
		expect(ev.ctrlKey).toBe(true); // <--

		kbSim.keyUp('B');
		kbSim.reset();
		kbSim.keyDown('C');

		ev = extractLastEvent(spy);
		expect(ev.key).to.equal('c');
		expect(ev.ctrlKey).toBe(false); // <--
	});

	it('Resets held keys', () => {
		kbSim.keyDown('A', 'B', 'C');
		expect(spy).toHaveBeenCalledTimes(3);
		kbSim.releaseAll();
		expect(spy).toHaveBeenCalledTimes(6);

		spy.mockReset();

		kbSim.keyDown('A', 'B', 'C');
		expect(spy).toHaveBeenCalledTimes(3);
		kbSim.reset();
		kbSim.releaseAll();
		expect(spy).toHaveBeenCalledTimes(3);
	});

	it('Resets toggler buttons', () => {
		kbSim.keyPress('A');
		kbSim.keyPress('Np1');

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [letterEventBefore, _1, numberEventBefore, _2] = extractLastEvents(spy, 4);

		expect(letterEventBefore.key).to.equal('a');
		expect(numberEventBefore.key).to.equal('1');

		kbSim.keyPress('NumLock'); // --> Off
		kbSim.keyPress('CapsLock'); // --> On

		kbSim.keyPress('A');
		kbSim.keyPress('Np1');

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [letterEventAfter, _3, numberEventAfter, _4] = extractLastEvents(spy, 4);

		expect(letterEventAfter.key).to.equal('A');
		expect(numberEventAfter.key).to.equal('End');

		kbSim.reset();

		kbSim.keyPress('A');
		kbSim.keyPress('Np1');

		expect(letterEventBefore.key).to.equal('a');
		expect(numberEventBefore.key).to.equal('1');
	});

	it('Resets context element', () => {
		expect(kbSim.ctxElm).to.equal(doc.body);

		const input = doc.createElement('input');

		doc.body.appendChild(input);
		kbSim.setContextElm(input);
		expect(kbSim.ctxElm).to.equal(input);

		kbSim.reset();
		expect(kbSim.ctxElm).to.equal(doc.body);
	});
});
