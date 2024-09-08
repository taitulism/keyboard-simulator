export type Modifier = keyof typeof Modifiers
export type TogglerButton = keyof typeof TogglerButtons
export type KeyId = keyof typeof KeyMap
export type KeyAlias = keyof typeof KeyAliases
export type KeyName = KeyId | KeyAlias

export const isKeyId = (key: KeyName): key is KeyId => key in KeyMap;
export const isAlias = (key: KeyName): key is KeyAlias => key in KeyAliases;
export const isModifier = (str: string): str is Modifier => str in Modifiers;
export const isTogglerBtn = (str: string): str is TogglerButton => str in TogglerButtons;

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

export const getKeyId = (keyName: KeyName): KeyId => {
	if (isKeyId(keyName)) return keyName;
	if (isAlias(keyName)) return KeyAliases[keyName];

	throw new Error(`Unknown key name: ${keyName}`);
};

export const Modifiers = {
	ControlLeft: 'Ctrl',
	ControlRight: 'Ctrl',
	AltLeft: 'Alt',
	AltRight: 'Alt',
	ShiftLeft: 'Shift',
	ShiftRight: 'Shift',
	MetaLeft: 'Meta',
	MetaRight: 'Meta',
} as const;

export const TogglerButtons = {
	NumLock: 'NumLock',
	CapsLock: 'CapsLock',
	ScrollLock: 'ScrollLock',
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

	// Other Characters
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

	// Page / Caret Navigation
	ArrowUp: 'ArrowUp',
	ArrowRight: 'ArrowRight',
	ArrowDown: 'ArrowDown',
	ArrowLeft: 'ArrowLeft',
	PageUp: 'PageUp',
	PageDown: 'PageDown',
	Home: 'Home',
	End: 'End',

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

	// Modifiers
	ControlLeft: 'Control',
	ControlRight: 'Control',
	AltLeft: 'Alt',
	AltRight: 'Alt',
	ShiftLeft: 'Shift',
	ShiftRight: 'Shift',
	MetaLeft: 'Meta',
	MetaRight: 'Meta',

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

	// The Rest
	Pause: 'Pause',
	PrintScreen: 'PrintScreen',
	ScrollLock: 'ScrollLock',
	NumLock: 'NumLock',
	CapsLock: 'CapsLock',
	ContextMenu: 'ContextMenu',
	Escape: 'Escape',
} as const;

/* ======================================================= */

export const KeyAliases = {
	// Letters
	A: 'KeyA',
	B: 'KeyB',
	C: 'KeyC',
	D: 'KeyD',
	E: 'KeyE',
	F: 'KeyF',
	G: 'KeyG',
	H: 'KeyH',
	I: 'KeyI',
	J: 'KeyJ',
	K: 'KeyK',
	L: 'KeyL',
	M: 'KeyM',
	N: 'KeyN',
	O: 'KeyO',
	P: 'KeyP',
	Q: 'KeyQ',
	R: 'KeyR',
	S: 'KeyS',
	T: 'KeyT',
	U: 'KeyU',
	V: 'KeyV',
	W: 'KeyW',
	X: 'KeyX',
	Y: 'KeyY',
	Z: 'KeyZ',

	// Numbers
	'1': 'Digit1',
	'2': 'Digit2',
	'3': 'Digit3',
	'4': 'Digit4',
	'5': 'Digit5',
	'6': 'Digit6',
	'7': 'Digit7',
	'8': 'Digit8',
	'9': 'Digit9',
	'0': 'Digit0',

	BackSlash: 'Backslash',
	SingleQuote: 'Quote',
	BackQuote: 'Backquote',
	BackTick: 'Backquote',
	SemiColon: 'Semicolon',

	Up: 'ArrowUp',
	Right: 'ArrowRight',
	Down: 'ArrowDown',
	Left: 'ArrowLeft',
	PgUp: 'PageUp',
	PgDn: 'PageDown',

	// Modifiers
	Ctrl: 'ControlLeft',
	LCtrl: 'ControlLeft',
	RCtrl: 'ControlRight',
	Alt: 'AltLeft',
	LAlt: 'AltLeft',
	RAlt: 'AltRight',
	Shift: 'ShiftLeft',
	LShift: 'ShiftLeft',
	RShift: 'ShiftRight',
	Meta: 'MetaLeft',
	LMeta: 'MetaLeft',
	RMeta: 'MetaRight',
} as const;
