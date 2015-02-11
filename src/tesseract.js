/* Tesseract API Foundation
 * Coordinates the various subsystems
 */

var Canvas2DRenderer = require('./canvas2d.js'),
	Scene = require('./scene.js'),
	InputMap = require('./inputMap.js')
	World = require('./world.js'),
	kb = require('kb-controls'),
	TileSet = require('./tileset.js'),
	Layer = require('./layer.js'),
	GameGUI = require('./gui.js'),
	DebugInfo = require('./debug.js');

// var Engine = function () {
// 	var renderer = new Canvas2DRenderer();
// 	this.scene = new Scene(renderer);
// 	this.inputMap = new InputMap();
// };

var Tesseract = {
	input: null,
	scene: null,
	World: World,
	Keyboard: kb,
	TileSet: TileSet,
	Layer: Layer
};

Tesseract.setup = function (setup) {
	window.addEventListener('load', function (e) {
		Tesseract.initialize();
		setup.call(Tesseract);
	}, false);
};

Tesseract.initialize = function () {
	var renderer = new Canvas2DRenderer();
	Tesseract.scene = new Scene(renderer);
	Tesseract.input = new InputMap();
	Tesseract.debug = new DebugInfo();
	Tesseract.gui = new GameGUI(renderer);
};

module.exports = Tesseract;
