import {JSDOM} from 'jsdom';
import {MockInstance, beforeAll, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {KeyboardSimulator} from '../src';
import {extractLastEvent, extractLastEvents} from './utils';

describe('Modifiers', () => {
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

	describe('Ctrl', () => {
		it('.keyDown(Ctrl)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyDown('Ctrl');
			expect(spy).toHaveBeenCalledOnce();

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Control');
			expect(ev.code).to.equal('ControlLeft');
			expect(ev.ctrlKey).toBe(true);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyUp(Ctrl)', () => {
			kbSim.keyDown('Ctrl');
			expect(spy).toHaveBeenCalledOnce();
			kbSim.keyUp('Ctrl');
			expect(spy).toHaveBeenCalledTimes(2);

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Control');
			expect(ev.code).to.equal('ControlLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyPress(Ctrl)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyPress('Ctrl');
			expect(spy).toHaveBeenCalledTimes(2);

			const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

			expect(secondLastEv.key).to.equal('Control');
			expect(secondLastEv.code).to.equal('ControlLeft');
			expect(lastEv.key).to.equal('Control');
			expect(lastEv.code).to.equal('ControlLeft');
			expect(secondLastEv.ctrlKey).toBe(true);
			expect(lastEv.ctrlKey).toBe(false);
		});
	});

	describe('Alt', () => {
		it('.keyDown(Alt)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyDown('Alt');
			expect(spy).toHaveBeenCalledOnce();

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Alt');
			expect(ev.code).to.equal('AltLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(true);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyUp(Alt)', () => {
			kbSim.keyDown('Alt');
			expect(spy).toHaveBeenCalledOnce();
			kbSim.keyUp('Alt');
			expect(spy).toHaveBeenCalledTimes(2);

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Alt');
			expect(ev.code).to.equal('AltLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyPress(Alt)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyPress('Alt');
			expect(spy).toHaveBeenCalledTimes(2);

			const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

			expect(secondLastEv.key).to.equal('Alt');
			expect(secondLastEv.code).to.equal('AltLeft');
			expect(lastEv.key).to.equal('Alt');
			expect(lastEv.code).to.equal('AltLeft');
			expect(secondLastEv.altKey).toBe(true);
			expect(lastEv.altKey).toBe(false);
		});
	});

	describe('Shift', () => {
		it('.keyDown(Shift)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyDown('Shift');
			expect(spy).toHaveBeenCalledOnce();

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Shift');
			expect(ev.code).to.equal('ShiftLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(true);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyUp(Shift)', () => {
			kbSim.keyDown('Shift');
			expect(spy).toHaveBeenCalledOnce();
			kbSim.keyUp('Shift');
			expect(spy).toHaveBeenCalledTimes(2);

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Shift');
			expect(ev.code).to.equal('ShiftLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyPress(Shift)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyPress('Shift');
			expect(spy).toHaveBeenCalledTimes(2);

			const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

			expect(secondLastEv.key).to.equal('Shift');
			expect(secondLastEv.code).to.equal('ShiftLeft');
			expect(lastEv.key).to.equal('Shift');
			expect(lastEv.code).to.equal('ShiftLeft');
			expect(secondLastEv.shiftKey).toBe(true);
			expect(lastEv.shiftKey).toBe(false);
		});
	});

	describe('Meta', () => {
		it('.keyDown(Meta)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyDown('Meta');
			expect(spy).toHaveBeenCalledOnce();

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Meta');
			expect(ev.code).to.equal('MetaLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(true);
		});

		it('.keyUp(Meta)', () => {
			kbSim.keyDown('Meta');
			expect(spy).toHaveBeenCalledOnce();
			kbSim.keyUp('Meta');
			expect(spy).toHaveBeenCalledTimes(2);

			const ev = extractLastEvent(spy);

			expect(ev.key).to.equal('Meta');
			expect(ev.code).to.equal('MetaLeft');
			expect(ev.ctrlKey).toBe(false);
			expect(ev.altKey).toBe(false);
			expect(ev.shiftKey).toBe(false);
			expect(ev.metaKey).toBe(false);
		});

		it('.keyPress(Meta)', () => {
			expect(spy).not.toHaveBeenCalled();
			kbSim.keyPress('Meta');
			expect(spy).toHaveBeenCalledTimes(2);

			const [secondLastEv, lastEv] = extractLastEvents(spy, 2);

			expect(secondLastEv.key).to.equal('Meta');
			expect(secondLastEv.code).to.equal('MetaLeft');
			expect(lastEv.key).to.equal('Meta');
			expect(lastEv.code).to.equal('MetaLeft');
			expect(secondLastEv.metaKey).toBe(true);
			expect(lastEv.metaKey).toBe(false);
		});
	});

	describe('Multi Modifiers', () => {
		it('ctrl-alt-a', () => {
			kbSim.keyDown('Ctrl');

			const ev1 = extractLastEvent(spy);

			expect(ev1.ctrlKey).toBe(true);
			expect(ev1.altKey).toBe(false);
			expect(ev1.shiftKey).toBe(false);
			expect(ev1.metaKey).toBe(false);

			kbSim.keyDown('Alt');

			const ev2 = extractLastEvent(spy);

			expect(ev2.ctrlKey).toBe(true);
			expect(ev2.altKey).toBe(true);
			expect(ev2.shiftKey).toBe(false);
			expect(ev2.metaKey).toBe(false);

			kbSim.keyDown('A');

			const ev3 = extractLastEvent(spy);

			expect(ev3.ctrlKey).toBe(true);
			expect(ev3.altKey).toBe(true);
			expect(ev3.shiftKey).toBe(false);
			expect(ev3.metaKey).toBe(false);

			// --- keyup / keydown splitter

			kbSim.keyUp('A');

			const ev4 = extractLastEvent(spy);

			expect(ev4.ctrlKey).toBe(true);
			expect(ev4.altKey).toBe(true);
			expect(ev4.shiftKey).toBe(false);
			expect(ev4.metaKey).toBe(false);

			kbSim.keyUp('Alt');

			const ev5 = extractLastEvent(spy);

			expect(ev5.ctrlKey).toBe(true);
			expect(ev5.altKey).toBe(false);
			expect(ev5.shiftKey).toBe(false);
			expect(ev5.metaKey).toBe(false);

			kbSim.keyUp('Ctrl');

			const ev6 = extractLastEvent(spy);

			expect(ev6.ctrlKey).toBe(false);
			expect(ev6.altKey).toBe(false);
			expect(ev6.shiftKey).toBe(false);
			expect(ev6.metaKey).toBe(false);
		});
	});
});
