/**
 * Main script entry point
 */

var Tesseract = require('./tesseract.js');
	
Tesseract.setup(function () {
	console.log('Initializing...');

	var world1 = new Tesseract.World({
		name: "Test World",
		width: 32,
		height: 20
	});

	var tileset = new Tesseract.TileSet({ tileSize: 8 });
	tileset.load('/sprites/terrain.png');

	var tileLayer = new Tesseract.Layer({
		height: 7,
		width: 10,
		name: "Test Layer"
	});

	tileLayer.inject(0, 0, [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
		[0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
		[0, 0, 1, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]);

	// world1.add(tileSet);
	world1.add(tileLayer);

	Tesseract.scene.setWorld(world1);
	Tesseract.scene.setScale(4);
	Tesseract.scene.draw();

});
