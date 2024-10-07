import {JSDOM, DOMWindow} from 'jsdom';
import {MockInstance, beforeAll, beforeEach, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('API', () => {
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

	describe('Constructor', () => {
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

	describe('Dispatching', () => {
		describe('.keyDown()', () => {
			it('Dispatches "keydown" event', () => {
				expect(spy).not.toHaveBeenCalled();
				kbSim.keyDown('A');
				expect(spy).toHaveBeenCalledOnce();

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(false);
				expect(ev.location).to.equal(1);
				expect(ev.bubbles).to.equal(true);
				expect(ev.cancelable).to.equal(true);
				expect(ev.composed).to.equal(true);
				expect(ev.isComposing).to.equal(false);
				expect(ev.view).to.equal(doc?.defaultView);
			});

			it('Handles multiple keys', () => {
				kbSim.keyDown('Ctrl', 'A');
				expect(spy).toHaveBeenCalledTimes(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keydown');
			});

			it('For a single key: returns a "canceled" boolean', () => {
				const single = kbSim.keyDown('A');

				expect(single).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of "canceled" booleans', () => {
				const multi = kbSim.keyDown('A', 'B');

				expect(multi).to.be.an('Array');
				expect(multi).to.have.lengthOf(2);
				expect(multi[0]).to.be.a('Boolean');
				expect(multi[1]).to.be.a('Boolean');
			});

			it('Throws on unsupported key', () => {
				const nonExistKey = () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					kbSim.keyDown('No Key');
				};

				expect(nonExistKey).toThrowError('Unknown key name: No Key');
			});

			it('Throws when key is already down', () => {
				const keyAlreadyDown = () => {
					kbSim.keyDown('A');
					kbSim.keyDown('A');
				};

				expect(keyAlreadyDown).toThrowError('"KeyA" is already pressed down');
			});
		});

		describe('.keyUp()', () => {
			it('Dispatches "keyup" event', () => {
				kbSim.keyDown('A');
				expect(spy).toHaveBeenCalledOnce();
				kbSim.keyUp('A');
				expect(spy).toHaveBeenCalledTimes(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Handles multiple keys', () => {
				kbSim.keyDown('Ctrl', 'A');
				expect(spy).toHaveBeenCalledTimes(2);
				kbSim.keyUp('Ctrl', 'A');
				expect(spy).toHaveBeenCalledTimes(4);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keyup');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');
			});

			it('For a single key: returns a "canceled" boolean', () => {
				kbSim.keyDown('A');

				const single = kbSim.keyUp('A');

				expect(single).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of "canceled" booleans', () => {
				kbSim.keyDown('A', 'B');

				const multi = kbSim.keyUp('A', 'B');

				expect(multi).to.be.an('Array');
				expect(multi).to.have.lengthOf(2);
				expect(multi[0]).to.be.a('Boolean');
				expect(multi[1]).to.be.a('Boolean');
			});

			it('Throws on unsupported key', () => {
				const nonExistKey = () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					kbSim.keyUp('No Key');
				};

				expect(nonExistKey).toThrowError('Unknown key name: No Key');
			});

			it('Throws when key is not down', () => {
				const keyAlreadyUp = () => {
					kbSim.keyDown('A');
					kbSim.keyUp('A');
					kbSim.keyUp('A');
				};

				expect(keyAlreadyUp).toThrowError('"KeyA" is not pressed down');
			});
		});

		describe('.keyPress()', () => {
			it('Dispatches "keydown" & "keyup" events', () => {
				expect(spy).not.toHaveBeenCalled();
				kbSim.keyPress('A');
				expect(spy).toHaveBeenCalledTimes(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.code).to.equal('KeyA');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');
			});

			it('Handles multiple key presses, one after another', () => {
				kbSim.keyPress('A', 'B');

				const [ev1, ev2, ev3, ev4] = extractLastEvents(spy, 4);

				expect(ev1.key).to.equal('a');
				expect(ev1.code).to.equal('KeyA');
				expect(ev1.type).to.equal('keydown');

				expect(ev2.key).to.equal('a');
				expect(ev2.code).to.equal('KeyA');
				expect(ev2.type).to.equal('keyup');

				expect(ev3.key).to.equal('b');
				expect(ev3.code).to.equal('KeyB');
				expect(ev3.type).to.equal('keydown');

				expect(ev4.key).to.equal('b');
				expect(ev4.code).to.equal('KeyB');
				expect(ev4.type).to.equal('keyup');
			});

			it('For a single key: returns a tuple of two "canceled" booleans', () => {
				const single = kbSim.keyPress('A');

				expect(single).to.be.an('Array');
				expect(single).to.have.lengthOf(2);
				expect(single[0]).to.be.a('Boolean');
				expect(single[1]).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of tuples of two "canceled" booleans', () => {
				const multi = kbSim.keyPress('A', 'B');

				// multi = [[true, true], [true, true]]
				expect(multi).to.be.an('Array');
				expect(multi).to.have.lengthOf(2);
				expect(multi[0]).to.be.an('Array');
				expect(multi[0]).to.have.lengthOf(2);
				expect(multi[0][0]).to.be.a('Boolean');
				expect(multi[0][1]).to.be.a('Boolean');
				expect(multi[1]).to.be.an('Array');
				expect(multi[1]).to.have.lengthOf(2);
				expect(multi[1][0]).to.be.a('Boolean');
				expect(multi[1][1]).to.be.a('Boolean');
			});
		});

		describe('.keyPressAsOne()', () => {
			it('Handles multiple keys combination', () => {
				expect(spy).not.toHaveBeenCalled();
				kbSim.keyPressAsOne(['Ctrl', 'A']);
				expect(spy).toHaveBeenCalledTimes(4);

				const [ev1, ev2, ev3, ev4] = extractLastEvents(spy, 4);

				expect(ev1.code).to.equal('ControlLeft');
				expect(ev1.type).to.equal('keydown');

				expect(ev2.code).to.equal('KeyA');
				expect(ev2.type).to.equal('keydown');
				expect(ev2.ctrlKey).toBe(true);

				expect(ev3.code).to.equal('KeyA');
				expect(ev3.type).to.equal('keyup');
				expect(ev2.ctrlKey).toBe(true);

				expect(ev4.code).to.equal('ControlLeft');
				expect(ev4.type).to.equal('keyup');
			});

			it('Returns an array of tuples of two "canceled" booleans', () => {
				const multi = kbSim.keyPressAsOne(['A', 'B']);

				// multi = [[true, true], [true, true]]
				expect(multi).to.be.an('Array');
				expect(multi).to.have.lengthOf(2);
				expect(multi[0]).to.be.an('Array');
				expect(multi[0]).to.have.lengthOf(2);
				expect(multi[0][0]).to.be.a('Boolean');
				expect(multi[0][1]).to.be.a('Boolean');
				expect(multi[1]).to.be.an('Array');
				expect(multi[1]).to.have.lengthOf(2);
				expect(multi[1][0]).to.be.a('Boolean');
				expect(multi[1][1]).to.be.a('Boolean');
			});
		});

		describe('.holdKey()', () => {
			it('Dispatches multiple "keydown" events with `repeat: true`', () => {
				expect(spy).not.toHaveBeenCalled();
				kbSim.holdKey('Ctrl', 3);
				expect(spy).toHaveBeenCalledTimes(3);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(true);
				expect(ev.location).to.equal(1);
				expect(ev.bubbles).to.equal(true);
				expect(ev.cancelable).to.equal(true);
				expect(ev.composed).to.equal(true);
				expect(ev.isComposing).to.equal(false);
				expect(ev.view).to.equal(doc?.defaultView);
			});

			it('Returns an array of "canceled" booleans', () => {
				const events = kbSim.holdKey('A', 3);

				expect(events).to.be.an('Array');
				expect(events).to.have.lengthOf(3);
				expect(events[0]).to.be.a('Boolean');
				expect(events[1]).to.be.a('Boolean');
				expect(events[2]).to.be.a('Boolean');
			});

			it('Throws when key is already down', () => {
				const keyAlreadyDown = () => {
					kbSim.keyDown('A');
					kbSim.holdKey('A', 2);
				};

				expect(keyAlreadyDown).toThrowError('"KeyA" is already pressed down');
			});
		});

		describe('.releaseAll()', () => {
			it('Dispatches "keyup" event', () => {
				kbSim.keyDown('A');
				expect(spy).toHaveBeenCalledOnce();

				kbSim.releaseAll();
				expect(spy).toHaveBeenCalledTimes(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Releases all held keys in reverse order', () => {
				kbSim.keyDown('A', 'B', 'C');
				expect(spy).toHaveBeenCalledTimes(3);

				kbSim.releaseAll();
				expect(spy).toHaveBeenCalledTimes(6);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Releases Modifiers', () => {
				// Without `Ctrl`
				kbSim.keyDown('A');

				const ev1 = extractLastEvent(spy);

				expect(ev1.key).to.equal('a');
				expect(ev1.ctrlKey).toBe(false); // <--

				kbSim.keyUp('A');

				// With `Ctrl`
				kbSim.keyDown('Ctrl', 'A');

				const ev2 = extractLastEvent(spy);

				expect(ev2.key).to.equal('a');
				expect(ev2.ctrlKey).toBe(true); // <--

				kbSim.releaseAll(); // Should release `Ctrl`

				// Without `Ctrl`
				kbSim.keyDown('A');

				const ev3 = extractLastEvent(spy);

				expect(ev3.key).to.equal('a');
				expect(ev3.ctrlKey).toBe(false); // <--
			});
		});
	});

	describe('.reset()', () => {
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

		it.skip('Resets toggler buttons', () => {
			kbSim.keyPress('A');
			kbSim.keyPress('Np2');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [letterEventBefore, _1, numberEventBefore, _2] = extractLastEvents(spy, 4);

			expect(letterEventBefore.key).to.equal('a');
			expect(numberEventBefore.key).to.equal('2');

			kbSim.keyPress('NumLock'); // On -> Off
			kbSim.keyPress('CapsLock'); // Off -> On

			kbSim.keyPress('A');
			kbSim.keyPress('Np2');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [letterEventAfter, _3, numberEventAfter, _4] = extractLastEvents(spy, 4);

			expect(letterEventAfter.key).to.equal('A');
			expect(numberEventAfter.key).to.equal('ArrowDown');

			kbSim.reset();

			kbSim.keyPress('A');
			kbSim.keyPress('Np2');

			expect(letterEventBefore.key).to.equal('a');
			expect(numberEventBefore.key).to.equal('2');
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

		describe('Getter: .ctxElm()', () => {
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
});
