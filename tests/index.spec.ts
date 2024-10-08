import {JSDOM} from 'jsdom';
import {describe, it, expect, beforeAll} from 'vitest';
import {KeyboardSimulator} from '../src';

describe('KeyboardSimulator', () => {
	let kbSim: KeyboardSimulator;

	beforeAll(() => {
		const dom = new JSDOM('', {url: 'http://localhost'});
		const doc = dom.window.document;

		kbSim = new KeyboardSimulator(doc);
	});

	describe('instance methods', () => {
		it('.keyDown()', () => {
			expect(kbSim).toHaveProperty('keyDown');
			expect(kbSim.keyDown).to.be.a('function');
		});

		it('.keyUp()', () => {
			expect(kbSim).toHaveProperty('keyUp');
			expect(kbSim.keyUp).to.be.a('function');
		});

		it('.keyPress()', () => {
			expect(kbSim).toHaveProperty('keyPress');
			expect(kbSim.keyPress).to.be.a('function');
		});

		it('.combine()', () => {
			expect(kbSim).toHaveProperty('combine');
			expect(kbSim.combine).to.be.a('function');
		});

		it('.holdKey()', () => {
			expect(kbSim).toHaveProperty('holdKey');
			expect(kbSim.holdKey).to.be.a('function');
		});

		it('.setContextElm()', () => {
			expect(kbSim).toHaveProperty('setContextElm');
			expect(kbSim.setContextElm).to.be.a('function');
		});

		it('.release()', () => {
			expect(kbSim).toHaveProperty('release');
			expect(kbSim.release).to.be.a('function');
		});

		it('.reset()', () => {
			expect(kbSim).toHaveProperty('reset');
			expect(kbSim.reset).to.be.a('function');
		});
	});
});
