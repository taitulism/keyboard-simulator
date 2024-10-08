import {JSDOM} from 'jsdom';
import {MockInstance, beforeAll, afterAll, afterEach, describe, expect, it, vi} from 'vitest';
import {extractLastEvent} from './utils';
import {KeyId} from '../src/key-id-type';
import {KeyName, KeyboardSimulator} from '../src';

describe('Alternative Values', () => {
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

	describe('When `NumLock` is ON', () => {
		it('Numpad Numbers', () => {
			const numpadKeys = new Map<KeyName, string>([
				['Numpad0', 'Insert'],
				['Numpad1', 'End'],
				['Numpad2', 'ArrowDown'],
				['Numpad3', 'PageDown'],
				['Numpad4', 'ArrowLeft'],
				['Numpad5', 'Clear'],
				['Numpad6', 'ArrowRight'],
				['Numpad7', 'Home'],
				['Numpad8', 'ArrowUp'],
				['Numpad9', 'PageUp'],
				['NumpadDecimal', 'Delete'],
			]);

			// `NumLock` ON
			numpadKeys.forEach((value, keyId) => {
				kbSim.keyDown(keyId);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(keyId);

				if (keyId === 'NumpadDecimal') {
					expect(ev.key).to.equal('.');
				}
				else {
					const digit = keyId[keyId.length - 1]; // NumpadX --> X

					expect(ev.key).to.equal(digit);
				}

				kbSim.keyUp(keyId);
			});

			// `NumLock` OFF
			kbSim.keyPress('NumLock');

			numpadKeys.forEach((nonNumber, keyId) => {
				kbSim.keyDown(keyId);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(keyId);
				expect(ev.key).to.equal(nonNumber);
				kbSim.keyUp(keyId);
			});
		});
	});

	describe('When `CapsLock` is ON', () => {
		it('Letters', () => {
			const letters = [
				'A', 'B', 'C', 'D', 'E', 'F', 'G',
				'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
				'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			] as const;

			// `CapsLock` OFF
			letters.forEach((letter) => {
				kbSim.keyDown(letter);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Key${letter}`);
				expect(ev.key).to.equal(letter.toLowerCase());
				kbSim.keyUp(letter);
			});

			// `CapsLock` ON
			kbSim.keyPress('CapsLock');

			letters.forEach((letter) => {
				kbSim.keyDown(letter);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Key${letter}`);
				expect(ev.key).to.equal(letter.toUpperCase());
				kbSim.keyUp(letter);
			});
		});
	});

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

				expect(ev.code).to.equal(`Key${letter}`);
				expect(ev.key).to.equal(letter.toLowerCase());
				kbSim.keyUp(letter);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			letters.forEach((letter) => {
				kbSim.keyDown(letter);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Key${letter}`);
				expect(ev.key).to.equal(letter.toUpperCase());
				kbSim.keyUp(letter);
			});

			kbSim.keyUp('Shift');
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

				expect(ev.code).to.equal(`Digit${number}`);
				expect(ev.key).to.equal(number);
				kbSim.keyUp(number);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			numbers.forEach((symbol, number) => {
				kbSim.keyDown(number);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Digit${number}`);
				expect(ev.key).to.equal(symbol);
				kbSim.keyUp(number);
			});
		});

		it('Other Characters', () => {
			const chars = new Map<KeyId, [string, string]>([
				['Slash', ['/', '?']],
				['Backslash', ['\\', '|']],
				['IntlBackslash', ['\\', '|']],
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
			chars.forEach(([value], keyId) => {
				kbSim.keyDown(keyId);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(keyId);
				expect(ev.key).to.equal(value);
				kbSim.keyUp(keyId);
			});

			// With `Shift`
			kbSim.keyDown('Shift');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			chars.forEach(([value, alternativeValue], keyId) => {
				kbSim.keyDown(keyId);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(keyId);
				expect(ev.key).to.equal(alternativeValue);
				kbSim.keyUp(keyId);
			});
		});
	});
});
