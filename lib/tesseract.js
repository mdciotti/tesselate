/* Tesseract Tile Engine and Editor
 * a basic two dimensional tiled game map editor
 */

var Canvas2DRenderer = require('./canvas2d.js'),
	Scene = require('./scene.js'),
	InputMap = require('./inputMap.js'),
	GUI = require('./gui.js'),
	DebugInfo = require('./debug.js');

var Tesseract = {
	input: null,
	scene: null,
	debug: null,
	gui: null
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
	Tesseract.gui = new GUI(renderer);
};

module.exports = Tesseract;
