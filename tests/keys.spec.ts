import {JSDOM} from 'jsdom';
import {MockInstance, afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {KeyAlias, KeyId, KeyName, KeyboardSimulator} from '../src';
import {extractLastEvent} from './utils';

describe('Supported Keys', () => {
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

	describe('Letters', () => {
		it('A-Z', () => {
			const letters = [
				'A', 'B', 'C', 'D', 'E', 'F', 'G',
				'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
				'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			] as const;

			letters.forEach((letter) => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown(letter);
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Key${letter}`); // e.g. 'KeyA'
				expect(ev.key).to.equal(letter.toLowerCase());

				spy.mockReset();
			});
		});

		it('0-9', () => {
			const numbers = [
				'1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
			] as const;

			numbers.forEach((number) => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown(number);
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(`Num${number}`); // e.g. 'Num1'
				expect(ev.key).to.equal(number.toLowerCase());

				spy.mockReset();
			});
		});

		it('Other Characters', () => {
			// '/', '\\', '.', ',', '\'', '`', ';', '[', ']', '-', '=',
			const chars = new Map<KeyName, [KeyId, string]>([
				['Slash', ['Slash', '/']],
				['BackSlash', ['Backslash', '\\']],
				['Period', ['Period', '.']],
				['Comma', ['Comma', ',']],
				['SingleQuote', ['Quote', '\'']],
				['BackTick', ['Backquote', '`']],
				['SemiColon', ['Semicolon', ';']],
				['BracketLeft', ['BracketLeft', '[']],
				['BracketRight', ['BracketRight', ']']],
				['Minus', ['Minus', '-']],
				['Plus', ['Equal', '=']],
				['Equal', ['Equal', '=']],
			]);

			chars.forEach(([code, key], keyName) => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown(keyName);
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(code);
				expect(ev.key).to.equal(key);

				spy.mockReset();
			});
		});

		it('Modifiers', () => {
			const modifiers = new Map<KeyAlias, [KeyId, string]>([
				// keyName: [code, key]
				['Ctrl', ['ControlLeft', 'Control']],
				['LCtrl', ['ControlLeft', 'Control']],
				['RCtrl', ['ControlRight', 'Control']],
				['Alt', ['AltLeft', 'Alt']],
				['LAlt', ['AltLeft', 'Alt']],
				['RAlt', ['AltRight', 'Alt']],
				['Shift', ['ShiftLeft', 'Shift']],
				['LShift', ['ShiftLeft', 'Shift']],
				['RShift', ['ShiftRight', 'Shift']],
				['Meta', ['MetaLeft', 'Meta']],
				['LMeta', ['MetaLeft', 'Meta']],
				['RMeta', ['MetaRight', 'Meta']],
			]);

			modifiers.forEach(([code, key], keyName) => {
				expect(spy.mock.calls.length).to.equal(0);
				kbSim.keyDown(keyName);
				expect(spy.mock.calls.length).to.equal(1);

				const ev = extractLastEvent(spy);

				expect(ev.code).to.equal(code);
				expect(ev.key).to.equal(key);

				spy.mockReset();
			});
		});
	});
});
