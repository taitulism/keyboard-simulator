export const ModifiersEventKeyAndCode = {
	Ctrl: {key: 'Control', code: 'ControlLeft'},
	Alt: {key: 'Alt', code: 'AltLeft'},
	Shift: {key: 'Shift', code: 'ShiftLeft'},
	Meta: {key: 'Meta', code: 'MetaLeft'},
} as const;

export const EventKeyAndCode = {
	A: {key: 'a', code: 'KeyA'},
	B: {key: 'b', code: 'KeyB'},
	C: {key: 'c', code: 'KeyC'},
	...ModifiersEventKeyAndCode,
} as const;
