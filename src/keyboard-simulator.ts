import {
	type KeyName,
	type KeyId,
	type Modifier,
	isModifier,
	Modifiers,
	getKeyId,
	getKeyValue,
	isTogglerBtn,
	TogglerButton,
	TogglerButtons,
} from './key-codes';

export type ContextElement = HTMLElement | Document
export type EventType = 'keydown' | 'keyup'
export type KeyPressDispatchResults = [boolean, boolean]

export class KeyboardSimulator {
	private isCtrlDown = false;
	private isAltDown = false;
	private isShiftDown = false;
	private isMetaDown = false;
	private isCapsLockOn = false;
	private isNumLockOn = false;
	private isScrollLockOn = false;
	private heldKeys = new Set<KeyName>();

	constructor (public ctxElm: ContextElement = document) {}

	private followKey (key: KeyId) {
		if (this.heldKeys.has(key)) throw new Error(`The key "${key}" is already pressed down.`);
		this.heldKeys.add(key);
	}

	private unfollowKey (key: KeyId) {
		if (!this.heldKeys.has(key)) throw new Error(`The key "${key}" is not pressed down.`);
		this.heldKeys.delete(key);
	}

	public reset () {
		this.isCtrlDown = false;
		this.isAltDown = false;
		this.isShiftDown = false;
		this.isMetaDown = false;
		this.isCapsLockOn = false;
		this.isNumLockOn = false;
		this.isScrollLockOn = false;
		this.heldKeys.clear();
	}

	private toggleModifier (key: Modifier, isPressed: boolean = false) {
		const modifier = Modifiers[key];

		if (modifier === 'Ctrl') this.isCtrlDown = isPressed;
		else if (modifier === 'Alt') this.isAltDown = isPressed;
		else if (modifier === 'Shift') this.isShiftDown = isPressed;
		else if (modifier === 'Meta') this.isMetaDown = isPressed;
	}

	private toggleToggler (key: TogglerButton) {
		const togglerBtn = TogglerButtons[key];

		if (togglerBtn === 'NumLock') this.isNumLockOn = !this.isNumLockOn;
		else if (togglerBtn === 'CapsLock') this.isCapsLockOn = !this.isCapsLockOn;
		else if (togglerBtn === 'ScrollLock') this.isScrollLockOn = !this.isScrollLockOn;
	}

	public keyDown (key: KeyName): boolean;
	public keyDown (...keys: Array<KeyName>): Array<boolean>;
	public keyDown (...keys: Array<KeyName>) {
		const dispatchResults = keys.map((keyName) => {
			const keyId = getKeyId(keyName);

			this.followKey(keyId);
			if (isModifier(keyId)) this.toggleModifier(keyId, true);
			else if (isTogglerBtn(keyId)) this.toggleToggler(keyId);

			const keyDownEvent = this.createKeyboardEvent('keydown', keyId);

			return this.ctxElm.dispatchEvent(keyDownEvent);
		});

		return (dispatchResults.length === 1) ? dispatchResults[0] : dispatchResults;
	}

	public keyUp (key: KeyName): boolean;
	public keyUp (...keys: Array<KeyName>): Array<boolean>;
	public keyUp (...keys: Array<KeyName>) {
		const dispatchResults = keys.map((keyName) => {
			const keyId = getKeyId(keyName);

			this.unfollowKey(keyId);
			if (isModifier(keyId)) this.toggleModifier(keyId, false);

			const keyUpEvent = this.createKeyboardEvent('keyup', keyId);

			return this.ctxElm.dispatchEvent(keyUpEvent);
		});

		return (dispatchResults.length === 1) ? dispatchResults[0] : dispatchResults;
	}

	public keyPress (key: KeyName): KeyPressDispatchResults;
	public keyPress (...keys: Array<KeyName>): Array<KeyPressDispatchResults>;
	public keyPress (...keys: Array<KeyName>) {
		const dispatchResults = keys.map((key) => [
			this.keyDown(key),
			this.keyUp(key),
		]);

		return (dispatchResults.length === 1) ? dispatchResults[0] : dispatchResults;
	}

	public keyPressAsOne (keys: Array<KeyName>): Array<KeyPressDispatchResults> {
		const dispatchDownResults = keys.map((key) => this.keyDown(key));

		const dispatchResults = keys.reverse()
			.map((key, i) => ([dispatchDownResults[i], this.keyUp(key)]));

		return dispatchResults as Array<KeyPressDispatchResults>;
	}

	private createKeyboardEvent (
		eventType: EventType,
		keyName: KeyName,
		repeat: boolean = false,
	) {
		const isAlternativeValue = this.isShiftDown || this.isCapsLockOn || this.isNumLockOn;
		const keyId = getKeyId(keyName);
		const keyValue = getKeyValue(keyId, isAlternativeValue);

		return new KeyboardEvent(eventType, {
			code: keyId,
			key: keyValue,
			ctrlKey: this.isCtrlDown,
			altKey: this.isAltDown,
			shiftKey: this.isShiftDown,
			metaKey: this.isMetaDown,
			repeat,
		});
	}

	public holdKey (keyName: KeyName, repeatCount: number) {
		const keyId = getKeyId(keyName);

		this.followKey(keyId);
		if (isModifier(keyId)) this.toggleModifier(keyId, true);

		const dispatches = [];

		for (let i = 0; i < repeatCount; i++) {
			const keyDownEvent = this.createKeyboardEvent('keydown', keyId, true);

			dispatches.push(this.ctxElm.dispatchEvent(keyDownEvent));
		}

		return dispatches;
	}

	public setContextElm (ctxElm: ContextElement) {
		this.ctxElm = ctxElm;

		return this;
	}

	public releaseAll () {
		const dispatches = Array.from(this.heldKeys)
			.reverse()
			.map((key) => this.keyUp(key));

		this.heldKeys.clear();

		return dispatches;
	}
}
