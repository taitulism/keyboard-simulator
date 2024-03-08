import {JSDOM} from 'jsdom';
import {MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('API', () => {
	let doc: Document | undefined;
	let spy: MockInstance<[event: Event], boolean>;
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});

		doc = dom.window.document;
		spy = vi.spyOn(doc, 'dispatchEvent');
		kbSim = new KeyboardSimulator(doc);
	});

	beforeEach(() => {
		kbSim.reset();
		spy.mockReset();
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

				const {calls} = spy.mock;

				expect(calls.length).to.equal(4);

				const [[ev1], [ev2], [ev3], [ev4]] = calls;

				// TODO:ts
				expect((ev1 as KeyboardEvent).key).to.equal('a');
				expect((ev1 as KeyboardEvent).code).to.equal('KeyA');
				expect((ev1 as KeyboardEvent).type).to.equal('keydown');

				expect((ev2 as KeyboardEvent).key).to.equal('a');
				expect((ev2 as KeyboardEvent).code).to.equal('KeyA');
				expect((ev2 as KeyboardEvent).type).to.equal('keyup');

				expect((ev3 as KeyboardEvent).key).to.equal('b');
				expect((ev3 as KeyboardEvent).code).to.equal('KeyB');
				expect((ev3 as KeyboardEvent).type).to.equal('keydown');

				expect((ev4 as KeyboardEvent).key).to.equal('b');
				expect((ev4 as KeyboardEvent).code).to.equal('KeyB');
				expect((ev4 as KeyboardEvent).type).to.equal('keyup');
			});
		});

		describe('.holdKey()', () => {
			it('Dispatches "keydown" event with `repeat: true`', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.holdKey('A', 3);
				expect(spy.mock.calls.length).to.equal(3);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(true);
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
				expect(ev1.ctrlKey).to.false; // <--

				kbSim.keyUp('A');

				// With `Ctrl`
				kbSim.keyDown('Ctrl', 'A');

				const ev2 = extractLastEvent(spy);

				expect(ev2.key).to.equal('a');
				expect(ev2.ctrlKey).to.true; // <--

				kbSim.releaseAll(); // Should release `Ctrl`

				// Without `Ctrl`
				kbSim.keyDown('A');

				const ev3 = extractLastEvent(spy);

				expect(ev3.key).to.equal('a');
				expect(ev3.ctrlKey).to.false; // <--
			});
		});
	});

	describe('.reset()', () => {
		it('Resets pressed modifiers', () => {
			kbSim.keyDown('Ctrl', 'A');

			let ev = extractLastEvent(spy);

			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.keyUp('A');
			kbSim.keyDown('B');

			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('b');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.keyUp('B');
			kbSim.reset();
			kbSim.keyDown('C');

			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('c');
			expect(ev.ctrlKey).to.false; // <--
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
});
