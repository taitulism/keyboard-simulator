export type Modifier = keyof typeof Modifiers
export type KeyId = keyof typeof KeyMap
export type KeyAlias = keyof typeof KeyAliases
export type KeyName = KeyId | KeyAlias

export const isKeyId = (key: KeyName): key is KeyId => key in KeyMap;
export const isAlias = (key: KeyName): key is KeyAlias => key in KeyAliases;
export const isModifier = (str: string): str is Modifier => str in Modifiers;

export const getKeyValue = (keyId: KeyId, withShift: boolean) => {
	// value = single or array
	const value = KeyMap[keyId];

	if (Array.isArray(value)) {
		return withShift
			? value[1]
			: value[0]
		;
	}

	return value;
};

export const getKeyId = (keyName: KeyName): KeyId => {
	if (isKeyId(keyName)) return keyName;
	if (isAlias(keyName)) return KeyAliases[keyName];

	// TODO:ts
	throw new Error(`Unknown key name: ${(keyName as string).toString()}`);
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
	Num1: ['1', '!'],
	Num2: ['2', '@'],
	Num3: ['3', '#'],
	Num4: ['4', '$'],
	Num5: ['5', '%'],
	Num6: ['6', '^'],
	Num7: ['7', '&'],
	Num8: ['8', '*'],
	Num9: ['9', '('],
	Num0: ['0', ')'],

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

	// NumPad (Numlock ON)
	Numpad1: '1',
	Numpad2: '2',
	Numpad3: '3',
	Numpad4: '4',
	Numpad5: '5',
	Numpad6: '6',
	Numpad7: '7',
	Numpad8: '8',
	Numpad9: '9',
	Numpad0: '0',
	NumpadDecimal: '.',
	NumpadDivide: '/',
	NumpadSubtract: '-',
	NumpadMultiply: '*',
	NumpadAdd: '+',
	// NumPad (Numlock OFF)
	// Numpad1: 'End',
	// Numpad2: 'ArrowDown',
	// Numpad3: 'PageDown',
	// Numpad4: 'ArrowLeft',
	// Numpad5: 'Clear',
	// Numpad6: 'ArrowRight',
	// Numpad7: 'Home',
	// Numpad8: 'ArrowUp',
	// Numpad9: 'PageUp',
	// Numpad0: 'Insert',
	// NumpadDecimal: 'Delete',

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
	'1': 'Num1',
	'2': 'Num2',
	'3': 'Num3',
	'4': 'Num4',
	'5': 'Num5',
	'6': 'Num6',
	'7': 'Num7',
	'8': 'Num8',
	'9': 'Num9',
	'0': 'Num0',

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
