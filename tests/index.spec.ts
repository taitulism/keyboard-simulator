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

		it('.hold()', () => {
			expect(kbSim).toHaveProperty('hold');
			expect(kbSim.hold).to.be.a('function');
		});

		it('.holdRepeat()', () => {
			expect(kbSim).toHaveProperty('holdRepeat');
			expect(kbSim.hold).to.be.a('function');
		});

		it('.release()', () => {
			expect(kbSim).toHaveProperty('release');
			expect(kbSim.release).to.be.a('function');
		});
	});
});
