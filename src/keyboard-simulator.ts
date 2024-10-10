import {KeyId} from './key-id-type';
import {
	type KeyName,
	type ModifierID,
	isModifier,
	ModifierNumbers,
	getKeyId,
	getKeyValue,
	isTogglerBtn,
	TogglerButton,
	isAffectedByNumLock,
	isAffectedByCapsLock,
	isAffectedByShift,
} from './key-codes';

export type ContextElement = HTMLElement | Document
export type EventType = 'keydown' | 'keyup'
export type KeyPressDispatchResults = [boolean, boolean]

const isDocument = (doc: object): doc is Document =>
	'nodeType' in doc && doc.nodeType === 9; // Node.DOCUMENT_NODE = 9
	// doc.constructor.name === 'HTMLDocument'; // fails in JSDOM ('Document')

export type Maybe<T> = T | undefined

export class KeyboardSimulator {
	private isCtrlDown = false;
	private isAltDown = false;
	private isShiftDown = false;
	private isMetaDown = false;
	private isCapsLockOn = false;
	private isScrollLockOn = false;
	private isNumLockOn = true;
	private heldKeys = new Set<KeyName>();

	private _ctxElm: Maybe<ContextElement>;
	public doc: Document;

	constructor (ctxElm?: ContextElement) {
		if (!ctxElm) {
			this.doc = document;
		}
		else if (isDocument(ctxElm)) {
			this.doc = ctxElm;
		}
		else { // is HTMLElement
			this.doc = ctxElm.ownerDocument;
			this._ctxElm = ctxElm;
		}
	}

	public get ctxElm (): ContextElement {
		if (this._ctxElm) return this._ctxElm;
		if (this.doc.activeElement) return this.doc.activeElement as HTMLElement;

		return this.doc;
	}

	public setContextElm (ctxElm?: Maybe<ContextElement>) {
		this._ctxElm = ctxElm;

		return this;
	}

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
		this.isNumLockOn = true;
		this.isScrollLockOn = false;
		this.heldKeys.clear();
		this._ctxElm = undefined;
	}

	private toggleModifier (keyId: ModifierID, isPressed: boolean = false) {
		const modifier = ModifierNumbers[keyId];

		if (modifier === 1) this.isCtrlDown = isPressed;
		else if (modifier === 2) this.isAltDown = isPressed;
		else if (modifier === 3) this.isShiftDown = isPressed;
		else if (modifier === 4) this.isMetaDown = isPressed;
	}

	private toggleToggler (togglerBtn: TogglerButton) {
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

	public combine (...keys: Array<KeyName>): [Array<boolean>, Array<boolean>] {
		const dispatchDownResults = keys.map((key) => this.keyDown(key));
		const dispatchUpResults = keys.reverse().map((key) => this.keyUp(key));

		return [dispatchDownResults, dispatchUpResults];
	}

	public createKeyboardEvent (
		eventType: EventType,
		keyName: KeyName,
		eventInit: KeyboardEventInit = {},
	) {
		const keyId = getKeyId(keyName);
		const isAlternativeValue = this.isNumLockOn && isAffectedByNumLock(keyId)
			|| this.isShiftDown && isAffectedByShift(keyId)
			|| this.isCapsLockOn && isAffectedByCapsLock(keyId);
		const keyValue = getKeyValue(keyId, isAlternativeValue);
		const initialObj: KeyboardEventInit = {
			code: keyId,
			key: keyValue,
			ctrlKey: this.isCtrlDown,
			altKey: this.isAltDown,
			shiftKey: this.isShiftDown,
			metaKey: this.isMetaDown,
			repeat: false,
			location: 1, // TODO:
			bubbles: true,
			cancelable: true,
			composed: true, // event will propagate across the shadow DOM boundary into the standard DOM
			isComposing: false, // For Emojis and other special characters
			view: this.doc.defaultView,
		};

		const eventObj = Object.assign(initialObj, eventInit);

		return new KeyboardEvent(eventType, eventObj);
	}

	public repeat (count: number) {
		if (!this.heldKeys.size) throw new Error('Cannot repeat. No keys are pressed down.');

		const lastKey = Array.from(this.heldKeys)[this.heldKeys.size - 1];
		const dispatches = [];
		const opts = {repeat: true};

		for (let i = 0; i < count; i++) {
			const keyDownEvent = this.createKeyboardEvent('keydown', lastKey, opts);

			dispatches.push(this.ctxElm.dispatchEvent(keyDownEvent));
		}

		return dispatches;
	}

	public release (): ReturnType<typeof KeyboardSimulator.prototype.keyUp>
	public release (key: KeyName): boolean;
	public release (...keys: Array<KeyName>): Array<boolean>;
	public release (...keys: Array<KeyName>) {
		if (keys.length) {
			return this.keyUp(...keys);
		}

		const dispatches = Array.from(this.heldKeys)
			.reverse()
			.map((key) => this.keyUp(key));

		this.heldKeys.clear();

		return (dispatches.length === 1) ? dispatches[0] : dispatches;
	}
}
