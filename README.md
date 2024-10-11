![Build Status](https://github.com/taitulism/keyboard-simulator/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


Keyboard Simulator
==================
A stateful keyboard events dispatcher.

✅ Great for testing your hotkeys and keyboard shortcuts.

On the other side of hotkeys and keyboard shortcuts libraries, which are more about listening to `event.key` - the generated character of a key, Keyboard-Simulator is more about simulating actual key presses by their physical key IDs (`event.code`).

In other words: it's not about the `$`, it's about the `ShiftLeft` and `Digit4`.

> Don't worry, there are key aliases like `shift` and `4`.  
See the [Key List](#keys-list) below.

Keyboard-Simulator aims to mimick a real keyboard behavior by keeping track of its key activation and dispatching keyboard events that are shaped according to the different states of meaningful keyboard's keys like `CapsLock`.


Key features:
* The dispatching element updates dynamically as DOM focus changes (`document.activeElement`)
* The value of `event.key` takes into account:
	* `NumLock` state
	* `CapsLock` state (for letters)
	* `Shift` state (for letters, number and symbols)
	> **Note:** `NumLock` is on by default. `CapsLock` and `ScrollLock` are off.
* The following event properties are set according to the modifier keys that are pressed down:
	* `event.ctrlKey`
	* `event.altKey`
	* `event.shiftKey`
	* `event.metaKey`
* The following event properties are set with defaults:
	* `event.bubbles = true`
	* `event.cancelable = true`
	* `event.composed = true`
	* `event.repeat = false`
	* `event.isComposing = false`
	* `event.view = Window`
	* `event.location = 1`
* Pressing an already-down key throws an error.
* Releasing a non-pressed key throws an error.


> Currently only supports EN-US Qwerty keyboard layout.



Install
-------
```sh
$ npm install keyboard-simulator
```

Basic Usage
-----------

```js
import {KeyboardSimulator} from 'keyboard-simulator`;

const kbSim = new KeyboardSimulator();

kbSim.keyDown('A');
kbSim.keyUp('A');
// or:
kbSim.keyPress('A');


kbSim.keyDown('Ctrl', 'B');
keyDown.release();
// or:
kbSim.Combine('Ctrl', 'B');
```

The Dispatching Element
-----------------------
> The element that **listens** to events is the `event.currentTarget`.  
The element that **dispatches** events is the `event.target`.

When typing, keyboard events are naturally dispatched on the element within focus. On a fresh page load, focus starts on the `<body>` element until another element, such as an input field, receives focus, either by user interaction (e.g. when clicked on or Tab-navigated into) or programmatically (e.g. `input.focus()`). Once in focus, all keyboard events will be dispatched on that `input` element.


The `Document` object tracks the currently focused element, which can be accessed via `document.activeElement`. By default, `KeyboardSimulator` follows this behavior and dispatches keyboard events on the currently active element:

```js
kbSim.keyDown('A');
// --> document.activeElement.dispatchEvent(KeyboardEvent)
```


When `document.activeElement` doesn't point to your expected element, make sure that element is:
1. "focusable"
2. currently has focus.

> _To enable focus on an "unfocusable" element give it a `tabindex="1"` attribute and call `.focus()` on that element.  
See [MDN tabindex docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) for details._

If you prefer not to use the dynamic behavior of `document.activeElement` you can override it by setting a static context element. You can do so on construction or by calling the instance's `.setContextElm(elm)` method.

At any point you can check the current context element with `instance.ctxElm`

API
---
### Constructor

```js
const instance = new KeyboardSimulator(contextElm);

// or:
const instance = new KeyboardSimulator();

instance.setContextElm(contextElm); // optional
```
> **⚠ Non-browser environments:** You might need to pass in the runtime's `document` object as the constructor argument. [See details](#non-browser-environments).

**`contextElm`** - Optional. `HTMLElement | Document`  
* `HTMLElement` - That element becomes the dispatching element. This overrides the default behavior of a dynamic dispatching element mentioned above.
* `Document` - A document is only used for reference. The dispatching element remains dynamic.


Returns a `KeyboardSimulator` instance that has the following methods:

* [`.keyDown()`](#keydownkeys)
* [`.keyUp()`](#keyupkeys)
* [`.keyPress()`](#keypresskeys)
* [`.combine()`](#combinekeys)
* [`.repeat()`](#repeatcount)
* [`.release()`](#release)
* [`.setContextElm()`](#setcontextelmhtmlelement)
* [`.ctxElm`](#ctxelm---getter) [Getter]
* [`.createKeyboardEvent()`](#createkeyboardeventeventtype-keyname-eventopts)
* [`.reset()`](#reset)

See the [Key List](#keys-list) below.

#### Non-Browser Environments
The `contextElm` is also being used internally for referencing the `Document` object so passing a context might be mandatory when running in non-browser environments (e.g. JSDOM when not configured ideally).

If no context is passed, `Document` is grabbed from the global scope and that might cause an issue as the library code and your runtime code are using different `Document` objects. In this case pass the contructor with the `document` object (it will not be treated as a context element).

If you pass in an `HTMLElement` you don't need to pass a `document`, it will be derived from the HTML element via `elm.ownerDocument`.

### .keyDown(...keys)
Dispatches one or more `keydown` events of given keys.  
Returns a boolean (or an array of booleans if passed in multiple keys), which is the result of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

```js
kbSim.keyDown('A');
kbSim.keyDown('X', 'Y', 'Z');
```

The instance tries to simulate a real physical keyboard so when a key is already pressed down, trying to press it again throws an error:
```js
kbSim.keyDown('A');
kbSim.keyDown('A'); // ERROR - key 'A' is already pressed down
```

### .keyUp(...keys)
Dispatches one or more `keyup` events of given keys.  
Returns a boolean (or an array of booleans if passed in multiple keys), which is the result of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

```js
kbSim.keyUp('A');
kbSim.keyUp('X', 'Y', 'Z');
```

The instance tries to simulate a real physical keyboard so when a key is not pressed down, trying to release it with `.keyUp()` throws an error:
```js
kbSim.keyDown('A');
kbSim.keyUp('A');
kbSim.keyUp('A'); // ERROR - key 'A' is not pressed down
```

### .keyPress(...keys)
Dispatches a `keydown` event followed by a `keyup` event for each given key, like user typing.  
Returns a tuple (for a single key) or an array of tuples (for multiple keys). Each tuple is an array of two booleans i.e `[true, true]`. These booleans are the results of the dispatching of two events of a single keypress, one for the dispatching of `keydown` and one for `keyup`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

```js
kbSim.keyPress('A');
kbSim.keyPress('A', 'B', 'C');

const results = kbSim.keyPress('A', 'B', 'C');
// -> [[true, true], [true, true], [true, true]]
// -> [[A down, up], [B down, up], [C down, up]]
```

### .combine(...keys)
For simulating key combinations (e.g. `ctrl-alt-m`). First, it dispatches `keydown` events for all given keys, then dispatches all the `keyup` events in reverse order (last pressed key is released first).  
Returns a tuple of two arrays: the first one is for all the `keydown` events and the second is for the `keyup` events (reversed). [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).


```js
const results = kbSim.combine('Ctrl', 'Alt', 'A');
// -> [[true, true, true], [true, true, true]]

const [keydownResults, keyupResults] = results;
// keydownResults -> [CtrlDown, AltDown, ADown]
// keyupResults   -> [AUp, AltUp, CtrlUp]
```

### .repeat(count)
Simulates holding a key down by dispatching multiple `keydown` events for the last pressed key with the `repeat` property set to `true`.  
Returns an array of booleans which are the results of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

```js
kbSim.keyDown('A', 'B', 'C'); // A B C
kbSim.repeat(3);              // C C C
```

### .release()
Dispatches `keyup` events for all the keys that are pressed down in the reverse order in which they were pressed (the first key down is the last to be released).  
Return the same results as [`.keyUp()`](#keyupkeys)

> NOTE: Can also be used as a `.keyUp()` alias.

```js
kbSim.keyDown('A', 'B', 'C');

kbSim.release(); // keyup C, B, A
// or:
kbSim.release('C', 'B', 'A');
```


### .setContextElm(HTMLElement)
Sets an element as the dispatching element. Once a context element is set, the instance will ignore `document.activeElement`.

Call with no arguments to unset the context element. The instance will dispatch on `document.activeElement` again.

```js
const kbSim = new KeyboardSimulator();
// document.activeElement = `<body>` by default 

kbSim.keyPress('A');        // ev.target === <body>
input.focus();              // Changes active element
kbSim.keyPress('A');        // ev.target === <input>

kbSim.setContextElm(myDiv); // Overrides active element
input.focus();              // wouldn't matter
kbSim.keyPress('A');        // ev.target === <myDiv>

kbSim.setContextElm();      // Back to activeElement
kbSim.keyPress('A');        // ev.target === <input>
```
> Note: Calling `.reset()` removes the context element.



### .ctxElm - [Getter]
Returns the current dispathing element.
If a context element is set - returns it, else returns `document.activeElement`.

> `document.activeElement` might be `null` in non-browser environments.

```js
const kbSim = new KeyboardSimulator();
// document.activeElement = `<body>` by default 

consle.log(kbSim.ctxElm);   // -> <body>
input.focus();              // Changes active element
consle.log(kbSim.ctxElm);   // -> <input>

kbSim.setContextElm(myDiv);
consle.log(kbSim.ctxElm);   // -> <myDiv>
input.focus();              // wouldn't matter
consle.log(kbSim.ctxElm);   // -> <myDiv>

kbSim.setContextElm();      // Back to activeElement
consle.log(kbSim.ctxElm);   // -> <input>
```


### .createKeyboardEvent(eventType, keyName, eventOpts)
* **eventType** - `'keydown'` | `'keyup'`
* **keyName** - A key ID or alias (see [Key List](#keys-list) below)
* **eventOpts** - Optional. `KeyboardEventInit` type. See defaults below or read more on [MDN KeyboardEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent#parameters).

If, for any reason, KeyboardSimulator methods don't support your need, you can create and dispatch your own keyboard event.

`eventOpts` defaults are:
```js
	{
		code: ?,       // Resolved from `keyName` argument
		key: ?,        // Resolved from `keyName` argument
		ctrlKey: ?,    // According to the state of the instance
		altKey: ?,     // According to the state of the instance
		shiftKey: ?,   // According to the state of the instance
		metaKey: ?,    // According to the state of the instance
		view: Window,  // Resolved from the context element or from the environment
		repeat: false,
		location: 1,
		bubbles: true,
		cancelable: true,
		composed: true,
		isComposing: false,
	}
```

```js
const kbEvent = kbSim.createKeyboardEvent('keydown', 'A', {bubbles: false});

kbSim.ctxElm.dispatchEvent(kbEvent);
```


### .reset()
The instance keeps track of pressed keys. Calling `.reset()` clears the records, context element included.

> NOTE: `.reset()` does not clear the `document` reference.

```js
kbSim.keyDown('A');
kbSim.keyDown('A'); // ERROR - key 'A' is already pressed down
kbSim.reset();
kbSim.keyDown('A'); // OK
```


Keys
----
The Keyboard Simulator instance's methods expect a `KeyName` type or an array of them.

`KeyName` could be either a standard key ID (`ev.code`) or an alias, provided by Keyboard Simulator.

A key ID is like an identifier of a specific physical key on a keyboad. Aliases are just for sugar.

For example, there is no such key as `Control`, there are only `ControlLeft` and `ControlRight` key IDs. `Control` is their common generated value.  
That said, using key aliases you can use `Control` or `Ctrl`. Both are mapped to `ControlLeft`.

### Keys List
>**NOTE:**  
Key IDs are case sensitive. Aliases are not.  
Not all keys have aliases.


| Key ID         | Aliases                |
|----------------|------------------------|
| KeyA           | A                      |
| KeyB           | B                      |
| KeyC           | C                      |
| KeyD           | D                      |
| KeyE           | E                      |
| KeyF           | F                      |
| KeyG           | G                      |
| KeyH           | H                      |
| KeyI           | I                      |
| KeyJ           | J                      |
| KeyK           | K                      |
| KeyL           | L                      |
| KeyM           | M                      |
| KeyN           | N                      |
| KeyO           | O                      |
| KeyP           | P                      |
| KeyQ           | Q                      |
| KeyR           | R                      |
| KeyS           | S                      |
| KeyT           | T                      |
| KeyU           | U                      |
| KeyV           | V                      |
| KeyW           | W                      |
| KeyX           | X                      |
| KeyY           | Y                      |
| KeyZ           | Z                      |
| Digit0         | 0                      |
| Digit1         | 1                      |
| Digit2         | 2                      |
| Digit3         | 3                      |
| Digit4         | 4                      |
| Digit5         | 5                      |
| Digit6         | 6                      |
| Digit7         | 7                      |
| Digit8         | 8                      |
| Digit9         | 9                      |
| Numpad0        | Np0                    |
| Numpad1        | Np1                    |
| Numpad2        | Np2                    |
| Numpad3        | Np3                    |
| Numpad4        | Np4                    |
| Numpad5        | Np5                    |
| Numpad6        | Np6                    |
| Numpad7        | Np7                    |
| Numpad8        | Np8                    |
| Numpad9        | Np9                    |
| NumpadDecimal  | Decimal                |
| NumpadDivide   | Divide                 |
| NumpadSubtract | Subtract               |
| NumpadMultiply | Multiply               |
| NumpadAdd      | Add                    |
| ArrowUp        | Up                     |
| ArrowRight     | Right                  |
| ArrowDown      | Down                   |
| ArrowLeft      | Left                   |
| PageUp         | PgUp                   |
| PageDown       | PgDn                   |
| Home           |                        |
| End            |                        |
| ControlLeft    | Ctrl / Control / LCtrl |
| ControlRight   | RCtrl                  |
| AltLeft        | Alt / LAlt             |
| AltRight       | RAlt                   |
| ShiftLeft      | Shift / LShift         |
| ShiftRight     | RShift                 |
| MetaLeft       | Meta / LMeta           |
| MetaRight      | RMeta                  |
| Slash          |                        |
| Backslash      |                        |
| IntlBackslash  |                        |
| Period         |                        |
| Comma          |                        |
| Quote          | SingleQuote            |
| Backquote      | BackTick               |
| Semicolon      |                        |
| BracketLeft    |                        |
| BracketRight   |                        |
| Minus          |                        |
| Equal          |                        |
| Enter          |                        |
| NumpadEnter    | NpEnter / REnter       |
| Space          |                        |
| Backspace      |                        |
| Tab            |                        |
| Delete         | Del                    |
| Insert         | Ins                    |
| Pause          |                        |
| PrintScreen    |                        |
| ScrollLock     |                        |
| NumLock        |                        |
| CapsLock       |                        |
| ContextMenu    |                        |
| Escape         | Esc                    |
| F1             |                        |
| F2             |                        |
| F3             |                        |
| F4             |                        |
| F5             |                        |
| F6             |                        |
| F7             |                        |
| F8             |                        |
| F9             |                        |
| F10            |                        |
| F11            |                        |
| F12            |                        |
| F13            |                        |
| F14            |                        |
| F15            |                        |
| F16            |                        |
| F17            |                        |
| F18            |                        |
| F19            |                        |
| F20            |                        |
| F21            |                        |
| F22            |                        |
| F23            |                        |
| F24            |                        |
