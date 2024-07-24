import {JSDOM} from 'jsdom';
import {MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('Modifiers', () => {
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
		spy.mockReset();
	});

	afterAll(() => {
		spy.mockRestore();
	});

	describe('Modifiers', () => {
		describe('Ctrl', () => {
			it('.keyDown(Ctrl)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Ctrl');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.ctrlKey).to.true;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Ctrl)', () => {
				kbSim.keyDown('Ctrl');
				expect(spy.mock.calls.length).to.equal(1);
				kbSim.keyUp('Ctrl');
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Control');
				expect(ev.code).to.equal('ControlLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Ctrl)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Ctrl');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Control');
				expect(secondLastEv.code).to.equal('ControlLeft');
				expect(lastEv.key).to.equal('Control');
				expect(lastEv.code).to.equal('ControlLeft');
				expect(secondLastEv.ctrlKey).to.true;
				expect(lastEv.ctrlKey).to.false;
			});
		});

		describe('Alt', () => {
			it('.keyDown(Alt)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Alt');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Alt');
				expect(ev.code).to.equal('AltLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.true;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Alt)', () => {
				kbSim.keyDown('Alt');
				expect(spy.mock.calls.length).to.equal(1);
				kbSim.keyUp('Alt');
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Alt');
				expect(ev.code).to.equal('AltLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Alt)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Alt');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Alt');
				expect(secondLastEv.code).to.equal('AltLeft');
				expect(lastEv.key).to.equal('Alt');
				expect(lastEv.code).to.equal('AltLeft');
				expect(secondLastEv.altKey).to.true;
				expect(lastEv.altKey).to.false;
			});
		});

		describe('Shift', () => {
			it('.keyDown(Shift)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Shift');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Shift');
				expect(ev.code).to.equal('ShiftLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.true;
				expect(ev.metaKey).to.false;
			});

			it('.keyUp(Shift)', () => {
				kbSim.keyDown('Shift');
				expect(spy.mock.calls.length).to.equal(1);
				kbSim.keyUp('Shift');
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Shift');
				expect(ev.code).to.equal('ShiftLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Shift)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Shift');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Shift');
				expect(secondLastEv.code).to.equal('ShiftLeft');
				expect(lastEv.key).to.equal('Shift');
				expect(lastEv.code).to.equal('ShiftLeft');
				expect(secondLastEv.shiftKey).to.true;
				expect(lastEv.shiftKey).to.false;
			});
		});

		describe('Meta', () => {
			it('.keyDown(Meta)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown('Meta');
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Meta');
				expect(ev.code).to.equal('MetaLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.true;
			});

			it('.keyUp(Meta)', () => {
				kbSim.keyDown('Meta');
				expect(spy.mock.calls.length).to.equal(1);
				kbSim.keyUp('Meta');
				expect(spy.mock.calls.length).to.equal(2);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal('Meta');
				expect(ev.code).to.equal('MetaLeft');
				expect(ev.ctrlKey).to.false;
				expect(ev.altKey).to.false;
				expect(ev.shiftKey).to.false;
				expect(ev.metaKey).to.false;
			});

			it('.keyPress(Meta)', () => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyPress('Meta');
				expect(spy.mock.calls.length).to.equal(2);

				const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

				expect(secondLastEv.key).to.equal('Meta');
				expect(secondLastEv.code).to.equal('MetaLeft');
				expect(lastEv.key).to.equal('Meta');
				expect(lastEv.code).to.equal('MetaLeft');
				expect(secondLastEv.metaKey).to.true;
				expect(lastEv.metaKey).to.false;
			});
		});
	});

	describe('Multi Modifiers', () => {
		it('ctrl-alt-a', () => {
			kbSim.keyDown('Ctrl');

			const ev1 = extractLastEvent(spy);

			expect(ev1.ctrlKey).to.true;
			expect(ev1.altKey).to.false;
			expect(ev1.shiftKey).to.false;
			expect(ev1.metaKey).to.false;

			kbSim.keyDown('Alt');

			const ev2 = extractLastEvent(spy);

			expect(ev2.ctrlKey).to.true;
			expect(ev2.altKey).to.true;
			expect(ev2.shiftKey).to.false;
			expect(ev2.metaKey).to.false;

			kbSim.keyDown('A');

			const ev3 = extractLastEvent(spy);

			expect(ev3.ctrlKey).to.true;
			expect(ev3.altKey).to.true;
			expect(ev3.shiftKey).to.false;
			expect(ev3.metaKey).to.false;

			// --- keyup / keydown splitter

			kbSim.keyUp('A');

			const ev4 = extractLastEvent(spy);

			expect(ev4.ctrlKey).to.true;
			expect(ev4.altKey).to.true;
			expect(ev4.shiftKey).to.false;
			expect(ev4.metaKey).to.false;

			kbSim.keyUp('Alt');

			const ev5 = extractLastEvent(spy);

			expect(ev5.ctrlKey).to.true;
			expect(ev5.altKey).to.false;
			expect(ev5.shiftKey).to.false;
			expect(ev5.metaKey).to.false;

			kbSim.keyUp('Ctrl');

			const ev6 = extractLastEvent(spy);

			expect(ev6.ctrlKey).to.false;
			expect(ev6.altKey).to.false;
			expect(ev6.shiftKey).to.false;
			expect(ev6.metaKey).to.false;
		});
	});
});
