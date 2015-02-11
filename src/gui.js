/**
 * UI Module
 * Rendering of interface components and interactive features
 */

var GameGUI = function () {
	this.components = [];
};

GameGUI.prototype.addComponent = function (component) {
	this.components.push(component);
};

GameGUI.prototype.draw = function (renderer) {
	// body...
};

module.exports = GameGUI;
