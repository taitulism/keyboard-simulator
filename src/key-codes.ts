import {KeyId} from './key-id-type';

export type ModifierID = keyof typeof ModifierNumbers
export type TogglerButton = typeof TogglerButtons[number]
export type KeyAlias = keyof typeof KeyAliases
export type Alias = KeyAlias | Uppercase<KeyAlias> | Capitalize<KeyAlias> | ExtraAliases
export type KeyName = KeyId | Alias

const TogglerButtons = ['NumLock', 'CapsLock', 'ScrollLock'] as const;
const isAlias = (key: Lowercase<string>): key is KeyAlias => key in KeyAliases;
const isKeyId = (key: string): key is KeyId => key in KeyMap;

export const isModifier = (str: string): str is ModifierID => str in ModifierNumbers;
export const isTogglerBtn = (str: string): str is TogglerButton =>
	TogglerButtons.includes(str as TogglerButton);

export const isAffectedByNumLock = (keyId: KeyId) => /Numpad\d/.test(keyId) || keyId.endsWith('Decimal');

export const getKeyId = (keyName: KeyName): KeyId => {
	if (isKeyId(keyName)) return keyName;

	const lower = keyName.toLowerCase() as Lowercase<string>;

	if (isAlias(lower)) return KeyAliases[lower];

	throw new Error(`Unknown key name: ${keyName}`);
};

export const getKeyValue = (keyId: KeyId, isAlterValue: boolean) => {
	// value = single or array
	const value = KeyMap[keyId];

	if (Array.isArray(value)) {
		return isAlterValue
			? value[1]
			: value[0]
		;
	}

	return value;
};

export const ModifierNumbers = {
	ControlLeft: 1,
	ControlRight: 1,
	AltLeft: 2,
	AltRight: 2,
	ShiftLeft: 3,
	ShiftRight: 3,
	MetaLeft: 4,
	MetaRight: 4,
} as const;

export const KeyMap = {
	// Letters
	KeyA: ['a', 'A'],
	KeyB: ['b', 'B'],
	KeyC: ['c', 'C'],
	KeyD: ['d', 'D'],
	KeyE: ['e', 'E'],
	KeyF: ['f', 'F'],
	KeyG: ['g', 'G'],
	KeyH: ['h', 'H'],
	KeyI: ['i', 'I'],
	KeyJ: ['j', 'J'],
	KeyK: ['k', 'K'],
	KeyL: ['l', 'L'],
	KeyM: ['m', 'M'],
	KeyN: ['n', 'N'],
	KeyO: ['o', 'O'],
	KeyP: ['p', 'P'],
	KeyQ: ['q', 'Q'],
	KeyR: ['r', 'R'],
	KeyS: ['s', 'S'],
	KeyT: ['t', 'T'],
	KeyU: ['u', 'U'],
	KeyV: ['v', 'V'],
	KeyW: ['w', 'W'],
	KeyX: ['x', 'X'],
	KeyY: ['y', 'Y'],
	KeyZ: ['z', 'Z'],

	// Numbers
	Digit1: ['1', '!'],
	Digit2: ['2', '@'],
	Digit3: ['3', '#'],
	Digit4: ['4', '$'],
	Digit5: ['5', '%'],
	Digit6: ['6', '^'],
	Digit7: ['7', '&'],
	Digit8: ['8', '*'],
	Digit9: ['9', '('],
	Digit0: ['0', ')'],

	// NumPad (Numlock)
	Numpad0: ['Insert', '0'],
	Numpad1: ['End', '1'],
	Numpad2: ['ArrowDown', '2'],
	Numpad3: ['PageDown', '3'],
	Numpad4: ['ArrowLeft', '4'],
	Numpad5: ['Clear', '5'],
	Numpad6: ['ArrowRight', '6'],
	Numpad7: ['Home', '7'],
	Numpad8: ['ArrowUp', '8'],
	Numpad9: ['PageUp', '9'],
	NumpadDecimal: ['Delete', '.'],
	NumpadDivide: '/',
	NumpadSubtract: '-',
	NumpadMultiply: '*',
	NumpadAdd: '+',

	// Arrows / Navigation
	ArrowUp: 'ArrowUp',
	ArrowRight: 'ArrowRight',
	ArrowDown: 'ArrowDown',
	ArrowLeft: 'ArrowLeft',
	PageUp: 'PageUp',
	PageDown: 'PageDown',
	Home: 'Home',
	End: 'End',

	// Modifiers
	ControlLeft: 'Control',
	ControlRight: 'Control',
	AltLeft: 'Alt',
	AltRight: 'Alt',
	ShiftLeft: 'Shift',
	ShiftRight: 'Shift',
	MetaLeft: 'Meta',
	MetaRight: 'Meta',

	// Symbols
	Slash: ['/', '?'],
	Backslash: ['\\', '|'],
	Period: ['.', '>'],
	Comma: [',', '<'],
	Quote: ['\'', '"'],
	Backquote: ['`', '~'],
	Semicolon: [';', ':'],
	BracketLeft: ['[', '{'],
	BracketRight: [']', '}'],
	Minus: ['-', '_'],
	Equal: ['=', '+'],

	// Text Spaces
	Insert: 'Insert',
	Delete: 'Delete',
	Enter: 'Enter',
	NumpadEnter: 'Enter',
	Space: ' ',
	Backspace: 'Backspace',
	Tab: 'Tab',

	// Fn
	F1: 'F1',
	F2: 'F2',
	F3: 'F3',
	F4: 'F4',
	F5: 'F5',
	F6: 'F6',
	F7: 'F7',
	F8: 'F8',
	F9: 'F9',
	F10: 'F10',
	F11: 'F11',
	F12: 'F12',
	F13: 'F13',
	F14: 'F14',
	F15: 'F15',
	F16: 'F16',
	F17: 'F17',
	F18: 'F18',
	F19: 'F19',
	F20: 'F20',
	F21: 'F21',
	F22: 'F22',
	F23: 'F23',
	F24: 'F24',

	// Others
	Pause: 'Pause',
	PrintScreen: 'PrintScreen',
	ScrollLock: 'ScrollLock',
	NumLock: 'NumLock',
	CapsLock: 'CapsLock',
	ContextMenu: 'ContextMenu',
	Escape: 'Escape',
} as const;

/* ======================================================= */

// All keys are lowercased
export const KeyAliases = {
	// Letters
	a: 'KeyA',
	b: 'KeyB',
	c: 'KeyC',
	d: 'KeyD',
	e: 'KeyE',
	f: 'KeyF',
	g: 'KeyG',
	h: 'KeyH',
	i: 'KeyI',
	j: 'KeyJ',
	k: 'KeyK',
	l: 'KeyL',
	m: 'KeyM',
	n: 'KeyN',
	o: 'KeyO',
	p: 'KeyP',
	q: 'KeyQ',
	r: 'KeyR',
	s: 'KeyS',
	t: 'KeyT',
	u: 'KeyU',
	v: 'KeyV',
	w: 'KeyW',
	x: 'KeyX',
	y: 'KeyY',
	z: 'KeyZ',

	// Numbers
	'0': 'Digit0',
	'1': 'Digit1',
	'2': 'Digit2',
	'3': 'Digit3',
	'4': 'Digit4',
	'5': 'Digit5',
	'6': 'Digit6',
	'7': 'Digit7',
	'8': 'Digit8',
	'9': 'Digit9',

	np0: 'Numpad0',
	np1: 'Numpad1',
	np2: 'Numpad2',
	np3: 'Numpad3',
	np4: 'Numpad4',
	np5: 'Numpad5',
	np6: 'Numpad6',
	np7: 'Numpad7',
	np8: 'Numpad8',
	np9: 'Numpad9',

	decimal: 'NumpadDecimal',
	divide: 'NumpadDivide',
	subtract: 'NumpadSubtract',
	multiply: 'NumpadMultiply',
	add: 'NumpadAdd',

	// Arrows / Navigation
	up: 'ArrowUp',
	right: 'ArrowRight',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	pgup: 'PageUp',
	pgdn: 'PageDown',

	// Modifiers
	control: 'ControlLeft',
	ctrl: 'ControlLeft',
	lctrl: 'ControlLeft',
	rctrl: 'ControlRight',
	alt: 'AltLeft',
	lalt: 'AltLeft',
	ralt: 'AltRight',
	shift: 'ShiftLeft',
	lshift: 'ShiftLeft',
	rshift: 'ShiftRight',
	meta: 'MetaLeft',
	lmeta: 'MetaLeft',
	rmeta: 'MetaRight',

	// Symbols
	singlequote: 'Quote',
	backtick: 'Backquote',

	// Enter / Spaces
	npenter: 'NumpadEnter',
	renter: 'NumpadEnter',
	del: 'Delete',
	ins: 'Insert',

	// Others
	esc: 'Escape',
} as const;

// For special CaSeS. All must match an existing lowercased KeyAlias
export type ExtraAliases =
	| 'PgUp'
	| 'PgDn'
	| 'LCtrl'
	| 'RCtrl'
	| 'LAlt'
	| 'RAlt'
	| 'LShift'
	| 'RShift'
	| 'LMeta'
	| 'RMeta'
	| 'SingleQuote'
	| 'BackTick'
	| 'NpEnter'
	| 'REnter'
