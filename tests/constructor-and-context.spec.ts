import {JSDOM, DOMWindow} from 'jsdom';
import {MockInstance, beforeAll, beforeEach, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('Constructor', () => {
	let win: DOMWindow;
	let doc: Document;
	let spy: MockInstance;
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		win = dom.window;
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

	it('When no args - context element is `document.activeElement` (Body by default)', () => {
		const originalDoc = globalThis.document;

		// Because in this case KeyboardSimulator grabs the `document` from the global scope
		globalThis.document = doc;

		const kbSim = new KeyboardSimulator();

		kbSim.keyPress('A');

		const {target: evTarget1} = extractLastEvent(spy);

		expect(evTarget1).to.be.instanceOf(win.HTMLBodyElement);
		expect(evTarget1).to.equal(doc.body);

		const input = doc.createElement('input');

		doc.body.appendChild(input);
		input.focus();
		kbSim.keyPress('A');

		const {target: evTarget2} = extractLastEvent(spy);

		expect(evTarget2).to.be.instanceOf(win.HTMLInputElement);
		expect(evTarget2).to.equal(input);

		input.remove();
		globalThis.document = originalDoc;
	});

	it('When arg is a Document - context element is `document.activeElement` (Body by default)', () => {
		// Default test instance
		kbSim.keyPress('A');

		const {target: evTarget1} = extractLastEvent(spy);

		expect(evTarget1).to.be.instanceOf(win.HTMLBodyElement);
		expect(evTarget1).to.equal(doc.body);

		const input = doc.createElement('input');

		doc.body.appendChild(input);
		input.focus();
		kbSim.keyPress('A');

		const {target: evTarget2} = extractLastEvent(spy);

		expect(evTarget2).to.be.instanceOf(win.HTMLInputElement);
		expect(evTarget2).to.equal(input);

		input.remove();
	});

	it('When arg is an HTMLElement - context element is that element', () => {
		const input1 = doc.createElement('input');
		const input2 = doc.createElement('input');

		doc.body.appendChild(input1);
		doc.body.appendChild(input2);

		const kbSim2 = new KeyboardSimulator(input2); // <-- 2

		input1.focus(); // <-- 1

		kbSim2.keyPress('A');

		const {target: evTarget} = extractLastEvent(spy);

		expect(evTarget).to.be.instanceOf(win.HTMLInputElement);
		expect(evTarget).to.equal(input2); // <-- 2

		input1.remove();
		input2.remove();
	});

});

describe('Context Element', () => {
	let win: DOMWindow;
	let doc: Document;
	let input: HTMLInputElement;
	let kbSim: KeyboardSimulator;
	let spy: MockInstance;

	beforeAll(() => {
		const dom = new JSDOM('<input id="input" type="text" />', {url: 'http://localhost'});

		win = dom.window;
		doc = dom.window.document;
		input = doc!.getElementById('input') as HTMLInputElement;
		kbSim = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		spy = vi.spyOn(win.HTMLElement.prototype, 'dispatchEvent');
	});

	afterEach(() => {
		kbSim.reset();
		spy.mockClear();
	});

	afterAll(() => {
		spy.mockRestore();
	});

	describe('.setContextElm()', () => {
		it('Changes the element that gets the keyboard events', () => {
			kbSim.keyPress('A');
			kbSim.setContextElm(input);
			kbSim.keyPress('B');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [evBefore, _1, evAfter, _2] = extractLastEvents(spy, 4);

			expect(evBefore.target).to.equal(doc!.body);
			expect(evAfter.target).to.be.instanceOf(win!.HTMLInputElement);
		});

		it('Returns the instance', () => {
			const instance = kbSim.setContextElm(input);

			expect(instance).to.equal(kbSim);
		});
	});

	describe('.ctxElm - Getter', () => {
		it('Returns Body by default', () => {
			expect(kbSim.ctxElm).to.equal(doc.body);
		});

		it('Returns a given HTML element when explicitly set with `.setContextElm()`', () => {
			expect(kbSim.ctxElm).to.equal(doc.body);
			kbSim.setContextElm(input);
			expect(kbSim.ctxElm).to.equal(input);
		});

		it('Returns `document.activeElement` (focus)', () => {
			expect(kbSim.ctxElm).to.equal(doc.body);
			input.focus();
			expect(kbSim.ctxElm).to.equal(input);
			input.blur();
			expect(kbSim.ctxElm).to.equal(doc.body);
		});

		it('Explicit `.setContextElm()` overtakes `document.activeElement`', () => {
			expect(kbSim.ctxElm).to.equal(doc.body);
			input.focus();
			expect(kbSim.ctxElm).to.equal(input);
			input.blur();
			expect(kbSim.ctxElm).to.equal(doc.body);
			kbSim.setContextElm(doc);
			input.focus();
			expect(kbSim.ctxElm).to.equal(doc);

			input.blur();
			kbSim.setContextElm(doc.body);
		});

		it('Returns `document` if no active element', () => {
			const {body} = doc; // Because .remove() leaves doc.body = null

			expect(kbSim.ctxElm).to.equal(doc.body);
			doc.body.remove();
			expect(kbSim.ctxElm).to.equal(doc);

			doc.documentElement.appendChild(body);
			kbSim.setContextElm(body);
		});
	});
});
