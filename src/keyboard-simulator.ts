import {KeyMap, KeyAliases} from './key-codes';
import {
	type EventType,
	ContextElement,
	isModifier,
	KeyName,
	KeyId,
	Modifier,
	Modifiers,
	isKeyId,
	isAlias,
} from './types';

const getKeyValue = (keyId: KeyId, withShift: boolean) => {
	const valueOrValues = KeyMap[keyId];

	if (Array.isArray(valueOrValues)) {
		return withShift
			? valueOrValues[1]
			: valueOrValues[0]
		;
	}
	else {
		return valueOrValues; // single value
	}
};

const getKeyId = (keyName: KeyName): KeyId => {
	if (isKeyId(keyName)) return keyName;
	if (isAlias(keyName)) return KeyAliases[keyName];

	// TODO:ts
	throw new Error(`Unknown key name: ${(keyName as string).toString()}`);
};

export class KeyboardSimulator {
	private isCtrlDown = false;
	private isAltDown = false;
	private isShiftDown = false;
	private isMetaDown = false;
	// TODO: Use Set instead to avoid dups
	private heldKeys: Array<KeyName> = [];

	// TODO:! not sure about one ctx per instance. Same keyboard can be used in multi ctx
	constructor (public ctxElm: ContextElement = document) {}

	public reset () {
		this.isCtrlDown = false;
		this.isAltDown = false;
		this.isShiftDown = false;
		this.isMetaDown = false;
		this.heldKeys = [];
	}

	private toggleModifier (key: Modifier, isPressed: boolean = false) {
		const modifier = Modifiers[key];

		if (modifier === 'Ctrl') this.isCtrlDown = isPressed;
		else if (modifier === 'Alt') this.isAltDown = isPressed;
		else if (modifier === 'Shift') this.isShiftDown = isPressed;
		else if (modifier === 'Meta') this.isMetaDown = isPressed;
	}

	// TODO:test multiple keys & return
	public keyDown (...keys: Array<KeyName>) {
		return keys.map((keyName) => {
			const keyId = getKeyId(keyName);

			this.heldKeys.push(keyId);

			if (isModifier(keyId)) this.toggleModifier(keyId, true);

			const keyDownEvent = this.createKeyboardEvent('keydown', keyId);

			return this.ctxElm.dispatchEvent(keyDownEvent);
		});
	}

	// TODO:test multiple keys & return
	public keyUp (...keys: Array<KeyName>) {
		return keys.map((keyName) => {
			const keyId = getKeyId(keyName);

			if (isModifier(keyId)) this.toggleModifier(keyId, false);

			const keyUpEvent = this.createKeyboardEvent('keyup', keyId);

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

	private createKeyboardEvent (
		eventType: EventType,
		keyName: KeyName,
		repeat: boolean = false, // TODO: I don't like this. What about additional future props?
	) {
		const keyId = getKeyId(keyName);

		return new KeyboardEvent(eventType, {
			code: keyId,
			key: getKeyValue(keyId, this.isShiftDown),
			ctrlKey: this.isCtrlDown,
			altKey: this.isAltDown,
			shiftKey: this.isShiftDown,
			metaKey: this.isMetaDown,
			repeat,
		});
	}

	// TODO:test more
	public holdKey (keyName: KeyName, repeatCount: number) {
		const keyId = getKeyId(keyName);

		this.heldKeys.push(keyId);

		if (isModifier(keyId)) this.toggleModifier(keyId, true);

		const keyDownEvent = this.createKeyboardEvent('keydown', keyId, true);
		const dispatches = [];

		for (let i = 0; i < repeatCount; i++) {
			dispatches.push(this.ctxElm.dispatchEvent(keyDownEvent));
		}

		return dispatches;
	}

	public releaseAll () {
		const keys = this.heldKeys;

		this.heldKeys = [];

		return keys.reverse().map((key) => [
			this.keyUp(key),
		]);
	}
}
