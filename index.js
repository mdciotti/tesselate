/* Tilemap Editor
 * Main script entry point
 */

var Tesselate = require('./lib/tesselate.js');
var Tilemap = require('./lib/tilemap.js');
var Tileset = require('./lib/tileset.js');
var Layer = require('./lib/layer.js');
var util = require('./lib/utilities.js');
var Tile = require('./data/tile/index.js');

var kb = require('kb-controls');
var ndarray = require('ndarray');
var fps = require('fps');
	
Tesselate.setup(function () {

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

	// // Tile test
	// var threeSquare = ndarray([
	// 	1, 1, 1,
	// 	1, 1, 1,
	// 	1, 1, 1
	// ], [3, 3], [1, 3]);

	// var i = 2;
	// for (var tileData in Tile) {
	// 	if (util.hasProp(Tile, tileData)) {
	// 		var layer = new Layer({ width: 32, height: 20 });
	// 		layer.setTileType(Tile[tileData]);
	// 		layer.inject(4*i - 7, 1, threeSquare);
	// 		tilemap1.addLayer(layer);
	// 		++i;
	// 	}
	// }

	tilemap1.addTileset(tileset);
	tilemap1.addLayer(woodLayer);
	tilemap1.addLayer(invaderLayer);
	tilemap1.finalize();

	Tesselate.scene.setTileMap(tilemap1);
	// Tesselate.scene.setScale(4);

	var MOUSE = Tesselate.input.MOUSE;
	var mouseIsDown = false;
	var mouseX = 0;
	var mouseY = 0;
	var mouseDX = 0;
	var mouseDY = 0;
	var mouseDragX = 0;
	var mouseDragY = 0;

	Tesselate.input.onMouseDown(MOUSE.LEFT, function (e) {
		mouseIsDown = true;
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	Tesselate.input.onMouseUp(MOUSE.LEFT, function (e) {
		mouseIsDown = false;
		mouseDX = 0;
		mouseDY = 0;
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	Tesselate.input.onMouseMove(MOUSE.ANY, function (e) {
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

	Tesselate.input.disableContextMenu();

	var KEY = Tesselate.input.KEY;
	Tesselate.input.onKeyUp(KEY.BACKSPACE, function (e) {
		e.preventDefault();
		return false;
	});
	Tesselate.input.onKeyUp(KEY.ESCAPE, function (e) {
		running = false;
	});
	Tesselate.input.onKeyUp(KEY.SPACE, function (e) {
		paused = !paused;
	});
	Tesselate.input.onKeyUp(KEY.MINUS, function (e) {
		var oldScale = Tesselate.scene.scale;
		Tesselate.scene.setScale(Math.max(2, oldScale - 1));
	});
	Tesselate.input.onKeyUp(KEY.PLUS, function (e) {
		var oldScale = Tesselate.scene.scale;
		Tesselate.scene.setScale(Math.min(8, oldScale + 1));
	});
	Tesselate.input.onKeyUp(KEY.BACKTICK, function (e) {
		debug = !debug;
	});

	var ticker = fps({ every: 10, decay: 0.5 });
	var fpsString;

	Tesselate.debug.add("View Box", function () {
		return "(" + Tesselate.scene.viewBox.join(", ") + ")";
	});
	Tesselate.debug.add("Offset", function () {
		var kx = tilemap1.tileWidth * Tesselate.scene.scale;
		var ky = tilemap1.tileHeight * Tesselate.scene.scale;
		var x = util.flooredDivision(Tesselate.scene.viewBox[0], kx);
		var y = util.flooredDivision(Tesselate.scene.viewBox[1], ky);
		return "(" + x + ", " + y + ")";
	});
	Tesselate.debug.add("Mouse Drag", function () {
		return "(" + mouseDragX + ", " + mouseDragY + ")";
	});
	Tesselate.debug.add("Mouse Pos", function () {
		return "(" + mouseX + ", " + mouseY + ")";
	});
	Tesselate.debug.add("Paused", function () {
		return paused ? "true" : "false";
	});
	Tesselate.debug.add("Zoom", function () {
		return Tesselate.scene.scale;
	});
	// Tesselate.debug.add("Tiles painted", function () {
	// 	// var k = tilemap1.tileSize * Tesselate.scene.scale;
	// 	// var width = Math.floor(Tesselate.scene.viewBox[2] / k) + 1;
	// 	// var height = Math.floor(Tesselate.scene.viewBox[3] / k) + 1;
	// 	// return width * height;
	// });
	Tesselate.debug.add("Framerate (f/s)", function () {
		return fpsString;
	});
	ticker.on("data", function (framerate) {
		fpsString = framerate.toFixed(1);
	});

	function loop() {
		if (!running) return;

		requestAnimationFrame(loop);

		if (mouseIsDown) {
			Tesselate.scene.viewBox[0] -= mouseDragX;
			Tesselate.scene.viewBox[1] -= mouseDragY;
		}

		Tesselate.scene.clear();

		if (paused) {
			// Tesselate.gui.overlay();
		} else {
			Tesselate.scene.draw();
			// Tesselate.gui.draw();
		}

		if (debug) {
			ticker.tick();
			Tesselate.debug.displayAllStrings(Tesselate.scene.renderer);
			var ctx = Tesselate.scene.renderer.context;
			// Viewport center
			ctx.fillStyle = "#0000ff";
			ctx.beginPath();
			var x = Tesselate.scene.viewBox[2] / 2;
			var y = Tesselate.scene.viewBox[3] / 2;
			ctx.arc(x, y, 10, 0, Math.PI * 2, false);
			ctx.fill();
			// Tilemap center
			ctx.fillStyle = "#00ff00";
			ctx.beginPath();
			// x = -Tesselate.scene.viewBox[0] + Tesselate.scene.scale * tilemap1.width * tilemap1.tileWidth / 2;
			// y = -Tesselate.scene.viewBox[1] + Tesselate.scene.scale * tilemap1.height * tilemap1.tileHeight / 2;
			x = -Tesselate.scene.viewBox[0] + Tesselate.scene.viewBox[2] / 2;
			y = -Tesselate.scene.viewBox[1] + Tesselate.scene.viewBox[3] / 2;
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
