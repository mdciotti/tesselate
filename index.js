/* Tilemap Editor
 * Main script entry point
 */

var Tesseract = require('./lib/tesseract.js');
var Tilemap = require('./lib/tilemap.js');
var Tileset = require('./lib/tileset.js');
var Layer = require('./lib/layer.js');
var util = require('./lib/utilities.js');
var Tile = require('./data/tile/index.js');

var kb = require('kb-controls');
var ndarray = require('ndarray');
var fps = require('fps');
	
Tesseract.setup(function () {

	var tilemap1 = new Tilemap({
		name: "Test Tilemap",
		width: 32,
		height: 20
	});

	var tileset = new Tileset({ tileWidth: 8, tileHeight: 8 });
	tileset.load("sprites/terrain.png");

	var woodLayer = new Layer({
		name: "Wood",
		width: 32,
		height: 20
	});
	woodLayer.setTileType(Tile.WoodPanel);

	// NORTHWEST
	woodLayer.inject(0, 0, ndarray([
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	], [16, 10], [1, 16]));

	// NORTHEAST
	woodLayer.inject(16, 0, ndarray([
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
	], [16, 10], [1, 16]));

	// SOUTHWEST
	woodLayer.inject(0, 10, ndarray([
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	], [16, 10], [1, 16]));

	// SOUTHEAST
	woodLayer.inject(16, 10, ndarray([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	], [16, 10], [1, 16]));


	// // SPACE INVADER
	var invaderLayer = new Layer({
		name: "Invader Layer",
		width: 32,
		height: 20
	});
	invaderLayer.setTileType(Tile.MetalPlate);

	invaderLayer.inject(19, 2, ndarray([
		0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
		0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
		1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
		0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0
	], [11, 8], [1, 11]));

	// Precedence test
	// var threeSquare = ndarray([
	// 	1, 1, 1,
	// 	1, 1, 1,
	// 	1, 1, 1
	// ], [3, 3], [1, 3]);

	// var i = 2;
	// for (var tileData in Tile) {
	// 	if (util.hasProp(Tile, tileData)) {
	// 		var layer = new Tesseract.Layer({ width: 32, height: 20 });
	// 		layer.setTileType(Tile[tileData]);
	// 		layer.inject(i, i, threeSquare);
	// 		tilemap1.add(layer);
	// 		++i;
	// 	}
	// }

	tilemap1.addTileset(tileset);
	tilemap1.addLayer(woodLayer);
	tilemap1.addLayer(invaderLayer);
	tilemap1.finalize();

	Tesseract.scene.setTileMap(tilemap1);
	// Tesseract.scene.setScale(4);

	var MOUSE = Tesseract.input.MOUSE;
	var mouseIsDown = false;
	var mouseX = 0;
	var mouseY = 0;
	var mouseDX = 0;
	var mouseDY = 0;
	var mouseDragX = 0;
	var mouseDragY = 0;

	Tesseract.input.onMouseDown(MOUSE.LEFT, function (e) {
		mouseIsDown = true;
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	Tesseract.input.onMouseUp(MOUSE.LEFT, function (e) {
		mouseIsDown = false;
		mouseDX = 0;
		mouseDY = 0;
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	Tesseract.input.onMouseMove(MOUSE.ANY, function (e) {
		mouseX = e.clientX;
		mouseY = e.clientY;

		if (mouseIsDown) {
			// if (e.hasOwnProperty("movementX")) {
				mouseDragX = mouseDX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
				mouseDragY = mouseDY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
			// } else {
			// 	mouseDragX = mouseDX = e.clientX - mouseX;
			// 	mouseX = e.clientX;
			// 	mouseDragY = mouseDY = e.clientY - mouseY;
			// 	mouseY = e.clientY;
			// }
		} else {
			mouseDragX = 0;
			mouseDragY = 0;
		}
	});

	var running = true;
	var paused = false;
	var debug = false;

	Tesseract.input.disableContextMenu();

	var KEY = Tesseract.input.KEY;
	Tesseract.input.onKeyUp(KEY.BACKSPACE, function (e) {
		e.preventDefault();
		return false;
	});
	Tesseract.input.onKeyUp(KEY.ESCAPE, function (e) {
		running = false;
	});
	Tesseract.input.onKeyUp(KEY.SPACE, function (e) {
		paused = !paused;
	});
	Tesseract.input.onKeyUp(KEY.MINUS, function (e) {
		var oldScale = Tesseract.scene.scale;
		Tesseract.scene.setScale(Math.max(2, oldScale - 1));
	});
	Tesseract.input.onKeyUp(KEY.PLUS, function (e) {
		var oldScale = Tesseract.scene.scale;
		Tesseract.scene.setScale(Math.min(8, oldScale + 1));
	});
	Tesseract.input.onKeyUp(KEY.BACKTICK, function (e) {
		debug = !debug;
	});

	var ticker = fps({ every: 10, decay: 0.5 });
	var fpsString;

	Tesseract.debug.add("View Box", function () {
		return "(" + Tesseract.scene.viewBox.join(", ") + ")";
	});
	Tesseract.debug.add("Offset", function () {
		var kx = tilemap1.tileWidth * Tesseract.scene.scale;
		var ky = tilemap1.tileHeight * Tesseract.scene.scale;
		var x = util.flooredDivision(Tesseract.scene.viewBox[0], kx);
		var y = util.flooredDivision(Tesseract.scene.viewBox[1], ky);
		return "(" + x + ", " + y + ")";
	});
	Tesseract.debug.add("Mouse Drag", function () {
		return "(" + mouseDragX + ", " + mouseDragY + ")";
	});
	Tesseract.debug.add("Mouse Pos", function () {
		return "(" + mouseX + ", " + mouseY + ")";
	});
	Tesseract.debug.add("Paused", function () {
		return paused ? "true" : "false";
	});
	Tesseract.debug.add("Zoom", function () {
		return Tesseract.scene.scale;
	});
	// Tesseract.debug.add("Tiles painted", function () {
	// 	// var k = tilemap1.tileSize * Tesseract.scene.scale;
	// 	// var width = Math.floor(Tesseract.scene.viewBox[2] / k) + 1;
	// 	// var height = Math.floor(Tesseract.scene.viewBox[3] / k) + 1;
	// 	// return width * height;
	// });
	Tesseract.debug.add("Framerate (f/s)", function () {
		return fpsString;
	});
	ticker.on("data", function (framerate) {
		fpsString = framerate.toFixed(1);
	});

	function loop() {
		if (!running) return;

		requestAnimationFrame(loop);

		if (mouseIsDown) {
			Tesseract.scene.viewBox[0] -= mouseDragX;
			Tesseract.scene.viewBox[1] -= mouseDragY;
		}

		Tesseract.scene.clear();

		if (paused) {
			// Tesseract.gui.overlay();
		} else {
			Tesseract.scene.draw();
			// Tesseract.gui.draw();
		}

		if (debug) {
			ticker.tick();
			Tesseract.debug.displayAllStrings(Tesseract.scene.renderer);
			var ctx = Tesseract.scene.renderer.context;
			// Viewport center
			ctx.fillStyle = "#0000ff";
			ctx.beginPath();
			var x = Tesseract.scene.viewBox[2] / 2;
			var y = Tesseract.scene.viewBox[3] / 2;
			ctx.arc(x, y, 10, 0, Math.PI * 2, false);
			ctx.fill();
			// Tilemap center
			ctx.fillStyle = "#00ff00";
			ctx.beginPath();
			// x = -Tesseract.scene.viewBox[0] + Tesseract.scene.scale * tilemap1.width * tilemap1.tileWidth / 2;
			// y = -Tesseract.scene.viewBox[1] + Tesseract.scene.scale * tilemap1.height * tilemap1.tileHeight / 2;
			x = -Tesseract.scene.viewBox[0] + Tesseract.scene.viewBox[2] / 2;
			y = -Tesseract.scene.viewBox[1] + Tesseract.scene.viewBox[3] / 2;
			ctx.arc(x, y, 10, 0, Math.PI * 2, false);
			ctx.fill();
		}

		mouseDragX = 0;
		mouseDragY = 0;
	}

	loop();

	document.body.addEventListener("keyup", function (e) {
		console.log(e.which, e.keyIdentifier);
	}, false);

	// window.addEventListener("beforeunload", function (e) {
	// 	(e || window.event).returnValue = "IE???";
	// 	return "Hello Unload!";
	// });

});
