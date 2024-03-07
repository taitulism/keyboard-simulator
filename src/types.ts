import {KeyMap, KeyAliases} from './key-codes';

export type ContextElement = HTMLElement | Document

export const Modifiers = {
	Ctrl: 'Ctrl',
	Alt: 'Alt',
	Shift: 'Shift',
	Meta: 'Meta',
} as const;

export const EventModifiers = {
	Ctrl: 'ctrlKey',
	Alt: 'altKey',
	Shift: 'shiftKey',
	Meta: 'metaKey',
} as const;

export type EventType = 'keydown' | 'keyup'
export type DispatchCall = [KeyboardEvent]
export type KeyId = keyof typeof KeyMap
export type KeyAlias = keyof typeof KeyAliases
export type KeyName = KeyId | KeyAlias
export type TModifier = keyof typeof Modifiers
export type EventModifier = `${Lowercase<TModifier>}Key`
export type IsModifierDown = `is${TModifier}Down`

export const isModifier = (str: string): str is TModifier => str in Modifiers;
