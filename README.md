![Build Status](https://github.com/taitulism/keyboard-simulator/actions/workflows/node-ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


Keyboard Simulator
==================
Simulate key presess.

Currently only supports EN-US keyboard layout.

The key point of this library is mimicking a real keyboard so you can't press a key that is already pressed down and you cannot release a key that is not pressed down.
Holding the `Shift` key makes the following key presses generate the alternative values for the relevant keys (pressing `2` while shift is down generates `@` instead).

> `CapsLock` and `NumLock` that when are `ON` generate alternative values are not supported yet in a similar way.

Also, holding a modifier key down (`Control`, `Alt`, `Shift`, `Meta`) updates following events accordingly (e.g. `ev.ctrlKey = true`).

TODO: add supported key list

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
The default is `document`. Returns a `KeyboardSimulator` instance that has the following methods:

* `.keyDown()`
* `.keyUp()`
* `.keyPress()`
* `.holdKey()`
* `.releaseAll()`
* `.setContextElement()`
* `.reset()`

### .keyDown(...keys)
Dispatches one or more `keydown` events of given keys. Returns a boolean (or an array of booleans if passed in multiple keys), which is the result of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

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
Dispatches one or more `keyup` events of given keys. Returns a boolean (or an array of booleans if passed in multiple keys), which is the result of `.dispatchEvent()`. [MDN dispatchEvent docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

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
Dispatches `keydown` followed by `keyup` events for each given key. Returns an array of two booleans (per key, one for the `keydown` event and one for `keyup`) or an array of array of two booleans if passed in multiple keys.

```js
kbSim.keyPress('A');
kbSim.keyPress('A', 'B', 'C');
```

### .holdKey(key, repeatCount)
Simulates holding a key down by dispatching multiple `keydown` events for the same key with the `repeat` property set to `true`. Returns a boolean, which is the result of `.dspatchEvent docs)`. [MDN `dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#return_value).

```js
kbSim.keyDown('A', 'B', 'C');
kbSim.holdKey('C', 3);
```

### .releaseAll()
Dispatches `keyup` events for all the keys that are pressed down in a reversed order of which they were pressed down (first down = last to be released)

```js
kbSim.keyDown('A', 'B', 'C');
kbSim.releaseAll(); // keyup C, B, A
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
