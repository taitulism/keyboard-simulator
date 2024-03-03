import {EventKeyAndCode} from './key-codes';
import {
	ContextElement,
	IsModifierDown,
	EventModifiers,
	isModifier,
	type EventType,
	type TAliases,
	type EventModifier,
} from './types';

const defaultEvent: KeyboardEventInit = {
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	repeat: false,
};

const keyBoardEventCreator = (eventType: EventType) => (
	key: TAliases,
	modifiers?: Array<EventModifier>,
	repeat: boolean = false, // TODO: I don't like this. What about additional future props?
) => {
	const ev: KeyboardEventInit = Object.assign({}, defaultEvent, {repeat}, EventKeyAndCode[key]);

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
	private heldKeys: Array<TAliases> = [];

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
	public keyDown (repeatOrKey: boolean | TAliases, ...keys: Array<TAliases>) {
		let _repeat: boolean;

		if (typeof repeatOrKey === 'boolean') {
			_repeat = repeatOrKey;
		}
		else {
			keys.unshift(repeatOrKey);
		}

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
	public keyUp (...keys: Array<TAliases>) {
		return keys.map((key) => {
			const modifiers: Array<EventModifier> = [];

			if (this.isModifierDown()) {
				if (isModifier(key)) {
					if (key === 'Ctrl') this.isCtrlDown = false;
					if (key === 'Alt') this.isAltDown = false;
					if (key === 'Shift') this.isShiftDown = false;
					if (key === 'Meta') this.isMetaDown = false;
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
	public keyPress (...keys: Array<TAliases>) {
		return keys.map((key) => [
			this.keyDown(key),
			this.keyUp(key),
		]);
	}

	public hold (...keys: Array<TAliases>) {
		this.heldKeys.push(...keys);

		return keys.map((key) => [
			this.keyDown(key),
		]);
	}

	public holdRepeat (key: TAliases, repeatCount: number) {
		if (this.heldKeys[this.heldKeys.length - 1] !== key) {
			this.heldKeys.push(key);
		}

		for (let i = 0; i < repeatCount; i++) {
			this.keyDown(true, key);
		}
	}

	public release () {
		const keys = this.heldKeys;

		this.heldKeys = [];

		return keys.reverse().map((key) => [
			this.keyUp(key),
		]);
	}
}
