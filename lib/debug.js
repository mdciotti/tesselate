/* Debug Module
 * Displays debug information on screen
 */

var DebugInfo = function () {
	this.debugStrings = [];
	// TODO: should fontSize be stored per debug string to
	// support variable line heights?
	this.fontSize = 16;
	this.textColor = "#ffffff";
	this.backgroundColor = "#000000";
	this.backgroundOpacity = 0.5;
};

DebugInfo.prototype.add = function (name, stringGetter) {
	this.debugStrings.push({
		name: name,
		stringGetter: stringGetter
	});
};

DebugInfo.prototype.displayAllStrings = function (renderer) {
	// var lineHeight = this.fontSize + 4;
	var margin = 5;
	// var self = this;
	// this.debugStrings.forEach(function (debugStr, index) {
	// 	var top = index * lineHeight + margin;
	// 	var str = debugStr.name + ": " + debugStr.stringGetter.call();
	// 	renderer.drawText(str, margin, top, {
	// 		fontSize: self.fontSize,
	// 		color: self.textColor,
	// 		background: self.backgroundColor,
	// 		backgroundOpacity: self.backgroundOpacity,
	// 		backgroundPadding: 2
	// 	});
	// });
	var strings = this.debugStrings.map(function (debugStr) {
		return debugStr.name + ": " + debugStr.stringGetter.call();
	});
	renderer.drawPlainText(strings, margin, margin, {
		fontSize: self.fontSize,
		color: self.textColor
	});
};

module.exports = DebugInfo;
