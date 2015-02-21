/**
 * GUI Module
 * Rendering of interface components and interactive features
 */

var GUI = function (scene) {
	this.components = [];
};

GUI.prototype.addComponent = function (component) {
	this.components.push(component);
};

GUI.prototype.draw = function (renderer) {
	// body...
};

module.exports = GUI;
