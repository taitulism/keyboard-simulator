import {JSDOM, DOMWindow} from 'jsdom';
import {MockInstance, afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('API', () => {
	let doc: Document | undefined;
	let spy: MockInstance;
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		doc = dom.window.document;
		spy = vi.spyOn(doc, 'dispatchEvent');
		kbSim = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		kbSim.reset();
		spy.mockClear();
	});

	afterAll(() => {
		spy.mockRestore();
	});

	describe('Dispatching', () => {
		describe('.keyDown()', () => {
			it('Dispatches "keydown" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(false);
			});

			it('Handles multiple keys', () => {
				kbSim.keyDown('Ctrl', 'A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keydown');
			});

			it('For a single key: returns a "cancelable" boolean', () => {
				const single = kbSim.keyDown('A');

				expect(single).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of "cancelable" booleans', () => {
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
				expect(spy.mock.calls.length).to.equal(1);
				kbSim.keyUp('A');
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Handles multiple keys', () => {
				kbSim.keyDown('Ctrl', 'A');
				expect(spy.mock.calls.length).to.equal(2);
				kbSim.keyUp('Ctrl', 'A');
				expect(spy.mock.calls.length).to.equal(4);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keyup');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');
			});

			it('For a single key: returns a "cancelable" boolean', () => {
				kbSim.keyDown('A');

				const single = kbSim.keyUp('A');

				expect(single).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of "cancelable" booleans', () => {
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
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.code).to.equal('KeyA');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');

			});

			it('Handles multiple keys', () => {
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

			it('For a single key: returns an array of "cancelable" booleans', () => {
				const single = kbSim.keyPress('A');

				expect(single).to.be.an('Array');
				expect(single).to.have.lengthOf(2);
				expect(single[0]).to.be.a('Boolean');
				expect(single[1]).to.be.a('Boolean');
			});

			it('For multiple keys: returns an array of array of "cancelable" booleans', () => {
				const multi = kbSim.keyPress('A', 'B');

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
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.holdKey('Ctrl', 3);
				expect(spy.mock.calls.length).to.equal(3);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(true);
			});

			it('Returns an array of "cancelable" booleans', () => {
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
				expect(spy.mock.calls.length).to.equal(1);

				kbSim.releaseAll();
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Releases all held keys in reverse order', () => {
				kbSim.keyDown('A', 'B', 'C');
				expect(spy.mock.calls.length).to.equal(3);

				kbSim.releaseAll();
				expect(spy.mock.calls.length).to.equal(6);

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
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.releaseAll();
			expect(spy.mock.calls.length).to.equal(6);

			spy.mockReset();

			kbSim.keyDown('A', 'B', 'C');
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.reset();
			kbSim.releaseAll();
			expect(spy.mock.calls.length).to.equal(3);
		});
	});

	describe('.setContextElm()', () => {
		let win: DOMWindow | undefined;
		let doc: Document | undefined;
		let input: HTMLInputElement;
		let kbSim: KeyboardSimulator;
		let docDispatchSpy: MockInstance;
		let inputDispatchSpy: MockInstance;

		beforeAll(() => {
			const dom = new JSDOM('<input id="input" type="text" />', {url: 'http://localhost'});

			win = dom.window;
			doc = dom.window.document;
			input = doc!.getElementById('input') as HTMLInputElement;
			kbSim = new KeyboardSimulator(doc);
		});

		beforeEach(() => {
			docDispatchSpy = vi.spyOn(doc!, 'dispatchEvent');
			inputDispatchSpy = vi.spyOn(input, 'dispatchEvent');
		});

		afterEach(() => {
			docDispatchSpy.mockRestore();
			inputDispatchSpy.mockRestore();
		});

		it('Changes the element that gets the keyboard events', () => {
			kbSim.keyPress('A');
			kbSim.setContextElm(input);
			kbSim.keyPress('B');

			const evBefore = extractLastEvent(docDispatchSpy);
			const evAfter = extractLastEvent(inputDispatchSpy);

			expect(evBefore.target).to.equal(doc);
			expect(evAfter.target).to.be.instanceOf(win!.HTMLInputElement);
		});

		it('Returns the instance', () => {
			const instance = kbSim.setContextElm(input);

			expect(instance).to.equal(kbSim);
		});
	});
});
