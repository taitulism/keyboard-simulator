import {KeyMap, KeyAliases} from './key-codes';
import {
	ContextElement,
	IsModifierDown,
	EventModifiers,
	isModifier,
	type EventType,
	type EventModifier,
	KeyName,
	KeyId,
	KeyAlias,
} from './types';

const defaultEvent: KeyboardEventInit = {
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	repeat: false,
};

const getKeyValue = (keyId: KeyId, modifiers?: Array<EventModifier>) => {
	const valueOrValues = KeyMap[keyId];

	if (Array.isArray(valueOrValues)) {
		return modifiers?.includes('shiftKey')
			? valueOrValues[1]
			: valueOrValues[0]
		;
	}
	else {
		return valueOrValues; // single value
	}
};

// TODO:ts
const getEventCodeAndKey = (keyName: KeyName, modifiers?: Array<EventModifier>) => {
	let keyId: KeyName | undefined;

	if (keyName in KeyAliases) {
		keyId = KeyAliases[keyName as KeyAlias];
	}
	else if (!(keyName in KeyMap)) {
		throw new Error(`Unknown key name: ${keyName.toString()}`);
	}

	keyId = (keyId ?? keyName) as KeyId;

	const value = getKeyValue(keyId, modifiers);

	return {code: keyId, key: value};
};

const keyBoardEventCreator = (eventType: EventType) => (
	key: KeyName,
	modifiers?: Array<EventModifier>,
	repeat: boolean = false, // TODO: I don't like this. What about additional future props?
) => {
	const ev: KeyboardEventInit = Object.assign(
		{},
		defaultEvent,
		{repeat},
		getEventCodeAndKey(key, modifiers),
	);

	if (modifiers) {
		modifiers.forEach((mod) => {
			ev[mod] = true;
		});
	}

	return new KeyboardEvent(eventType, ev);
};

const createKeyDownEvent = keyBoardEventCreator('keydown');
const createKeyUpEvent = keyBoardEventCreator('keyup');

export class KeyboardSimulator {
	private isCtrlDown = false;
	private isAltDown = false;
	private isShiftDown = false;
	private isMetaDown = false;
	private heldKeys: Array<KeyName> = [];

	constructor (public ctxElm: ContextElement = document) {}

	private isModifierDown () {
		return this.isCtrlDown || this.isAltDown || this.isShiftDown || this.isMetaDown;
	}

	public reset () {
		this.isCtrlDown = false;
		this.isAltDown = false;
		this.isShiftDown = false;
		this.isMetaDown = false;
		this.heldKeys = [];
	}

	// TODO:test multiple keys & return
	public keyDown (repeatOrKey: boolean | KeyName, ...keys: Array<KeyName>) {
		let _repeat: boolean;

		if (typeof repeatOrKey === 'boolean') {
			_repeat = repeatOrKey;
		}
		else {
			keys.unshift(repeatOrKey);
		}

		this.heldKeys.push(...keys);

		return keys.map((key) => {
			const modifiers: Array<EventModifier> = [];

			if (isModifier(key)) {
				const holdModifierDown = (`is${key}Down`) as IsModifierDown;

				this[holdModifierDown] = true;
				modifiers.push(EventModifiers[key]);
			}

			if (this.isModifierDown()) {
				if (this.isCtrlDown) modifiers.push(EventModifiers.Ctrl);
				if (this.isAltDown) modifiers.push(EventModifiers.Alt);
				if (this.isShiftDown) modifiers.push(EventModifiers.Shift);
				if (this.isMetaDown) modifiers.push(EventModifiers.Meta);
			}

			const keyDownEvent = createKeyDownEvent(key, modifiers, _repeat);

			return this.ctxElm.dispatchEvent(keyDownEvent);
		});
	}

	// TODO:test multiple keys & return
	public keyUp (...keys: Array<KeyName>) {
		return keys.map((key) => {
			const modifiers: Array<EventModifier> = [];

			if (this.isModifierDown()) {
				if (isModifier(key)) {
					if (key === 'Ctrl') this.isCtrlDown = false;
					else if (key === 'Alt') this.isAltDown = false;
					else if (key === 'Shift') this.isShiftDown = false;
					else if (key === 'Meta') this.isMetaDown = false;
				}

				if (this.isCtrlDown) modifiers.push(EventModifiers.Ctrl);
				if (this.isAltDown) modifiers.push(EventModifiers.Alt);
				if (this.isShiftDown) modifiers.push(EventModifiers.Shift);
				if (this.isMetaDown) modifiers.push(EventModifiers.Meta);
			}

			const keyUpEvent = createKeyUpEvent(key, modifiers);

			return this.ctxElm.dispatchEvent(keyUpEvent);
		});
	}

	// TODO:test multi & return
	public keyPress (...keys: Array<KeyName>) {
		return keys.map((key) => [
			this.keyDown(key),
			this.keyUp(key),
		]);
	}

	public holdRepeat (key: KeyName, repeatCount: number) {
		if (this.heldKeys[this.heldKeys.length - 1] !== key) {
			this.heldKeys.push(key);
		}

		for (let i = 0; i < repeatCount; i++) {
			this.keyDown(true, key);
		}
	}

	public releaseAll () {
		const keys = this.heldKeys;

		this.heldKeys = [];

		return keys.reverse().map((key) => [
			this.keyUp(key),
		]);
	}
}
