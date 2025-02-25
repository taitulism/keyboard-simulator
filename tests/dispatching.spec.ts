import {JSDOM} from 'jsdom';
import {MockInstance, beforeAll, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('Dispatching', () => {
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
			expect(ev.view).to.equal(doc.defaultView);
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
			expect(ev.repeat).to.equal(false);
			expect(ev.location).to.equal(1);
			expect(ev.bubbles).to.equal(true);
			expect(ev.cancelable).to.equal(true);
			expect(ev.composed).to.equal(true);
			expect(ev.isComposing).to.equal(false);
			expect(ev.view).to.equal(doc.defaultView);
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

	describe('.combine()', () => {
		it('Handles multiple keys combination', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.combine('Ctrl', 'A');
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
			// results = [[true, true, true], [true, true, true]]
			const results = kbSim.combine('A', 'B', 'C');

			expect(results).to.be.an('Array');
			expect(results).to.have.lengthOf(2);

			const [keydownResults, keyupResults] = results;

			expect(keydownResults).to.be.an('Array');
			expect(keydownResults).to.have.lengthOf(3);
			expect(keydownResults[0]).to.be.a('Boolean');
			expect(keydownResults[1]).to.be.a('Boolean');
			expect(keydownResults[2]).to.be.a('Boolean');

			expect(keyupResults).to.be.an('Array');
			expect(keyupResults).to.have.lengthOf(3);
			expect(keyupResults[0]).to.be.a('Boolean');
			expect(keyupResults[1]).to.be.a('Boolean');
			expect(keyupResults[2]).to.be.a('Boolean');
		});
	});

	describe('.repeat()', () => {
		it('Dispatches multiple "keydown" events with `repeat: true`', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyDown('A', 'B', 'C');
			expect(spy).toHaveBeenCalledTimes(3);
			kbSim.repeat(3);
			expect(spy).toHaveBeenCalledTimes(6);

			const events = extractLastEvents(spy, 3);

			expect(events[0].code).to.equal('KeyC');
			expect(events[0].type).to.equal('keydown');
			expect(events[0].repeat).to.equal(true);

			expect(events[1].code).to.equal('KeyC');
			expect(events[1].type).to.equal('keydown');
			expect(events[1].repeat).to.equal(true);

			expect(events[2].code).to.equal('KeyC');
			expect(events[2].type).to.equal('keydown');
			expect(events[2].repeat).to.equal(true);
		});

		it('Returns an array of "canceled" booleans', () => {
			kbSim.keyDown('A', 'B', 'C');

			const results = kbSim.repeat(3);

			expect(results).to.be.an('Array');
			expect(results).to.have.lengthOf(3);
			expect(results[0]).to.be.a('Boolean');
			expect(results[1]).to.be.a('Boolean');
			expect(results[2]).to.be.a('Boolean');
		});

		it('Throws when no keys are held down', () => {
			const noPressedKeys = () => {
				kbSim.repeat(2);
			};

			expect(noPressedKeys).toThrowError('Cannot repeat. No keys are pressed down.');
		});
	});

	describe('.release()', () => {
		it('Dispatches "keyup" events for all held down keys', () => {
			kbSim.keyDown('A', 'B', 'C');
			expect(spy).toHaveBeenCalledTimes(3);
			kbSim.release();
			expect(spy).toHaveBeenCalledTimes(6);

			const events = extractLastEvents(spy, 3);

			expect(events[0].type).to.equal('keyup');
			expect(events[1].type).to.equal('keyup');
			expect(events[2].type).to.equal('keyup');
		});

		it('For an explicit single key: returns a "canceled" boolean', () => {
			kbSim.keyDown('A');

			const single = kbSim.release('A');

			expect(single).to.be.a('Boolean');
		});

		it('For explicit multiple keys: returns an array of "canceled" booleans', () => {
			kbSim.keyDown('A', 'B');

			const multi = kbSim.release('B', 'A');

			expect(multi).to.be.an('Array');
			expect(multi).to.have.lengthOf(2);
			expect(multi[0]).to.be.a('Boolean');
			expect(multi[1]).to.be.a('Boolean');
		});

		it('For an implicit single key: returns a "canceled" boolean', () => {
			kbSim.keyDown('A');

			const single = kbSim.release();

			expect(single).to.be.a('Boolean');
		});

		it('For implicit multiple keys: returns an array of "canceled" booleans', () => {
			kbSim.keyDown('A', 'B');

			const multi = kbSim.release();

			expect(multi).to.be.an('Array');
			expect(multi).to.have.lengthOf(2);
			expect(multi[0]).to.be.a('Boolean');
			expect(multi[1]).to.be.a('Boolean');
		});

		it('Releases held keys in reverse order', () => {
			kbSim.keyDown('A', 'B', 'C');
			expect(spy).toHaveBeenCalledTimes(3);

			let events = extractLastEvents(spy, 3);

			expect(events[0].code).to.equal('KeyA'); // <-- A
			expect(events[1].code).to.equal('KeyB');
			expect(events[2].code).to.equal('KeyC');

			kbSim.release();
			expect(spy).toHaveBeenCalledTimes(6);

			events = extractLastEvents(spy, 3);

			expect(events[0].code).to.equal('KeyC');
			expect(events[1].code).to.equal('KeyB');
			expect(events[2].code).to.equal('KeyA'); // <-- A
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

			kbSim.release(); // Should release `Ctrl`

			// Without `Ctrl`
			kbSim.keyDown('A');

			const ev3 = extractLastEvent(spy);

			expect(ev3.key).to.equal('a');
			expect(ev3.ctrlKey).toBe(false); // <--
		});
	});
});
