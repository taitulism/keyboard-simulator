![Build Status](https://github.com/taitulism/keyboard-simulator/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


Keyboard Simulator
==================
A smart keyboard events dispatcher.

Keyboard Simulator aims to mimick a real keyboard behavior by keeping track of its key activation (e.g. `kb.keyDown()`).  
Generated events are shaped according to the different keyboard states.

Currently only supports EN-US Qwerty keyboard layout.

Key features:
* The value of `event.key` will be set to (for the relevant keys):
	* **Digits** when `NumLock` is on
	* **Uppercase letters** when `CapsLock` is on
	* **Uppercase letters** when `Shift` is pressed down
	* **Alternative symbols** when `Shift` is pressed down
* When a modifier key is pressed down (Control, Alt, Shift, Meta) the following event properties will be set to `true` accordingly:
	* `event.ctrlKey`
	* `event.altKey`
	* `event.shiftKey`
	* `event.metaKey`
* Pressing an already-down key is prevented
* Releasing a non-pressed key is prevented

> **Note:** `NumLock` is on by default. `CapsLock` and `ScrollLock` are off.

Scroll down to see the [Key List](#keys-list)

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

kbSim.keyPress('B');
```

API
---
### Constructor
```js
const kbSim = new KeyboardSimulator(contextElement = document);
```
The context element is the element that dispatches the following keyboard events.
The default is `document`.  
Returns a `KeyboardSimulator` instance that has the following methods:

* [`.keyDown()`](#keydownkeys)
* [`.keyUp()`](#keyupkeys)
* [`.keyPress()`](#keypresskeys)
* [`.combine()`](#combinekeys)
* [`.repeat()`](#repeatcount)
* [`.release()`](#release)
* [`.setContextElm()`](#setcontextelmhtmlelement)
* [`.reset()`](#reset)

Scroll down to see the [Key List](#keys-list)

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
kbSim.keyDown('A'); // ERROR
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
kbSim.keyUp('A');
kbSim.keyUp('A'); // ERROR
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
For simulating key combinations (e.g. `ctrl-alt-m`). First, it dispatches `keydown` events for all given keys, then dispatches all the `keyup` events in reverse (last pressed key is released first).  
Returns a tuple of two arrays: the first one is for the return values of dispatching all the given keys `keydown` events and the second is for the **reverse** dispatching of their `keyup` events. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).


```js
kbSim.combine('Ctrl', 'Alt', 'A');

const results = kbSim.combine('Ctrl', 'Alt', 'A');
// -> [[true, true, true], [true, true, true]]

const [keydownResults, keyupResults] = results;
// keydownResults -> [CtrlDown, AltDown, ADown]
// keyupResults   -> [AUp, AltUp, CtrlUp]
```

### .repeat(count)
Simulates holding a key down by dispatching multiple `keydown` events for the last pressed key with the `repeat` property set to `true`.  
Returns a boolean, which is the result of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

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
Sets a new context element to dispatch following events.

```js
const kbSim = new KeyboardSimulator(); // `document` is the default

kbSim.keyPress('A'); // document.dispatchEvent()
kbSim.setContextElm(myDiv);
kbSim.keyPress('A'); // myDiv.dispatchEvent()
```

### .reset()
The instance keeps track of pressed keys. Calling `.reset()` clears the records but does not change the context element.

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
