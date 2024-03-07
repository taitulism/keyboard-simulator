import {JSDOM} from 'jsdom';
import {MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyName, KeyboardSimulator} from '../src';
import {extractLastEvent} from './utils';

describe('Alternative Values', () => {
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

	describe.todo('When `Numlock` is ON');

	describe('When holding `Shift`', () => {
		it('Letters', () => {
			const letters = [
				'A', 'B', 'C', 'D', 'E', 'F', 'G',
				'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
				'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			] as const;

			// Without `Shift`
			letters.forEach((letter) => {
				kbSim.keyDown(letter);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(letter.toLowerCase());
				kbSim.keyUp(letter);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			letters.forEach((letter) => {
				kbSim.keyDown(letter);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(letter);
				kbSim.keyUp(letter);
			});
		});

		it('Numbers', () => {
			const numbers = new Map<KeyName, string>([
				['1', '!'],
				['2', '@'],
				['3', '#'],
				['4', '$'],
				['5', '%'],
				['6', '^'],
				['7', '&'],
				['8', '*'],
				['9', '('],
				['0', ')'],
			]);

			// Without `Shift`
			numbers.forEach((symbol, number) => {
				kbSim.keyDown(number);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(number);
				kbSim.keyUp(number);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			numbers.forEach((symbol, number) => {
				kbSim.keyDown(number);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(symbol);
				kbSim.keyUp(number);
			});
		});

		it('Other Characters', () => {
			const chars = new Map<KeyName, [string, string]>([
				['Slash', ['/', '?']],
				['BackSlash', ['\\', '|']],
				['Period', ['.', '>']],
				['Comma', [',', '<']],
				['Quote', ['\'', '"']],
				['Backquote', ['`', '~']],
				['Semicolon', [';', ':']],
				['BracketLeft', ['[', '{']],
				['BracketRight', [']', '}']],
				['Minus', ['-', '_']],
				['Equal', ['=', '+']],
			]);

			// Without `Shift`
			chars.forEach(([value], keyName) => {
				kbSim.keyDown(keyName);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(value);
				kbSim.keyUp(keyName);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			chars.forEach(([value, alternativeValue], keyName) => {
				kbSim.keyDown(keyName);

				const ev = extractLastEvent(spy);

				expect(ev.key).to.equal(alternativeValue);
				kbSim.keyUp(keyName);
			});
		});
	});
});
