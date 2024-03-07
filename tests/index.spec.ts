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

		it('.reset()', () => {
			expect(kbSim).toHaveProperty('reset');
			expect(kbSim.reset).to.be.a('function');
		});

		it('.holdRepeat()', () => {
			expect(kbSim).toHaveProperty('holdRepeat');
			expect(kbSim.holdRepeat).to.be.a('function');
		});

		it('.releaseAll()', () => {
			expect(kbSim).toHaveProperty('releaseAll');
			expect(kbSim.releaseAll).to.be.a('function');
		});
	});
});
