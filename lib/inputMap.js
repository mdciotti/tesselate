/* Input Map Class
 * Maps an input system to game actions
 */

var InputMap = function () {
	this.keyMap = {};
	this.action = {};
	this.state = {};
	this.range = {};
};

InputMap.prototype.MOUSE = {
	DOWN: "mousedown",
	UP: "mouseup",
	MOVE: "mousemove",
	ANY: -1,
	LEFT: 1,
	MIDDLE: 2,
	RIGHT: 3
};

InputMap.prototype.KEY = {
	ANY: -1,

	BACKSPACE: 0x08,
	ENTER: 0x0D, // "Enter"
	SHIFT: 0x10, // "Shift"
	CONTROL: 0x11, // "Control"
	ALT: 0x12, // "Alt"
	ESCAPE: 0x1B,
	SPACE: 0x20,
	WINDOWS: 0x5B, // "Win"
	META: 0x5B, // "Meta"

	LEFT: 0x25, // "Left"
	UP: 0x26, // "Up"
	RIGHT: 0x27, // "Right"
	DOWN: 0x28, // "Down"

	ZERO: 0x30,
	ONE: 0x31,
	TWO: 0x32,
	THREE: 0x33,
	FOUR: 0x34,
	FIVE: 0x35,
	SIX: 0x36,
	SEVEN: 0x37,
	EIGHT: 0x38,
	NINE: 0x39,

	MINUS: 0xBD,
	UNDERSCORE: 0xBD,
	PLUS: 0xBB,
	EQUALS: 0xBB,
	BACKTICK: 0xC0
};

function contextMenuListener(e) {
	e.preventDefault();
	return false;
}

InputMap.prototype.disableContextMenu = function (inputType, callback) {
	document.body.addEventListener("contextmenu", contextMenuListener);
};

InputMap.prototype.enableContextMenu = function (inputType, callback) {
	document.body.removeEventListener("contextmenu", contextMenuListener);
};

InputMap.prototype.attachListener = function (inputType, callback) {
	document.body.addEventListener(inputType, callback);
};

InputMap.prototype.removeListener = function (inputType, callback) {
	document.body.removeEventListener(inputType, callback);
};

InputMap.prototype.onMouseDown = function (button, callback) {
	document.body.addEventListener("mousedown", function (e) {
		if (e.which === button || button === -1) {
			return callback.call(null, e);
		}
	});
};

InputMap.prototype.onMouseUp = function (button, callback) {
	document.body.addEventListener("mouseup", function (e) {
		if (e.which === button || button === -1) {
			return callback.call(null, e);
		}
	});
};

InputMap.prototype.onMouseMove = function (button, callback) {
	document.body.addEventListener("mousemove", function (e) {
		if (e.which === button || button === -1) {
			return callback.call(null, e);
		}
	});
};

InputMap.prototype.onKeyDown = function (key, callback) {
	document.body.addEventListener("keydown", function (e) {
		// console.log("down:", e);
		if (e.which === key || key === -1) {
			return callback.call(null, e);
		}
	});
};

InputMap.prototype.onKeyUp = function (key, callback) {
	document.body.addEventListener("keyup", function (e) {
		// console.log("up:", e);
		if (e.which === key || key === -1) {
			return callback.call(null, e);
		}
	});
};

InputMap.prototype.onKeyPress = function (key, callback) {
	document.body.addEventListener("keypress", function (e) {
		// console.log("press:", e);
		if (e.which === key || key === -1) {
			return callback.call(null, e);
		}
	});
};

module.exports = InputMap;
