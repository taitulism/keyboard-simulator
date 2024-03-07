import {KeyMap, KeyAliases} from './key-codes';
import {
	type EventType,
	ContextElement,
	isModifier,
	KeyName,
	KeyId,
	KeyAlias,
	Modifier,
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

// TODO:ts
const getKeyId = (keyName: KeyName) => {
	let keyId: KeyId | undefined;

	if (keyName in KeyAliases) {
		keyId = KeyAliases[keyName as KeyAlias];
	}
	else if (!(keyName in KeyMap)) {
		throw new Error(`Unknown key name: ${keyName.toString()}`);
	}

	return (keyId ?? keyName) as KeyId;
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

	private get withModifiers () {
		return this.isCtrlDown || this.isAltDown || this.isShiftDown || this.isMetaDown;
	}

	public reset () {
		this.isCtrlDown = false;
		this.isAltDown = false;
		this.isShiftDown = false;
		this.isMetaDown = false;
		this.heldKeys = [];
	}

	private toggleModifier (key: Modifier, isDown: boolean = false) {
		if (key === 'Ctrl') this.isCtrlDown = isDown;
		else if (key === 'Alt') this.isAltDown = isDown;
		else if (key === 'Shift') this.isShiftDown = isDown;
		else if (key === 'Meta') this.isMetaDown = isDown;
	}

	// TODO:test multiple keys & return
	public keyDown (...keys: Array<KeyName>) {
		this.heldKeys.push(...keys);

		return keys.map((key) => {
			if (isModifier(key)) this.toggleModifier(key, true);

			const keyDownEvent = this.createKeyboardEvent('keydown', key);

			return this.ctxElm.dispatchEvent(keyDownEvent);
		});
	}

	// TODO:test multiple keys & return
	public keyUp (...keys: Array<KeyName>) {
		return keys.map((key) => {
			if (isModifier(key)) this.toggleModifier(key, false);

			const keyUpEvent = this.createKeyboardEvent('keyup', key);

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
	public holdKey (key: KeyName, repeatCount: number) {
		this.heldKeys.push(key);

		if (isModifier(key)) this.toggleModifier(key, true);

		const keyDownEvent = this.createKeyboardEvent('keydown', key, true);
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
