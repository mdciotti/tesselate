/* Tile Data Declarations
 * Coordinates the various game subsystems
 */

var Tile = {};

Tile.BlueBlock = {
	id: 1,
	name: "Blue Block",
	precedence: 10,
	solid: true,
	isPipe: true,
	hasAnimation: false,
	randomSetLength: 1,
	edges: 1,
	corners: 2,
	texture: 2,
	sound: {}
};

Tile.WoodPanel = {
	id: 2,
	name: "Wood Panel",
	precedence: 8,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 2,
	edges: 1,
	corners: 0,
	texture: 4,
	sound: {}
};

Tile.Concrete = {
	id: 3,
	name: "Concrete",
	precedence: 6,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 4,
	texture: 6,
	edges: 1,
	corners: 0,
	sound: {}
};

Tile.MetalPlate = {
	id: 4,
	name: "Metal Plate",
	precedence: 0,
	solid: true,
	isPipe: true,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 8,
	edges: 0,
	corners: 0,
	sound: {}
};

Tile.Water = {
	id: 5,
	name: "Water",
	precedence: 0,
	solid: false,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 11,
	edges: 0,
	corners: 0,
	sound: {}
};

Tile.Sapphire = {
	id: 6,
	name: "Sapphire",
	precedence: 100,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 9,
	edges: 1,
	corners: 0,
	sound: {}
};

/* Canvas 2D Renderer Class
 * Provides methods to render the game onto an HTML5 canvas
 */

var Canvas2DRenderer = function () {
	this.canvas = document.createElement("canvas");
	this.canvas.width = 600;
	this.canvas.height = 400;
	document.body.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	this.context.mozImageSmoothingEnabled = false;
};

Canvas2DRenderer.prototype.setSize = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
};

Canvas2DRenderer.prototype.paintTile = function (scene, tileType, column, config, x, y) {
	var world = scene.world;
	var offsetX = scene.viewBox[0] % world.tileSize,
		offsetY = scene.viewBox[1] % world.tileSize;
	var k = world.tileSize * scene.scale,
		sourceX = world.tileSize * config,
		sourceY = world.tileSize * (tileType + column),
		destX = -offsetX * scene.scale + x * k,
		destY = -offsetY * scene.scale + y * k;
	this.context.drawImage(world.terrain, sourceX, sourceY, world.tileSize, world.tileSize, destX, destY, k, k);
};

Canvas2DRenderer.prototype.clear = function (color) {	
	this.context.fillStyle = color || "#000000";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2DRenderer.prototype.draw = function (scene) {
	
	this.clear("#000000");

	var data = scene.getDataInView();

	// Draw terrain
	var tile, column, cornerConfig, seed,
		rows = data.length,
		cols = data[0].length;

	// 1. Draw background(s)
	// 2. Draw wall tiles
	// 3. Draw tiles
	// 4. Draw entities
	// 5. Draw tile transitions
	// 6. Draw effects
	// TODO: for transitions, use tile precedence
	// TODO: lighting
	
	// find transitions
	// transitions = scene.world.findTransitions(data);
	
	// Temporary (will be moved to separate tile classes)
	
	tileData = Tile.WoodPanel;

	for (r = 0; r < rows; r++) {
		for (c = 0; c < cols; c++) {
			tile = data[r][c];

			// Skip if void
			if (tile === 0 || typeof tile === "undefined") continue;

			// Choose correct column
			if (tileData.isPipe) {
				column = scene.world.edgeConfig(c, r);
			} else if (tileData.hasAnimation) {

			} else if (tileData.randomSetLength > 1) {
				// TODO: random tile should be stored in chunk data
				// set random column using tile coordinates as seed
				column = Math.floor(Math.random() * tileData.randomSetLength);
				// solution: randomize once per chunk load and store (with tile transitions)
				// column = scene.lcg.rand(c ^ r | tileData.id) % tileData.randomSetLength;
			} else {
				column = 0;
			}

			// Paint tile
			this.paintTile(scene, tileData.texture, 0, column, c, r);
		}
	}

	var hasEdges = tileData.hasOwnProperty("edges") && tileData.edges > 0;
	var hasCorners = tileData.hasOwnProperty("corners") && tileData.corners > 0;

	if (hasEdges || hasCorners) {
		// Decorations
		for (r = 0; r < rows; r++) {
			for (c = 0; c < cols; c++) {
				tile = data[r][c];
				edgeConfig = scene.world.edgeConfig(c, r);

				if (tile === 0) {
					if (hasEdges) {
						// Paint edges
						this.paintTile(scene, tileData.texture, tileData.edges, edgeConfig, c, r);
					}
					if (hasCorners) {
						// Paint corners
						cornerConfig = scene.world.cornerConfig(c, r);
						this.paintTile(scene, tileData.texture, tileData.corners, cornerConfig, c, r);
					}
				}
			}
		}
	}
};

/* Engine Class
 * Coordinates the various game subsystems
 */

var Engine = function () {
	renderer = new Canvas2DRenderer();
	this.scene = new Scene(renderer);
	this.inputMap = new InputMap();
};

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

/**
 * Main script entry point
 */

window.addEventListener('load', function () {
	console.log('Initializing...');
	var game = new Engine();
	game.scene.world.setTerrain('terrain.png');
	game.scene.world.setDimensions(32, 24);
	game.scene.world.insert(1, 6, [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
		[0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
		[0, 0, 1, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]);
	// game.scene.offset = [5, 5];
	game.scene.scale = 4;
	game.scene.draw();
	console.log(game);
}, false);

/* Scene Class
 * Stores copy of viewable world terrain and caches transitions
 */

var Scene = function (renderer) {
	this.scale = 3;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.viewBox = [0, 0, ];
	this.offset = [0, 0];
	this.data = [];
	this.world = new World();
	this.renderer = renderer;
	this.renderer.setSize(this.viewBox[2], this.viewBox[3]);
	// this.lcg = new LinearCongruentialGenerator();
};

Scene.prototype.draw = function () {
	this.renderer.draw(this);
};

Scene.prototype.getDataInView = function () {
	var k = this.world.tileSize * this.scale;
	var tileX = Math.floor(this.viewBox[0] / this.world.tileSize),
		tileY = Math.floor(this.viewBox[1] / this.world.tileSize);
	var endX = tileX + Math.ceil(this.width / k) + 1,
		endY = tileY + Math.ceil(this.height / k) + 1,
		data = [],
		y, x, yData;

	for (y = tileY; y < endY; y++) {
		yData = [];
		for (x = tileX; x < endX; x++) {
			yData.push(this.world.getTile(x, y));
		}
		data.push(yData);
	}
	return data;
};

/* Utility Functions
 * Helpers and manipulators used throughout the codebase
 */

 var util = {};

var flooredDivision = util.flooredDivision = function (a, n) {
	return a - n * Math.floor(a / n);
}

/* Linear Congruential Generator */
var LCG = util.LCG = function (seed, m) {
	this.m = m ? (m | 0) : 1023;
	this.a = 214013;
	this.c = 2531011;
	seed = seed ? (seed | 0) : ((Math.random() * this.m) | 0);
	this.value = seed;
	this.next();
};

LCG.prototype.rand = function (seed) {
	seed = seed ? seed : this.value;
	return ((seed * this.a + this.c) & this.m);
};

LCG.prototype.next = function () {
	this.value = this.rand(this.value);
	// return this.rand(this.value);
	return this.value;
};

/* XML Http Request Handler */
var XHR = util.XHR = function (url, mime, callback) {
	var req = new XMLHttpRequest;
	if (arguments.length < 3) callback = mime, mime = null;
	else if (mime && req.overrideMimeType) req.overrideMimeType(mime);
	req.open("GET", url, true);
	if (mime) req.setRequestHeader("Accept", mime);
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var s = req.status;
			callback(!s && req.response || s >= 200 && s < 300 || s === 304 ? req : null);
		}
	};
	req.send(null);
};

/* World Class
 * Stores world data and provides an interface to accessing
 * and manipulating the world data
 */

var World = function () {
	this.tileSize = 8;
	this.terrain = new Image();
	this.background = new Image();
	this.data = [];
	this.setDimensions(32, 24);
};

World.prototype.setDimensions = function (width, height) {
	this.width = width;
	this.height = height;
	this.data = new Array(height);

	for (var r = 0; r < height; r++) {
		this.data[r] = new Array(width);
	}
};

World.prototype.setTile = function (x, y, tile) {
	y = util.flooredDivision(y, this.data.length);
	x = util.flooredDivision(x, this.data[0].length);
	this.data[y][x] = tile;
};

World.prototype.insert = function (offsetX, offsetY, data) {
	var rows = data.length,
		cols = data[0].length,
		y, x;

	for (y = 0; y < rows; y++) {
		for (x = 0; x < cols; x++) {
			this.setTile(offsetX + x, offsetY + y, data[y][x]);
		}
	}
};

World.prototype.setTerrain = function (imgURL) {
	this.terrain.src = imgURL;
};

World.prototype.setBackground = function (imgURL) {
	this.background.src = imgURL;
};

World.prototype.iterate = function (callback) {

	var rows = this.data.length,
		cols = this.data[0].length;

	for (y = 0; y < rows; y++) {
		for (x = 0; x < cols; x++) {
			callback.call(this, this.data[y][x], x, y);
		}
	}
};

World.prototype.getTile = function (x, y) {
	y = util.flooredDivision(y, this.data.length);
	x = util.flooredDivision(x, this.data[0].length);
	return this.data[y][x];
};

World.prototype.edgeConfig = function (x, y) {
	return this.getTile(x - 1, y)
		| (this.getTile(x, y - 1) << 1)
		| (this.getTile(x + 1, y) << 2)
		| (this.getTile(x, y + 1) << 3);
};

World.prototype.cornerConfig = function (x, y) {
	var e1 = this.getTile(x - 1, y),
		e2 = this.getTile(x, y - 1),
		e4 = this.getTile(x + 1, y),
		e8 = this.getTile(x, y + 1);

	return (this.getTile(x - 1, y - 1) && !(e1 || e2))
		| ((this.getTile(x + 1, y - 1) && !(e2 || e4)) << 1)
		| ((this.getTile(x + 1, y + 1) && !(e4 || e8)) << 2)
		| ((this.getTile(x - 1, y + 1) && !(e8 || e1)) << 3);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbnZhczJkLmpzIiwiZW5naW5lLmpzIiwiaW5wdXRNYXAuanMiLCJtYWluLmpzIiwic2NlbmUuanMiLCJ1dGlsaXRpZXMuanMiLCJ3b3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDYW52YXMgMkQgUmVuZGVyZXIgQ2xhc3NcbiAqIFByb3ZpZGVzIG1ldGhvZHMgdG8gcmVuZGVyIHRoZSBnYW1lIG9udG8gYW4gSFRNTDUgY2FudmFzXG4gKi9cblxudmFyIFRpbGUgPSByZXF1aXJlKCcuL2RhdGEvdGlsZS9pbmRleC5qcycpO1xuXG52YXIgQ2FudmFzMkRSZW5kZXJlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdHRoaXMuY2FudmFzLndpZHRoID0gNjAwO1xuXHR0aGlzLmNhbnZhcy5oZWlnaHQgPSA0MDA7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdHRoaXMuY29udGV4dC5tb3pJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcbn07XG5cbkNhbnZhczJEUmVuZGVyZXIucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCkge1xuXHR0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXHR0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG59O1xuXG5DYW52YXMyRFJlbmRlcmVyLnByb3RvdHlwZS5wYWludFRpbGUgPSBmdW5jdGlvbiAoc2NlbmUsIHRpbGVUeXBlLCBjb2x1bW4sIGNvbmZpZywgeCwgeSkge1xuXHR2YXIgd29ybGQgPSBzY2VuZS53b3JsZDtcblx0dmFyIG9mZnNldFggPSBzY2VuZS52aWV3Qm94WzBdICUgd29ybGQudGlsZVNpemUsXG5cdFx0b2Zmc2V0WSA9IHNjZW5lLnZpZXdCb3hbMV0gJSB3b3JsZC50aWxlU2l6ZTtcblx0dmFyIGsgPSB3b3JsZC50aWxlU2l6ZSAqIHNjZW5lLnNjYWxlLFxuXHRcdHNvdXJjZVggPSB3b3JsZC50aWxlU2l6ZSAqIGNvbmZpZyxcblx0XHRzb3VyY2VZID0gd29ybGQudGlsZVNpemUgKiAodGlsZVR5cGUgKyBjb2x1bW4pLFxuXHRcdGRlc3RYID0gLW9mZnNldFggKiBzY2VuZS5zY2FsZSArIHggKiBrLFxuXHRcdGRlc3RZID0gLW9mZnNldFkgKiBzY2VuZS5zY2FsZSArIHkgKiBrO1xuXHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHdvcmxkLnRlcnJhaW4sIHNvdXJjZVgsIHNvdXJjZVksIHdvcmxkLnRpbGVTaXplLCB3b3JsZC50aWxlU2l6ZSwgZGVzdFgsIGRlc3RZLCBrLCBrKTtcbn07XG5cbkNhbnZhczJEUmVuZGVyZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKGNvbG9yKSB7XHRcblx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yIHx8IFwiIzAwMDAwMFwiO1xuXHR0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG59O1xuXG5DYW52YXMyRFJlbmRlcmVyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKHNjZW5lKSB7XG5cdFxuXHR0aGlzLmNsZWFyKFwiIzAwMDAwMFwiKTtcblxuXHR2YXIgZGF0YSA9IHNjZW5lLmdldERhdGFJblZpZXcoKTtcblxuXHQvLyBEcmF3IHRlcnJhaW5cblx0dmFyIHRpbGUsIGNvbHVtbiwgY29ybmVyQ29uZmlnLCBzZWVkLFxuXHRcdHJvd3MgPSBkYXRhLmxlbmd0aCxcblx0XHRjb2xzID0gZGF0YVswXS5sZW5ndGg7XG5cblx0Ly8gMS4gRHJhdyBiYWNrZ3JvdW5kKHMpXG5cdC8vIDIuIERyYXcgd2FsbCB0aWxlc1xuXHQvLyAzLiBEcmF3IHRpbGVzXG5cdC8vIDQuIERyYXcgZW50aXRpZXNcblx0Ly8gNS4gRHJhdyB0aWxlIHRyYW5zaXRpb25zXG5cdC8vIDYuIERyYXcgZWZmZWN0c1xuXHQvLyBUT0RPOiBmb3IgdHJhbnNpdGlvbnMsIHVzZSB0aWxlIHByZWNlZGVuY2Vcblx0Ly8gVE9ETzogbGlnaHRpbmdcblx0XG5cdC8vIGZpbmQgdHJhbnNpdGlvbnNcblx0Ly8gdHJhbnNpdGlvbnMgPSBzY2VuZS53b3JsZC5maW5kVHJhbnNpdGlvbnMoZGF0YSk7XG5cdFxuXHQvLyBUZW1wb3JhcnkgKHdpbGwgYmUgbW92ZWQgdG8gc2VwYXJhdGUgdGlsZSBjbGFzc2VzKVxuXHRcblx0dGlsZURhdGEgPSBUaWxlLldvb2RQYW5lbDtcblxuXHRmb3IgKHIgPSAwOyByIDwgcm93czsgcisrKSB7XG5cdFx0Zm9yIChjID0gMDsgYyA8IGNvbHM7IGMrKykge1xuXHRcdFx0dGlsZSA9IGRhdGFbcl1bY107XG5cblx0XHRcdC8vIFNraXAgaWYgdm9pZFxuXHRcdFx0aWYgKHRpbGUgPT09IDAgfHwgdHlwZW9mIHRpbGUgPT09IFwidW5kZWZpbmVkXCIpIGNvbnRpbnVlO1xuXG5cdFx0XHQvLyBDaG9vc2UgY29ycmVjdCBjb2x1bW5cblx0XHRcdGlmICh0aWxlRGF0YS5pc1BpcGUpIHtcblx0XHRcdFx0Y29sdW1uID0gc2NlbmUud29ybGQuZWRnZUNvbmZpZyhjLCByKTtcblx0XHRcdH0gZWxzZSBpZiAodGlsZURhdGEuaGFzQW5pbWF0aW9uKSB7XG5cblx0XHRcdH0gZWxzZSBpZiAodGlsZURhdGEucmFuZG9tU2V0TGVuZ3RoID4gMSkge1xuXHRcdFx0XHQvLyBUT0RPOiByYW5kb20gdGlsZSBzaG91bGQgYmUgc3RvcmVkIGluIGNodW5rIGRhdGFcblx0XHRcdFx0Ly8gc2V0IHJhbmRvbSBjb2x1bW4gdXNpbmcgdGlsZSBjb29yZGluYXRlcyBhcyBzZWVkXG5cdFx0XHRcdGNvbHVtbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRpbGVEYXRhLnJhbmRvbVNldExlbmd0aCk7XG5cdFx0XHRcdC8vIHNvbHV0aW9uOiByYW5kb21pemUgb25jZSBwZXIgY2h1bmsgbG9hZCBhbmQgc3RvcmUgKHdpdGggdGlsZSB0cmFuc2l0aW9ucylcblx0XHRcdFx0Ly8gY29sdW1uID0gc2NlbmUubGNnLnJhbmQoYyBeIHIgfCB0aWxlRGF0YS5pZCkgJSB0aWxlRGF0YS5yYW5kb21TZXRMZW5ndGg7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb2x1bW4gPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQYWludCB0aWxlXG5cdFx0XHR0aGlzLnBhaW50VGlsZShzY2VuZSwgdGlsZURhdGEudGV4dHVyZSwgMCwgY29sdW1uLCBjLCByKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgaGFzRWRnZXMgPSB0aWxlRGF0YS5oYXNPd25Qcm9wZXJ0eShcImVkZ2VzXCIpICYmIHRpbGVEYXRhLmVkZ2VzID4gMDtcblx0dmFyIGhhc0Nvcm5lcnMgPSB0aWxlRGF0YS5oYXNPd25Qcm9wZXJ0eShcImNvcm5lcnNcIikgJiYgdGlsZURhdGEuY29ybmVycyA+IDA7XG5cblx0aWYgKGhhc0VkZ2VzIHx8IGhhc0Nvcm5lcnMpIHtcblx0XHQvLyBEZWNvcmF0aW9uc1xuXHRcdGZvciAociA9IDA7IHIgPCByb3dzOyByKyspIHtcblx0XHRcdGZvciAoYyA9IDA7IGMgPCBjb2xzOyBjKyspIHtcblx0XHRcdFx0dGlsZSA9IGRhdGFbcl1bY107XG5cdFx0XHRcdGVkZ2VDb25maWcgPSBzY2VuZS53b3JsZC5lZGdlQ29uZmlnKGMsIHIpO1xuXG5cdFx0XHRcdGlmICh0aWxlID09PSAwKSB7XG5cdFx0XHRcdFx0aWYgKGhhc0VkZ2VzKSB7XG5cdFx0XHRcdFx0XHQvLyBQYWludCBlZGdlc1xuXHRcdFx0XHRcdFx0dGhpcy5wYWludFRpbGUoc2NlbmUsIHRpbGVEYXRhLnRleHR1cmUsIHRpbGVEYXRhLmVkZ2VzLCBlZGdlQ29uZmlnLCBjLCByKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0Nvcm5lcnMpIHtcblx0XHRcdFx0XHRcdC8vIFBhaW50IGNvcm5lcnNcblx0XHRcdFx0XHRcdGNvcm5lckNvbmZpZyA9IHNjZW5lLndvcmxkLmNvcm5lckNvbmZpZyhjLCByKTtcblx0XHRcdFx0XHRcdHRoaXMucGFpbnRUaWxlKHNjZW5lLCB0aWxlRGF0YS50ZXh0dXJlLCB0aWxlRGF0YS5jb3JuZXJzLCBjb3JuZXJDb25maWcsIGMsIHIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcbiIsIi8qIEVuZ2luZSBDbGFzc1xuICogQ29vcmRpbmF0ZXMgdGhlIHZhcmlvdXMgZ2FtZSBzdWJzeXN0ZW1zXG4gKi9cblxudmFyIENhbnZhczJEUmVuZGVyZXIgPSByZXF1aXJlKCcuL2NhbnZhczJkLmpzJyksXG5cdFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZS5qcycpLFxuXHRJbnB1dE1hcCA9IHJlcXVpcmUoJy4vaW5wdXRNYXAuanMnKTtcblxudmFyIEVuZ2luZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHRyZW5kZXJlciA9IG5ldyBDYW52YXMyRFJlbmRlcmVyKCk7XG5cdHRoaXMuc2NlbmUgPSBuZXcgU2NlbmUocmVuZGVyZXIpO1xuXHR0aGlzLmlucHV0TWFwID0gbmV3IElucHV0TWFwKCk7XG59O1xuIiwiLyogSW5wdXQgTWFwIENsYXNzXG4gKiBNYXBzIGFuIGlucHV0IHN5c3RlbSB0byBnYW1lIGFjdGlvbnNcbiAqL1xuXG52YXIgSW5wdXRNYXAgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5rZXlNYXAgPSB7fTtcblx0dGhpcy5vbk1vdXNlTW92ZSA9IG51bGw7XG5cdHRoaXMuYWN0aW9uID0ge307XG5cdHRoaXMuc3RhdGUgPSB7fTtcblx0dGhpcy5yYW5nZSA9IHt9O1xufTtcblxuSW5wdXRNYXAucHJvdG90eXBlLmF0dGFjaE1vdXNlTGlzdGVuZXIgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0Ly8gYm9keS4uLlxufTtcbiIsIi8qKlxuICogTWFpbiBzY3JpcHQgZW50cnkgcG9pbnRcbiAqL1xuXG52YXIgRW5naW5lID0gcmVxdWlyZSgnLi9lbmdpbmUuanMnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG5cdGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcuLi4nKTtcblx0dmFyIGdhbWUgPSBuZXcgRW5naW5lKCk7XG5cdGdhbWUuc2NlbmUud29ybGQuc2V0VGVycmFpbigndGVycmFpbi5wbmcnKTtcblx0Z2FtZS5zY2VuZS53b3JsZC5zZXREaW1lbnNpb25zKDMyLCAyNCk7XG5cdGdhbWUuc2NlbmUud29ybGQuaW5zZXJ0KDEsIDYsIFtcblx0XHRbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG5cdFx0WzAsIDEsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDBdLFxuXHRcdFswLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAxLCAwXSxcblx0XHRbMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSwgMCwgMF0sXG5cdFx0WzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuXHRcdFswLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwXSxcblx0XHRbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cblx0XSk7XG5cdC8vIGdhbWUuc2NlbmUub2Zmc2V0ID0gWzUsIDVdO1xuXHRnYW1lLnNjZW5lLnNjYWxlID0gNDtcblx0Z2FtZS5zY2VuZS5kcmF3KCk7XG5cdGNvbnNvbGUubG9nKGdhbWUpO1xufSwgZmFsc2UpO1xuIiwiLyogU2NlbmUgQ2xhc3NcbiAqIFN0b3JlcyBjb3B5IG9mIHZpZXdhYmxlIHdvcmxkIHRlcnJhaW4gYW5kIGNhY2hlcyB0cmFuc2l0aW9uc1xuICovXG5cbnZhciBXb3JsZCA9IHJlcXVpcmUoJy4vd29ybGQuanMnKTtcblxudmFyIFNjZW5lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocmVuZGVyZXIpIHtcblx0dGhpcy5zY2FsZSA9IDM7XG5cdHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0dGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdHRoaXMudmlld0JveCA9IFswLCAwLCBdO1xuXHR0aGlzLm9mZnNldCA9IFswLCAwXTtcblx0dGhpcy5kYXRhID0gW107XG5cdHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcblx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXHR0aGlzLnJlbmRlcmVyLnNldFNpemUodGhpcy52aWV3Qm94WzJdLCB0aGlzLnZpZXdCb3hbM10pO1xuXHQvLyB0aGlzLmxjZyA9IG5ldyBMaW5lYXJDb25ncnVlbnRpYWxHZW5lcmF0b3IoKTtcbn07XG5cblNjZW5lLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLnJlbmRlcmVyLmRyYXcodGhpcyk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUuZ2V0RGF0YUluVmlldyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGsgPSB0aGlzLndvcmxkLnRpbGVTaXplICogdGhpcy5zY2FsZTtcblx0dmFyIHRpbGVYID0gTWF0aC5mbG9vcih0aGlzLnZpZXdCb3hbMF0gLyB0aGlzLndvcmxkLnRpbGVTaXplKSxcblx0XHR0aWxlWSA9IE1hdGguZmxvb3IodGhpcy52aWV3Qm94WzFdIC8gdGhpcy53b3JsZC50aWxlU2l6ZSk7XG5cdHZhciBlbmRYID0gdGlsZVggKyBNYXRoLmNlaWwodGhpcy53aWR0aCAvIGspICsgMSxcblx0XHRlbmRZID0gdGlsZVkgKyBNYXRoLmNlaWwodGhpcy5oZWlnaHQgLyBrKSArIDEsXG5cdFx0ZGF0YSA9IFtdLFxuXHRcdHksIHgsIHlEYXRhO1xuXG5cdGZvciAoeSA9IHRpbGVZOyB5IDwgZW5kWTsgeSsrKSB7XG5cdFx0eURhdGEgPSBbXTtcblx0XHRmb3IgKHggPSB0aWxlWDsgeCA8IGVuZFg7IHgrKykge1xuXHRcdFx0eURhdGEucHVzaCh0aGlzLndvcmxkLmdldFRpbGUoeCwgeSkpO1xuXHRcdH1cblx0XHRkYXRhLnB1c2goeURhdGEpO1xuXHR9XG5cdHJldHVybiBkYXRhO1xufTtcbiIsIi8qIFV0aWxpdHkgRnVuY3Rpb25zXG4gKiBIZWxwZXJzIGFuZCBtYW5pcHVsYXRvcnMgdXNlZCB0aHJvdWdob3V0IHRoZSBjb2RlYmFzZVxuICovXG5cbnZhciBmbG9vcmVkRGl2aXNpb24gPSBtb2R1bGUuZXhwb3J0cy5mbG9vcmVkRGl2aXNpb24gPSBmdW5jdGlvbiAoYSwgbikge1xuXHRyZXR1cm4gYSAtIG4gKiBNYXRoLmZsb29yKGEgLyBuKTtcbn1cblxuLyogTGluZWFyIENvbmdydWVudGlhbCBHZW5lcmF0b3IgKi9cbnZhciBMQ0cgPSBtb2R1bGUuZXhwb3J0cy5MQ0cgPSBmdW5jdGlvbiAoc2VlZCwgbSkge1xuXHR0aGlzLm0gPSBtID8gKG0gfCAwKSA6IDEwMjM7XG5cdHRoaXMuYSA9IDIxNDAxMztcblx0dGhpcy5jID0gMjUzMTAxMTtcblx0c2VlZCA9IHNlZWQgPyAoc2VlZCB8IDApIDogKChNYXRoLnJhbmRvbSgpICogdGhpcy5tKSB8IDApO1xuXHR0aGlzLnZhbHVlID0gc2VlZDtcblx0dGhpcy5uZXh0KCk7XG59O1xuXG5MQ0cucHJvdG90eXBlLnJhbmQgPSBmdW5jdGlvbiAoc2VlZCkge1xuXHRzZWVkID0gc2VlZCA/IHNlZWQgOiB0aGlzLnZhbHVlO1xuXHRyZXR1cm4gKChzZWVkICogdGhpcy5hICsgdGhpcy5jKSAmIHRoaXMubSk7XG59O1xuXG5MQ0cucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMudmFsdWUgPSB0aGlzLnJhbmQodGhpcy52YWx1ZSk7XG5cdC8vIHJldHVybiB0aGlzLnJhbmQodGhpcy52YWx1ZSk7XG5cdHJldHVybiB0aGlzLnZhbHVlO1xufTtcblxuLyogWE1MIEh0dHAgUmVxdWVzdCBIYW5kbGVyICovXG52YXIgWEhSID0gbW9kdWxlLmV4cG9ydHMuWEhSID0gZnVuY3Rpb24gKHVybCwgbWltZSwgY2FsbGJhY2spIHtcblx0dmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBjYWxsYmFjayA9IG1pbWUsIG1pbWUgPSBudWxsO1xuXHRlbHNlIGlmIChtaW1lICYmIHJlcS5vdmVycmlkZU1pbWVUeXBlKSByZXEub3ZlcnJpZGVNaW1lVHlwZShtaW1lKTtcblx0cmVxLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcblx0aWYgKG1pbWUpIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIG1pbWUpO1xuXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHR2YXIgcyA9IHJlcS5zdGF0dXM7XG5cdFx0XHRjYWxsYmFjayghcyAmJiByZXEucmVzcG9uc2UgfHwgcyA+PSAyMDAgJiYgcyA8IDMwMCB8fCBzID09PSAzMDQgPyByZXEgOiBudWxsKTtcblx0XHR9XG5cdH07XG5cdHJlcS5zZW5kKG51bGwpO1xufTtcbiIsIi8qIFdvcmxkIENsYXNzXG4gKiBTdG9yZXMgd29ybGQgZGF0YSBhbmQgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIHRvIGFjY2Vzc2luZ1xuICogYW5kIG1hbmlwdWxhdGluZyB0aGUgd29ybGQgZGF0YVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKTtcblxudmFyIFdvcmxkID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMudGlsZVNpemUgPSA4O1xuXHR0aGlzLnRlcnJhaW4gPSBuZXcgSW1hZ2UoKTtcblx0dGhpcy5iYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XG5cdHRoaXMuZGF0YSA9IFtdO1xuXHR0aGlzLnNldERpbWVuc2lvbnMoMzIsIDI0KTtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5zZXREaW1lbnNpb25zID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0dGhpcy5kYXRhID0gbmV3IEFycmF5KGhlaWdodCk7XG5cblx0Zm9yICh2YXIgciA9IDA7IHIgPCBoZWlnaHQ7IHIrKykge1xuXHRcdHRoaXMuZGF0YVtyXSA9IG5ldyBBcnJheSh3aWR0aCk7XG5cdH1cbn07XG5cbldvcmxkLnByb3RvdHlwZS5zZXRUaWxlID0gZnVuY3Rpb24gKHgsIHksIHRpbGUpIHtcblx0eSA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHksIHRoaXMuZGF0YS5sZW5ndGgpO1xuXHR4ID0gdXRpbC5mbG9vcmVkRGl2aXNpb24oeCwgdGhpcy5kYXRhWzBdLmxlbmd0aCk7XG5cdHRoaXMuZGF0YVt5XVt4XSA9IHRpbGU7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKG9mZnNldFgsIG9mZnNldFksIGRhdGEpIHtcblx0dmFyIHJvd3MgPSBkYXRhLmxlbmd0aCxcblx0XHRjb2xzID0gZGF0YVswXS5sZW5ndGgsXG5cdFx0eSwgeDtcblxuXHRmb3IgKHkgPSAwOyB5IDwgcm93czsgeSsrKSB7XG5cdFx0Zm9yICh4ID0gMDsgeCA8IGNvbHM7IHgrKykge1xuXHRcdFx0dGhpcy5zZXRUaWxlKG9mZnNldFggKyB4LCBvZmZzZXRZICsgeSwgZGF0YVt5XVt4XSk7XG5cdFx0fVxuXHR9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0VGVycmFpbiA9IGZ1bmN0aW9uIChpbWdVUkwpIHtcblx0dGhpcy50ZXJyYWluLnNyYyA9IGltZ1VSTDtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5zZXRCYWNrZ3JvdW5kID0gZnVuY3Rpb24gKGltZ1VSTCkge1xuXHR0aGlzLmJhY2tncm91bmQuc3JjID0gaW1nVVJMO1xufTtcblxuV29ybGQucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHR2YXIgcm93cyA9IHRoaXMuZGF0YS5sZW5ndGgsXG5cdFx0Y29scyA9IHRoaXMuZGF0YVswXS5sZW5ndGg7XG5cblx0Zm9yICh5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xuXHRcdGZvciAoeCA9IDA7IHggPCBjb2xzOyB4KyspIHtcblx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgdGhpcy5kYXRhW3ldW3hdLCB4LCB5KTtcblx0XHR9XG5cdH1cbn07XG5cbldvcmxkLnByb3RvdHlwZS5nZXRUaWxlID0gZnVuY3Rpb24gKHgsIHkpIHtcblx0eSA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHksIHRoaXMuZGF0YS5sZW5ndGgpO1xuXHR4ID0gdXRpbC5mbG9vcmVkRGl2aXNpb24oeCwgdGhpcy5kYXRhWzBdLmxlbmd0aCk7XG5cdHJldHVybiB0aGlzLmRhdGFbeV1beF07XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuZWRnZUNvbmZpZyA9IGZ1bmN0aW9uICh4LCB5KSB7XG5cdHJldHVybiB0aGlzLmdldFRpbGUoeCAtIDEsIHkpXG5cdFx0fCAodGhpcy5nZXRUaWxlKHgsIHkgLSAxKSA8PCAxKVxuXHRcdHwgKHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSkgPDwgMilcblx0XHR8ICh0aGlzLmdldFRpbGUoeCwgeSArIDEpIDw8IDMpO1xufTtcblxuV29ybGQucHJvdG90eXBlLmNvcm5lckNvbmZpZyA9IGZ1bmN0aW9uICh4LCB5KSB7XG5cdHZhciBlMSA9IHRoaXMuZ2V0VGlsZSh4IC0gMSwgeSksXG5cdFx0ZTIgPSB0aGlzLmdldFRpbGUoeCwgeSAtIDEpLFxuXHRcdGU0ID0gdGhpcy5nZXRUaWxlKHggKyAxLCB5KSxcblx0XHRlOCA9IHRoaXMuZ2V0VGlsZSh4LCB5ICsgMSk7XG5cblx0cmV0dXJuICh0aGlzLmdldFRpbGUoeCAtIDEsIHkgLSAxKSAmJiAhKGUxIHx8IGUyKSlcblx0XHR8ICgodGhpcy5nZXRUaWxlKHggKyAxLCB5IC0gMSkgJiYgIShlMiB8fCBlNCkpIDw8IDEpXG5cdFx0fCAoKHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSArIDEpICYmICEoZTQgfHwgZTgpKSA8PCAyKVxuXHRcdHwgKCh0aGlzLmdldFRpbGUoeCAtIDEsIHkgKyAxKSAmJiAhKGU4IHx8IGUxKSkgPDwgMyk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
