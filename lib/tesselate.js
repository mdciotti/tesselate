/* Tesselate Tile Engine and Editor
 * a basic two dimensional tiled game map editor
 */

var Canvas2DRenderer = require('./canvas2d.js'),
	Scene = require('./scene.js'),
	InputMap = require('./inputMap.js'),
	GUI = require('./gui.js'),
	DebugInfo = require('./debug.js');

var Tesselate = {
	input: null,
	scene: null,
	debug: null,
	gui: null
};

Tesselate.setup = function (setup) {
	window.addEventListener('load', function (e) {
		Tesselate.initialize();
		setup.call(Tesselate);
	}, false);
};

Tesselate.initialize = function () {
	var renderer = new Canvas2DRenderer();
	Tesselate.scene = new Scene(renderer);
	Tesselate.input = new InputMap();
	Tesselate.debug = new DebugInfo();
	Tesselate.gui = new GUI(renderer);
};

module.exports = Tesselate;
