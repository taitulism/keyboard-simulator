import {JSDOM} from 'jsdom';
import {MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractTwoLastEvents} from './utils';

describe('Dispatching', () => {
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

			it('Throws on unsupported key', () => {
				const nonExistKey = () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					kbSim.keyDown('No Key');
				};

				expect(nonExistKey).toThrowError('Unknown key name: No Key');
			});
		});

		describe('.keyUp()', () => {
			it('Dispatches "keyup" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyUp('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Throws on unsupported key', () => {
				const nonExistKey = () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					kbSim.keyUp('No Key');
				};

				expect(nonExistKey).toThrowError('Unknown key name: No Key');
			});
		});

		describe('.keyPress()', () => {
			it('Dispatches "keydown" & "keyup" events', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.code).to.equal('KeyA');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keyup');

			});
		});

		describe('.holdRepeat()', () => {
			it('Dispatches "keydown" event with `repeat: true`', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.holdRepeat('A', 3);
				expect(spy.mock.calls.length).to.equal(3);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
				expect(ev.repeat).to.equal(true);
			});
		});

		describe('.hold()', () => {
			it('Dispatches "keydown" event', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.hold('A');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keydown');
			});

			it('Handles multiple keys', () => {
				kbSim.hold('Ctrl', 'A');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.type).to.equal('keydown');

				expect(lastEv.key).to.equal('a');
				expect(lastEv.code).to.equal('KeyA');
				expect(lastEv.type).to.equal('keydown');
			});

			it('Accumulates sequencing calls', () => {
				kbSim.hold('Ctrl');
				kbSim.hold('A');
				kbSim.release();

				expect(spy.mock.calls.length).to.equal(4);

				const [secondLastEv, lastEv] = extractTwoLastEvents(spy);

				expect(secondLastEv.key).to.equal('a');
				expect(secondLastEv.type).to.equal('keyup');

				expect(lastEv.key).to.equal('Control');
				expect(lastEv.type).to.equal('keyup');
			});
		});

		describe('.release()', () => {
			it('Dispatches "keyup" event', () => {
				kbSim.hold('A');
				expect(spy.mock.calls.length).to.equal(1);

				kbSim.release();
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});

			it('Releases all held keys in reverse order', () => {
				kbSim.hold('A', 'B', 'C');
				expect(spy.mock.calls.length).to.equal(3);

				kbSim.release();
				expect(spy.mock.calls.length).to.equal(6);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('a');
				expect(ev.code).to.equal('KeyA');
				expect(ev.type).to.equal('keyup');
			});
		});
	});

	describe('.reset()', () => {
		it('Resets pressed modifiers', () => {
			kbSim.keyDown('Ctrl');
			kbSim.keyDown('A');

			let ev = extractLastEvent(spy);

			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.keyDown('A');
			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.true; // <--

			kbSim.reset();

			kbSim.keyDown('A');
			ev = extractLastEvent(spy);
			expect(ev.key).to.equal('a');
			expect(ev.ctrlKey).to.false; // <--

		});

		it('Resets held keys', () => {
			kbSim.hold('A', 'B', 'C');
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.release();
			expect(spy.mock.calls.length).to.equal(6);

			spy.mockReset();

			kbSim.hold('A', 'B', 'C');
			expect(spy.mock.calls.length).to.equal(3);
			kbSim.reset();
			kbSim.release();
			expect(spy.mock.calls.length).to.equal(3);
		});
	});
});
