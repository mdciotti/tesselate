(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Main script entry point
 */

var Engine = require('./engine.js');

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

},{"./engine.js":4}],2:[function(require,module,exports){
/* Canvas 2D Renderer Class
 * Provides methods to render the game onto an HTML5 canvas
 */

var Tile = require('./data/tile/index.js');

var Canvas2DRenderer = module.exports = function () {
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
	console.log('drawing');
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

},{"./data/tile/index.js":3}],3:[function(require,module,exports){
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

module.exports = Tile;

},{}],4:[function(require,module,exports){
/* Engine Class
 * Coordinates the various game subsystems
 */

var Canvas2DRenderer = require('./canvas2d.js'),
	Scene = require('./scene.js'),
	InputMap = require('./inputMap.js');

var Engine = module.exports = function () {
	renderer = new Canvas2DRenderer();
	this.scene = new Scene(renderer);
	this.inputMap = new InputMap();
};

},{"./canvas2d.js":2,"./inputMap.js":5,"./scene.js":6}],5:[function(require,module,exports){
/* Input Map Class
 * Maps an input system to game actions
 */

var InputMap = module.exports = function () {
	this.keyMap = {};
	this.onMouseMove = null;
	this.action = {};
	this.state = {};
	this.range = {};
};

InputMap.prototype.attachMouseListener = function (callback) {
	// body...
};

},{}],6:[function(require,module,exports){
/* Scene Class
 * Stores copy of viewable world terrain and caches transitions
 */

var World = require('./world.js');

var Scene = module.exports = function (renderer) {
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

},{"./world.js":8}],7:[function(require,module,exports){
/* Utility Functions
 * Helpers and manipulators used throughout the codebase
 */

var flooredDivision = module.exports.flooredDivision = function (a, n) {
	return a - n * Math.floor(a / n);
}

/* Linear Congruential Generator */
var LCG = module.exports.LCG = function (seed, m) {
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
var XHR = module.exports.XHR = function (url, mime, callback) {
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

},{}],8:[function(require,module,exports){
/* World Class
 * Stores world data and provides an interface to accessing
 * and manipulating the world data
 */

var util = require('./utilities.js');

var World = module.exports = function () {
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

},{"./utilities.js":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXgvZGV2L3dlYi90eWxlci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi9tYWluLmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL2NhbnZhczJkLmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL2RhdGEvdGlsZS9pbmRleC5qcyIsIi9Vc2Vycy9tYXgvZGV2L3dlYi90eWxlci9lbmdpbmUuanMiLCIvVXNlcnMvbWF4L2Rldi93ZWIvdHlsZXIvaW5wdXRNYXAuanMiLCIvVXNlcnMvbWF4L2Rldi93ZWIvdHlsZXIvc2NlbmUuanMiLCIvVXNlcnMvbWF4L2Rldi93ZWIvdHlsZXIvdXRpbGl0aWVzLmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIE1haW4gc2NyaXB0IGVudHJ5IHBvaW50XG4gKi9cblxudmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vZW5naW5lLmpzJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuXHRjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nLi4uJyk7XG5cdHZhciBnYW1lID0gbmV3IEVuZ2luZSgpO1xuXHRnYW1lLnNjZW5lLndvcmxkLnNldFRlcnJhaW4oJ3RlcnJhaW4ucG5nJyk7XG5cdGdhbWUuc2NlbmUud29ybGQuc2V0RGltZW5zaW9ucygzMiwgMjQpO1xuXHRnYW1lLnNjZW5lLndvcmxkLmluc2VydCgxLCA2LCBbXG5cdFx0WzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuXHRcdFswLCAxLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwXSxcblx0XHRbMCwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMF0sXG5cdFx0WzAsIDAsIDEsIDAsIDEsIDEsIDEsIDEsIDAsIDBdLFxuXHRcdFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcblx0XHRbMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMF0sXG5cdFx0WzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXG5cdF0pO1xuXHQvLyBnYW1lLnNjZW5lLm9mZnNldCA9IFs1LCA1XTtcblx0Z2FtZS5zY2VuZS5zY2FsZSA9IDQ7XG5cdGdhbWUuc2NlbmUuZHJhdygpO1xuXHRjb25zb2xlLmxvZyhnYW1lKTtcbn0sIGZhbHNlKTtcbiIsIi8qIENhbnZhcyAyRCBSZW5kZXJlciBDbGFzc1xuICogUHJvdmlkZXMgbWV0aG9kcyB0byByZW5kZXIgdGhlIGdhbWUgb250byBhbiBIVE1MNSBjYW52YXNcbiAqL1xuXG52YXIgVGlsZSA9IHJlcXVpcmUoJy4vZGF0YS90aWxlL2luZGV4LmpzJyk7XG5cbnZhciBDYW52YXMyRFJlbmRlcmVyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0dGhpcy5jYW52YXMud2lkdGggPSA2MDA7XG5cdHRoaXMuY2FudmFzLmhlaWdodCA9IDQwMDtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0dGhpcy5jb250ZXh0Lm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xufTtcblxuQ2FudmFzMkRSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG5cdHRoaXMuY2FudmFzLndpZHRoID0gd2lkdGg7XG5cdHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbn07XG5cbkNhbnZhczJEUmVuZGVyZXIucHJvdG90eXBlLnBhaW50VGlsZSA9IGZ1bmN0aW9uIChzY2VuZSwgdGlsZVR5cGUsIGNvbHVtbiwgY29uZmlnLCB4LCB5KSB7XG5cdHZhciB3b3JsZCA9IHNjZW5lLndvcmxkO1xuXHR2YXIgb2Zmc2V0WCA9IHNjZW5lLnZpZXdCb3hbMF0gJSB3b3JsZC50aWxlU2l6ZSxcblx0XHRvZmZzZXRZID0gc2NlbmUudmlld0JveFsxXSAlIHdvcmxkLnRpbGVTaXplO1xuXHR2YXIgayA9IHdvcmxkLnRpbGVTaXplICogc2NlbmUuc2NhbGUsXG5cdFx0c291cmNlWCA9IHdvcmxkLnRpbGVTaXplICogY29uZmlnLFxuXHRcdHNvdXJjZVkgPSB3b3JsZC50aWxlU2l6ZSAqICh0aWxlVHlwZSArIGNvbHVtbiksXG5cdFx0ZGVzdFggPSAtb2Zmc2V0WCAqIHNjZW5lLnNjYWxlICsgeCAqIGssXG5cdFx0ZGVzdFkgPSAtb2Zmc2V0WSAqIHNjZW5lLnNjYWxlICsgeSAqIGs7XG5cdHRoaXMuY29udGV4dC5kcmF3SW1hZ2Uod29ybGQudGVycmFpbiwgc291cmNlWCwgc291cmNlWSwgd29ybGQudGlsZVNpemUsIHdvcmxkLnRpbGVTaXplLCBkZXN0WCwgZGVzdFksIGssIGspO1xufTtcblxuQ2FudmFzMkRSZW5kZXJlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoY29sb3IpIHtcdFxuXHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gY29sb3IgfHwgXCIjMDAwMDAwXCI7XG5cdHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbn07XG5cbkNhbnZhczJEUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoc2NlbmUpIHtcblx0Y29uc29sZS5sb2coJ2RyYXdpbmcnKTtcblx0dGhpcy5jbGVhcihcIiMwMDAwMDBcIik7XG5cblx0dmFyIGRhdGEgPSBzY2VuZS5nZXREYXRhSW5WaWV3KCk7XG5cblx0Ly8gRHJhdyB0ZXJyYWluXG5cdHZhciB0aWxlLCBjb2x1bW4sIGNvcm5lckNvbmZpZywgc2VlZCxcblx0XHRyb3dzID0gZGF0YS5sZW5ndGgsXG5cdFx0Y29scyA9IGRhdGFbMF0ubGVuZ3RoO1xuXG5cdC8vIDEuIERyYXcgYmFja2dyb3VuZChzKVxuXHQvLyAyLiBEcmF3IHdhbGwgdGlsZXNcblx0Ly8gMy4gRHJhdyB0aWxlc1xuXHQvLyA0LiBEcmF3IGVudGl0aWVzXG5cdC8vIDUuIERyYXcgdGlsZSB0cmFuc2l0aW9uc1xuXHQvLyA2LiBEcmF3IGVmZmVjdHNcblx0Ly8gVE9ETzogZm9yIHRyYW5zaXRpb25zLCB1c2UgdGlsZSBwcmVjZWRlbmNlXG5cdC8vIFRPRE86IGxpZ2h0aW5nXG5cdFxuXHQvLyBmaW5kIHRyYW5zaXRpb25zXG5cdC8vIHRyYW5zaXRpb25zID0gc2NlbmUud29ybGQuZmluZFRyYW5zaXRpb25zKGRhdGEpO1xuXHRcblx0Ly8gVGVtcG9yYXJ5ICh3aWxsIGJlIG1vdmVkIHRvIHNlcGFyYXRlIHRpbGUgY2xhc3Nlcylcblx0XG5cdHRpbGVEYXRhID0gVGlsZS5Xb29kUGFuZWw7XG5cblx0Zm9yIChyID0gMDsgciA8IHJvd3M7IHIrKykge1xuXHRcdGZvciAoYyA9IDA7IGMgPCBjb2xzOyBjKyspIHtcblx0XHRcdHRpbGUgPSBkYXRhW3JdW2NdO1xuXG5cdFx0XHQvLyBTa2lwIGlmIHZvaWRcblx0XHRcdGlmICh0aWxlID09PSAwIHx8IHR5cGVvZiB0aWxlID09PSBcInVuZGVmaW5lZFwiKSBjb250aW51ZTtcblxuXHRcdFx0Ly8gQ2hvb3NlIGNvcnJlY3QgY29sdW1uXG5cdFx0XHRpZiAodGlsZURhdGEuaXNQaXBlKSB7XG5cdFx0XHRcdGNvbHVtbiA9IHNjZW5lLndvcmxkLmVkZ2VDb25maWcoYywgcik7XG5cdFx0XHR9IGVsc2UgaWYgKHRpbGVEYXRhLmhhc0FuaW1hdGlvbikge1xuXG5cdFx0XHR9IGVsc2UgaWYgKHRpbGVEYXRhLnJhbmRvbVNldExlbmd0aCA+IDEpIHtcblx0XHRcdFx0Ly8gVE9ETzogcmFuZG9tIHRpbGUgc2hvdWxkIGJlIHN0b3JlZCBpbiBjaHVuayBkYXRhXG5cdFx0XHRcdC8vIHNldCByYW5kb20gY29sdW1uIHVzaW5nIHRpbGUgY29vcmRpbmF0ZXMgYXMgc2VlZFxuXHRcdFx0XHRjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aWxlRGF0YS5yYW5kb21TZXRMZW5ndGgpO1xuXHRcdFx0XHQvLyBzb2x1dGlvbjogcmFuZG9taXplIG9uY2UgcGVyIGNodW5rIGxvYWQgYW5kIHN0b3JlICh3aXRoIHRpbGUgdHJhbnNpdGlvbnMpXG5cdFx0XHRcdC8vIGNvbHVtbiA9IHNjZW5lLmxjZy5yYW5kKGMgXiByIHwgdGlsZURhdGEuaWQpICUgdGlsZURhdGEucmFuZG9tU2V0TGVuZ3RoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29sdW1uID0gMDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUGFpbnQgdGlsZVxuXHRcdFx0dGhpcy5wYWludFRpbGUoc2NlbmUsIHRpbGVEYXRhLnRleHR1cmUsIDAsIGNvbHVtbiwgYywgcik7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGhhc0VkZ2VzID0gdGlsZURhdGEuaGFzT3duUHJvcGVydHkoXCJlZGdlc1wiKSAmJiB0aWxlRGF0YS5lZGdlcyA+IDA7XG5cdHZhciBoYXNDb3JuZXJzID0gdGlsZURhdGEuaGFzT3duUHJvcGVydHkoXCJjb3JuZXJzXCIpICYmIHRpbGVEYXRhLmNvcm5lcnMgPiAwO1xuXG5cdGlmIChoYXNFZGdlcyB8fCBoYXNDb3JuZXJzKSB7XG5cdFx0Ly8gRGVjb3JhdGlvbnNcblx0XHRmb3IgKHIgPSAwOyByIDwgcm93czsgcisrKSB7XG5cdFx0XHRmb3IgKGMgPSAwOyBjIDwgY29sczsgYysrKSB7XG5cdFx0XHRcdHRpbGUgPSBkYXRhW3JdW2NdO1xuXHRcdFx0XHRlZGdlQ29uZmlnID0gc2NlbmUud29ybGQuZWRnZUNvbmZpZyhjLCByKTtcblxuXHRcdFx0XHRpZiAodGlsZSA9PT0gMCkge1xuXHRcdFx0XHRcdGlmIChoYXNFZGdlcykge1xuXHRcdFx0XHRcdFx0Ly8gUGFpbnQgZWRnZXNcblx0XHRcdFx0XHRcdHRoaXMucGFpbnRUaWxlKHNjZW5lLCB0aWxlRGF0YS50ZXh0dXJlLCB0aWxlRGF0YS5lZGdlcywgZWRnZUNvbmZpZywgYywgcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChoYXNDb3JuZXJzKSB7XG5cdFx0XHRcdFx0XHQvLyBQYWludCBjb3JuZXJzXG5cdFx0XHRcdFx0XHRjb3JuZXJDb25maWcgPSBzY2VuZS53b3JsZC5jb3JuZXJDb25maWcoYywgcik7XG5cdFx0XHRcdFx0XHR0aGlzLnBhaW50VGlsZShzY2VuZSwgdGlsZURhdGEudGV4dHVyZSwgdGlsZURhdGEuY29ybmVycywgY29ybmVyQ29uZmlnLCBjLCByKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG4iLCIvKiBUaWxlIERhdGEgRGVjbGFyYXRpb25zXG4gKiBDb29yZGluYXRlcyB0aGUgdmFyaW91cyBnYW1lIHN1YnN5c3RlbXNcbiAqL1xuXG52YXIgVGlsZSA9IHt9O1xuXG5UaWxlLkJsdWVCbG9jayA9IHtcblx0aWQ6IDEsXG5cdG5hbWU6IFwiQmx1ZSBCbG9ja1wiLFxuXHRwcmVjZWRlbmNlOiAxMCxcblx0c29saWQ6IHRydWUsXG5cdGlzUGlwZTogdHJ1ZSxcblx0aGFzQW5pbWF0aW9uOiBmYWxzZSxcblx0cmFuZG9tU2V0TGVuZ3RoOiAxLFxuXHRlZGdlczogMSxcblx0Y29ybmVyczogMixcblx0dGV4dHVyZTogMixcblx0c291bmQ6IHt9XG59O1xuXG5UaWxlLldvb2RQYW5lbCA9IHtcblx0aWQ6IDIsXG5cdG5hbWU6IFwiV29vZCBQYW5lbFwiLFxuXHRwcmVjZWRlbmNlOiA4LFxuXHRzb2xpZDogdHJ1ZSxcblx0aXNQaXBlOiBmYWxzZSxcblx0aGFzQW5pbWF0aW9uOiBmYWxzZSxcblx0cmFuZG9tU2V0TGVuZ3RoOiAyLFxuXHRlZGdlczogMSxcblx0Y29ybmVyczogMCxcblx0dGV4dHVyZTogNCxcblx0c291bmQ6IHt9XG59O1xuXG5UaWxlLkNvbmNyZXRlID0ge1xuXHRpZDogMyxcblx0bmFtZTogXCJDb25jcmV0ZVwiLFxuXHRwcmVjZWRlbmNlOiA2LFxuXHRzb2xpZDogdHJ1ZSxcblx0aXNQaXBlOiBmYWxzZSxcblx0aGFzQW5pbWF0aW9uOiBmYWxzZSxcblx0cmFuZG9tU2V0TGVuZ3RoOiA0LFxuXHR0ZXh0dXJlOiA2LFxuXHRlZGdlczogMSxcblx0Y29ybmVyczogMCxcblx0c291bmQ6IHt9XG59O1xuXG5UaWxlLk1ldGFsUGxhdGUgPSB7XG5cdGlkOiA0LFxuXHRuYW1lOiBcIk1ldGFsIFBsYXRlXCIsXG5cdHByZWNlZGVuY2U6IDAsXG5cdHNvbGlkOiB0cnVlLFxuXHRpc1BpcGU6IHRydWUsXG5cdGhhc0FuaW1hdGlvbjogZmFsc2UsXG5cdHJhbmRvbVNldExlbmd0aDogMSxcblx0dGV4dHVyZTogOCxcblx0ZWRnZXM6IDAsXG5cdGNvcm5lcnM6IDAsXG5cdHNvdW5kOiB7fVxufTtcblxuVGlsZS5XYXRlciA9IHtcblx0aWQ6IDUsXG5cdG5hbWU6IFwiV2F0ZXJcIixcblx0cHJlY2VkZW5jZTogMCxcblx0c29saWQ6IGZhbHNlLFxuXHRpc1BpcGU6IGZhbHNlLFxuXHRoYXNBbmltYXRpb246IGZhbHNlLFxuXHRyYW5kb21TZXRMZW5ndGg6IDEsXG5cdHRleHR1cmU6IDExLFxuXHRlZGdlczogMCxcblx0Y29ybmVyczogMCxcblx0c291bmQ6IHt9XG59O1xuXG5UaWxlLlNhcHBoaXJlID0ge1xuXHRpZDogNixcblx0bmFtZTogXCJTYXBwaGlyZVwiLFxuXHRwcmVjZWRlbmNlOiAxMDAsXG5cdHNvbGlkOiB0cnVlLFxuXHRpc1BpcGU6IGZhbHNlLFxuXHRoYXNBbmltYXRpb246IGZhbHNlLFxuXHRyYW5kb21TZXRMZW5ndGg6IDEsXG5cdHRleHR1cmU6IDksXG5cdGVkZ2VzOiAxLFxuXHRjb3JuZXJzOiAwLFxuXHRzb3VuZDoge31cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGlsZTtcbiIsIi8qIEVuZ2luZSBDbGFzc1xuICogQ29vcmRpbmF0ZXMgdGhlIHZhcmlvdXMgZ2FtZSBzdWJzeXN0ZW1zXG4gKi9cblxudmFyIENhbnZhczJEUmVuZGVyZXIgPSByZXF1aXJlKCcuL2NhbnZhczJkLmpzJyksXG5cdFNjZW5lID0gcmVxdWlyZSgnLi9zY2VuZS5qcycpLFxuXHRJbnB1dE1hcCA9IHJlcXVpcmUoJy4vaW5wdXRNYXAuanMnKTtcblxudmFyIEVuZ2luZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHRyZW5kZXJlciA9IG5ldyBDYW52YXMyRFJlbmRlcmVyKCk7XG5cdHRoaXMuc2NlbmUgPSBuZXcgU2NlbmUocmVuZGVyZXIpO1xuXHR0aGlzLmlucHV0TWFwID0gbmV3IElucHV0TWFwKCk7XG59O1xuIiwiLyogSW5wdXQgTWFwIENsYXNzXG4gKiBNYXBzIGFuIGlucHV0IHN5c3RlbSB0byBnYW1lIGFjdGlvbnNcbiAqL1xuXG52YXIgSW5wdXRNYXAgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5rZXlNYXAgPSB7fTtcblx0dGhpcy5vbk1vdXNlTW92ZSA9IG51bGw7XG5cdHRoaXMuYWN0aW9uID0ge307XG5cdHRoaXMuc3RhdGUgPSB7fTtcblx0dGhpcy5yYW5nZSA9IHt9O1xufTtcblxuSW5wdXRNYXAucHJvdG90eXBlLmF0dGFjaE1vdXNlTGlzdGVuZXIgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0Ly8gYm9keS4uLlxufTtcbiIsIi8qIFNjZW5lIENsYXNzXG4gKiBTdG9yZXMgY29weSBvZiB2aWV3YWJsZSB3b3JsZCB0ZXJyYWluIGFuZCBjYWNoZXMgdHJhbnNpdGlvbnNcbiAqL1xuXG52YXIgV29ybGQgPSByZXF1aXJlKCcuL3dvcmxkLmpzJyk7XG5cbnZhciBTY2VuZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJlbmRlcmVyKSB7XG5cdHRoaXMuc2NhbGUgPSAzO1xuXHR0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR0aGlzLnZpZXdCb3ggPSBbMCwgMCwgXTtcblx0dGhpcy5vZmZzZXQgPSBbMCwgMF07XG5cdHRoaXMuZGF0YSA9IFtdO1xuXHR0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XG5cdHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcblx0dGhpcy5yZW5kZXJlci5zZXRTaXplKHRoaXMudmlld0JveFsyXSwgdGhpcy52aWV3Qm94WzNdKTtcblx0Ly8gdGhpcy5sY2cgPSBuZXcgTGluZWFyQ29uZ3J1ZW50aWFsR2VuZXJhdG9yKCk7XG59O1xuXG5TY2VuZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5yZW5kZXJlci5kcmF3KHRoaXMpO1xufTtcblxuU2NlbmUucHJvdG90eXBlLmdldERhdGFJblZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBrID0gdGhpcy53b3JsZC50aWxlU2l6ZSAqIHRoaXMuc2NhbGU7XG5cdHZhciB0aWxlWCA9IE1hdGguZmxvb3IodGhpcy52aWV3Qm94WzBdIC8gdGhpcy53b3JsZC50aWxlU2l6ZSksXG5cdFx0dGlsZVkgPSBNYXRoLmZsb29yKHRoaXMudmlld0JveFsxXSAvIHRoaXMud29ybGQudGlsZVNpemUpO1xuXHR2YXIgZW5kWCA9IHRpbGVYICsgTWF0aC5jZWlsKHRoaXMud2lkdGggLyBrKSArIDEsXG5cdFx0ZW5kWSA9IHRpbGVZICsgTWF0aC5jZWlsKHRoaXMuaGVpZ2h0IC8gaykgKyAxLFxuXHRcdGRhdGEgPSBbXSxcblx0XHR5LCB4LCB5RGF0YTtcblxuXHRmb3IgKHkgPSB0aWxlWTsgeSA8IGVuZFk7IHkrKykge1xuXHRcdHlEYXRhID0gW107XG5cdFx0Zm9yICh4ID0gdGlsZVg7IHggPCBlbmRYOyB4KyspIHtcblx0XHRcdHlEYXRhLnB1c2godGhpcy53b3JsZC5nZXRUaWxlKHgsIHkpKTtcblx0XHR9XG5cdFx0ZGF0YS5wdXNoKHlEYXRhKTtcblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG4iLCIvKiBVdGlsaXR5IEZ1bmN0aW9uc1xuICogSGVscGVycyBhbmQgbWFuaXB1bGF0b3JzIHVzZWQgdGhyb3VnaG91dCB0aGUgY29kZWJhc2VcbiAqL1xuXG52YXIgZmxvb3JlZERpdmlzaW9uID0gbW9kdWxlLmV4cG9ydHMuZmxvb3JlZERpdmlzaW9uID0gZnVuY3Rpb24gKGEsIG4pIHtcblx0cmV0dXJuIGEgLSBuICogTWF0aC5mbG9vcihhIC8gbik7XG59XG5cbi8qIExpbmVhciBDb25ncnVlbnRpYWwgR2VuZXJhdG9yICovXG52YXIgTENHID0gbW9kdWxlLmV4cG9ydHMuTENHID0gZnVuY3Rpb24gKHNlZWQsIG0pIHtcblx0dGhpcy5tID0gbSA/IChtIHwgMCkgOiAxMDIzO1xuXHR0aGlzLmEgPSAyMTQwMTM7XG5cdHRoaXMuYyA9IDI1MzEwMTE7XG5cdHNlZWQgPSBzZWVkID8gKHNlZWQgfCAwKSA6ICgoTWF0aC5yYW5kb20oKSAqIHRoaXMubSkgfCAwKTtcblx0dGhpcy52YWx1ZSA9IHNlZWQ7XG5cdHRoaXMubmV4dCgpO1xufTtcblxuTENHLnByb3RvdHlwZS5yYW5kID0gZnVuY3Rpb24gKHNlZWQpIHtcblx0c2VlZCA9IHNlZWQgPyBzZWVkIDogdGhpcy52YWx1ZTtcblx0cmV0dXJuICgoc2VlZCAqIHRoaXMuYSArIHRoaXMuYykgJiB0aGlzLm0pO1xufTtcblxuTENHLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLnZhbHVlID0gdGhpcy5yYW5kKHRoaXMudmFsdWUpO1xuXHQvLyByZXR1cm4gdGhpcy5yYW5kKHRoaXMudmFsdWUpO1xuXHRyZXR1cm4gdGhpcy52YWx1ZTtcbn07XG5cbi8qIFhNTCBIdHRwIFJlcXVlc3QgSGFuZGxlciAqL1xudmFyIFhIUiA9IG1vZHVsZS5leHBvcnRzLlhIUiA9IGZ1bmN0aW9uICh1cmwsIG1pbWUsIGNhbGxiYWNrKSB7XG5cdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgY2FsbGJhY2sgPSBtaW1lLCBtaW1lID0gbnVsbDtcblx0ZWxzZSBpZiAobWltZSAmJiByZXEub3ZlcnJpZGVNaW1lVHlwZSkgcmVxLm92ZXJyaWRlTWltZVR5cGUobWltZSk7XG5cdHJlcS5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG5cdGlmIChtaW1lKSByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBtaW1lKTtcblx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0dmFyIHMgPSByZXEuc3RhdHVzO1xuXHRcdFx0Y2FsbGJhY2soIXMgJiYgcmVxLnJlc3BvbnNlIHx8IHMgPj0gMjAwICYmIHMgPCAzMDAgfHwgcyA9PT0gMzA0ID8gcmVxIDogbnVsbCk7XG5cdFx0fVxuXHR9O1xuXHRyZXEuc2VuZChudWxsKTtcbn07XG4iLCIvKiBXb3JsZCBDbGFzc1xuICogU3RvcmVzIHdvcmxkIGRhdGEgYW5kIHByb3ZpZGVzIGFuIGludGVyZmFjZSB0byBhY2Nlc3NpbmdcbiAqIGFuZCBtYW5pcHVsYXRpbmcgdGhlIHdvcmxkIGRhdGFcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzLmpzJyk7XG5cbnZhciBXb3JsZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLnRpbGVTaXplID0gODtcblx0dGhpcy50ZXJyYWluID0gbmV3IEltYWdlKCk7XG5cdHRoaXMuYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xuXHR0aGlzLmRhdGEgPSBbXTtcblx0dGhpcy5zZXREaW1lbnNpb25zKDMyLCAyNCk7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG5cdHRoaXMud2lkdGggPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdHRoaXMuZGF0YSA9IG5ldyBBcnJheShoZWlnaHQpO1xuXG5cdGZvciAodmFyIHIgPSAwOyByIDwgaGVpZ2h0OyByKyspIHtcblx0XHR0aGlzLmRhdGFbcl0gPSBuZXcgQXJyYXkod2lkdGgpO1xuXHR9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0VGlsZSA9IGZ1bmN0aW9uICh4LCB5LCB0aWxlKSB7XG5cdHkgPSB1dGlsLmZsb29yZWREaXZpc2lvbih5LCB0aGlzLmRhdGEubGVuZ3RoKTtcblx0eCA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHgsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuXHR0aGlzLmRhdGFbeV1beF0gPSB0aWxlO1xufTtcblxuV29ybGQucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZLCBkYXRhKSB7XG5cdHZhciByb3dzID0gZGF0YS5sZW5ndGgsXG5cdFx0Y29scyA9IGRhdGFbMF0ubGVuZ3RoLFxuXHRcdHksIHg7XG5cblx0Zm9yICh5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xuXHRcdGZvciAoeCA9IDA7IHggPCBjb2xzOyB4KyspIHtcblx0XHRcdHRoaXMuc2V0VGlsZShvZmZzZXRYICsgeCwgb2Zmc2V0WSArIHksIGRhdGFbeV1beF0pO1xuXHRcdH1cblx0fVxufTtcblxuV29ybGQucHJvdG90eXBlLnNldFRlcnJhaW4gPSBmdW5jdGlvbiAoaW1nVVJMKSB7XG5cdHRoaXMudGVycmFpbi5zcmMgPSBpbWdVUkw7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0QmFja2dyb3VuZCA9IGZ1bmN0aW9uIChpbWdVUkwpIHtcblx0dGhpcy5iYWNrZ3JvdW5kLnNyYyA9IGltZ1VSTDtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0dmFyIHJvd3MgPSB0aGlzLmRhdGEubGVuZ3RoLFxuXHRcdGNvbHMgPSB0aGlzLmRhdGFbMF0ubGVuZ3RoO1xuXG5cdGZvciAoeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcblx0XHRmb3IgKHggPSAwOyB4IDwgY29sczsgeCsrKSB7XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuZGF0YVt5XVt4XSwgeCwgeSk7XG5cdFx0fVxuXHR9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuZ2V0VGlsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG5cdHkgPSB1dGlsLmZsb29yZWREaXZpc2lvbih5LCB0aGlzLmRhdGEubGVuZ3RoKTtcblx0eCA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHgsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuXHRyZXR1cm4gdGhpcy5kYXRhW3ldW3hdO1xufTtcblxuV29ybGQucHJvdG90eXBlLmVkZ2VDb25maWcgPSBmdW5jdGlvbiAoeCwgeSkge1xuXHRyZXR1cm4gdGhpcy5nZXRUaWxlKHggLSAxLCB5KVxuXHRcdHwgKHRoaXMuZ2V0VGlsZSh4LCB5IC0gMSkgPDwgMSlcblx0XHR8ICh0aGlzLmdldFRpbGUoeCArIDEsIHkpIDw8IDIpXG5cdFx0fCAodGhpcy5nZXRUaWxlKHgsIHkgKyAxKSA8PCAzKTtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5jb3JuZXJDb25maWcgPSBmdW5jdGlvbiAoeCwgeSkge1xuXHR2YXIgZTEgPSB0aGlzLmdldFRpbGUoeCAtIDEsIHkpLFxuXHRcdGUyID0gdGhpcy5nZXRUaWxlKHgsIHkgLSAxKSxcblx0XHRlNCA9IHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSksXG5cdFx0ZTggPSB0aGlzLmdldFRpbGUoeCwgeSArIDEpO1xuXG5cdHJldHVybiAodGhpcy5nZXRUaWxlKHggLSAxLCB5IC0gMSkgJiYgIShlMSB8fCBlMikpXG5cdFx0fCAoKHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSAtIDEpICYmICEoZTIgfHwgZTQpKSA8PCAxKVxuXHRcdHwgKCh0aGlzLmdldFRpbGUoeCArIDEsIHkgKyAxKSAmJiAhKGU0IHx8IGU4KSkgPDwgMilcblx0XHR8ICgodGhpcy5nZXRUaWxlKHggLSAxLCB5ICsgMSkgJiYgIShlOCB8fCBlMSkpIDw8IDMpO1xufTtcbiJdfQ==
