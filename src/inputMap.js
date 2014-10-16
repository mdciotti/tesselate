/* Input Map Class
 * Maps an input system to game actions
 */

var InputMap = function () {
	this.keyMap = {};
	this.onMouseMove = null;
	this.action = {};
	this.state = {};
	this.range = {};
};

InputMap.prototype.attachMouseListener = function (callback) {
	// body...
};

module.exports = InputMap;
