import {KeyMap, KeyAliases} from './key-codes';

export type ContextElement = HTMLElement | Document

// TODO: What about Control & ControlLeft/Right etc.
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

export type EventType = 'keydown' | 'keyup'
export type DispatchCall = [KeyboardEvent]
export type KeyId = keyof typeof KeyMap
export type KeyAlias = keyof typeof KeyAliases
export type KeyName = KeyId | KeyAlias
export type Modifier = keyof typeof Modifiers

export const isKeyId = (key: KeyName): key is KeyId => key in KeyMap;
export const isAlias = (key: KeyName): key is KeyAlias => key in KeyAliases;
export const isModifier = (str: string): str is Modifier => str in Modifiers;
