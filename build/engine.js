(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Engine Class
 * Coordinates the various game subsystems
 */

var Canvas2DRenderer = require('./canvas2d.js'),
	View = require('./view.js'),
	InputMap = require('./inputMap.js');

var Engine = module.exports.Engine = function () {
	this.renderer = new Canvas2DRenderer();
	this.view = new View();
	this.inputMap = new InputMap();
};

},{"./canvas2d.js":2,"./inputMap.js":4,"./view.js":6}],2:[function(require,module,exports){
/* Canvas 2D Renderer Class
 * Provides methods to render the game onto an HTML5 canvas
 */

var Tile = require('./data/tile/index.js');

var Canvas2DRenderer = module.exports.Canvas2DRenderer = function () {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	document.body.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	this.context.mozImageSmoothingEnabled = false;
};

Canvas2DRenderer.prototype.paintTile = function (view, tileType, column, config, x, y) {
	var world = view.world;
	var k = world.tileSize * view.scale,
		sourceX = world.tileSize * config,
		sourceY = world.tileSize * (tileType + column),
		destX = -view.offset[0] * view.scale + x * k,
		destY = -view.offset[1] * view.scale + y * k;
	this.context.drawImage(world.terrain, sourceX, sourceY, world.tileSize, world.tileSize, destX, destY, k, k);
};

Canvas2DRenderer.prototype.clear = function (color) {	
	this.context.fillStyle = color || "#000000";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2DRenderer.prototype.draw = function (view) {

	this.clear("#000000");

	var data = view.getDataInView();

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
	// transitions = view.world.findTransitions(data);
	
	// Temporary (will be moved to separate tile classes)
	
	tileData = Tile.WoodPanel;

	for (r = 0; r < rows; r++) {
		for (c = 0; c < cols; c++) {
			tile = data[r][c];

			// Skip if void
			if (tile === 0 || typeof tile === "undefined") continue;

			// Choose correct column
			if (tileData.isPipe) {
				column = view.world.edgeConfig(c, r);
			} else if (tileData.hasAnimation) {

			} else if (tileData.randomSetLength > 1) {
				// TODO: random tile should be stored in chunk data
				// set random column using tile coordinates as seed
				// column = Math.floor(Math.random() * tileData.randomSetLength);
				// solution: randomize once per chunk load and store (with tile transitions)
				column = view.lcg.rand(c ^ r | tileData.id) % tileData.randomSetLength;
			} else {
				column = 0;
			}

			// Paint tile
			this.paintTile(view, tileData.texture, 0, column, c, r);
		}
	}

	var hasEdges = tileData.hasOwnProperty("edges") && tileData.edges > 0;
	var hasCorners = tileData.hasOwnProperty("corners") && tileData.corners > 0;

	if (hasEdges || hasCorners) {
		// Decorations
		for (r = 0; r < rows; r++) {
			for (c = 0; c < cols; c++) {
				tile = data[r][c];
				edgeConfig = view.world.edgeConfig(c, r);

				if (tile === 0) {
					if (hasEdges) {
						// Paint edges
						this.paintTile(view, tileData.texture, tileData.edges, edgeConfig, c, r);
					}
					if (hasCorners) {
						// Paint corners
						cornerConfig = view.world.cornerConfig(c, r);
						this.paintTile(view, tileData.texture, tileData.corners, cornerConfig, c, r);
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

var Tile = module.exports.Tile = {};

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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
/* View Class
 * Stores copy of viewable world terrain and caches transitions
 */

var World = require('./world.js');

var View = module.exports.View = function () {
	this.scale = 3;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.origin = [0, 0];
	this.offset = [0, 0];
	this.data = [];
	this.world = new World();
	this.lcg = new LinearCongruentialGenerator();
};

View.prototype.getDataInView = function () {
	var k = this.world.tileSize * this.scale;
	var endX = this.origin[0] + Math.ceil(this.width / k) + 1,
		endY = this.origin[1] + Math.ceil(this.height / k) + 1,
		data = [],
		y, x, yData;

	for (y = this.origin[1]; y < endY; y++) {
		yData = [];
		for (x = this.origin[0]; x < endX; x++) {
			yData.push(this.world.getTile(x, y));
		}
		data.push(yData);
	}
	return data;
};

},{"./world.js":7}],7:[function(require,module,exports){
/* World Class
 * Stores world data and provides an interface to accessing
 * and manipulating the world data
 */

var util = require('./utilities.js');

var World = module.exports.World = function () {
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

},{"./utilities.js":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXgvZGV2L3dlYi90eWxlci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi9lbmdpbmUuanMiLCIvVXNlcnMvbWF4L2Rldi93ZWIvdHlsZXIvY2FudmFzMmQuanMiLCIvVXNlcnMvbWF4L2Rldi93ZWIvdHlsZXIvZGF0YS90aWxlL2luZGV4LmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL2lucHV0TWFwLmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL3V0aWxpdGllcy5qcyIsIi9Vc2Vycy9tYXgvZGV2L3dlYi90eWxlci92aWV3LmpzIiwiL1VzZXJzL21heC9kZXYvd2ViL3R5bGVyL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIEVuZ2luZSBDbGFzc1xuICogQ29vcmRpbmF0ZXMgdGhlIHZhcmlvdXMgZ2FtZSBzdWJzeXN0ZW1zXG4gKi9cblxudmFyIENhbnZhczJEUmVuZGVyZXIgPSByZXF1aXJlKCcuL2NhbnZhczJkLmpzJyksXG5cdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcuanMnKSxcblx0SW5wdXRNYXAgPSByZXF1aXJlKCcuL2lucHV0TWFwLmpzJyk7XG5cbnZhciBFbmdpbmUgPSBtb2R1bGUuZXhwb3J0cy5FbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMucmVuZGVyZXIgPSBuZXcgQ2FudmFzMkRSZW5kZXJlcigpO1xuXHR0aGlzLnZpZXcgPSBuZXcgVmlldygpO1xuXHR0aGlzLmlucHV0TWFwID0gbmV3IElucHV0TWFwKCk7XG59O1xuIiwiLyogQ2FudmFzIDJEIFJlbmRlcmVyIENsYXNzXG4gKiBQcm92aWRlcyBtZXRob2RzIHRvIHJlbmRlciB0aGUgZ2FtZSBvbnRvIGFuIEhUTUw1IGNhbnZhc1xuICovXG5cbnZhciBUaWxlID0gcmVxdWlyZSgnLi9kYXRhL3RpbGUvaW5kZXguanMnKTtcblxudmFyIENhbnZhczJEUmVuZGVyZXIgPSBtb2R1bGUuZXhwb3J0cy5DYW52YXMyRFJlbmRlcmVyID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblx0dGhpcy5jb250ZXh0Lm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xufTtcblxuQ2FudmFzMkRSZW5kZXJlci5wcm90b3R5cGUucGFpbnRUaWxlID0gZnVuY3Rpb24gKHZpZXcsIHRpbGVUeXBlLCBjb2x1bW4sIGNvbmZpZywgeCwgeSkge1xuXHR2YXIgd29ybGQgPSB2aWV3LndvcmxkO1xuXHR2YXIgayA9IHdvcmxkLnRpbGVTaXplICogdmlldy5zY2FsZSxcblx0XHRzb3VyY2VYID0gd29ybGQudGlsZVNpemUgKiBjb25maWcsXG5cdFx0c291cmNlWSA9IHdvcmxkLnRpbGVTaXplICogKHRpbGVUeXBlICsgY29sdW1uKSxcblx0XHRkZXN0WCA9IC12aWV3Lm9mZnNldFswXSAqIHZpZXcuc2NhbGUgKyB4ICogayxcblx0XHRkZXN0WSA9IC12aWV3Lm9mZnNldFsxXSAqIHZpZXcuc2NhbGUgKyB5ICogaztcblx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZSh3b3JsZC50ZXJyYWluLCBzb3VyY2VYLCBzb3VyY2VZLCB3b3JsZC50aWxlU2l6ZSwgd29ybGQudGlsZVNpemUsIGRlc3RYLCBkZXN0WSwgaywgayk7XG59O1xuXG5DYW52YXMyRFJlbmRlcmVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIChjb2xvcikge1x0XG5cdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjb2xvciB8fCBcIiMwMDAwMDBcIjtcblx0dGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xufTtcblxuQ2FudmFzMkRSZW5kZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICh2aWV3KSB7XG5cblx0dGhpcy5jbGVhcihcIiMwMDAwMDBcIik7XG5cblx0dmFyIGRhdGEgPSB2aWV3LmdldERhdGFJblZpZXcoKTtcblxuXHQvLyBEcmF3IHRlcnJhaW5cblx0dmFyIHRpbGUsIGNvbHVtbiwgY29ybmVyQ29uZmlnLCBzZWVkLFxuXHRcdHJvd3MgPSBkYXRhLmxlbmd0aCxcblx0XHRjb2xzID0gZGF0YVswXS5sZW5ndGg7XG5cblx0Ly8gMS4gRHJhdyBiYWNrZ3JvdW5kKHMpXG5cdC8vIDIuIERyYXcgd2FsbCB0aWxlc1xuXHQvLyAzLiBEcmF3IHRpbGVzXG5cdC8vIDQuIERyYXcgZW50aXRpZXNcblx0Ly8gNS4gRHJhdyB0aWxlIHRyYW5zaXRpb25zXG5cdC8vIDYuIERyYXcgZWZmZWN0c1xuXHQvLyBUT0RPOiBmb3IgdHJhbnNpdGlvbnMsIHVzZSB0aWxlIHByZWNlZGVuY2Vcblx0Ly8gVE9ETzogbGlnaHRpbmdcblx0XG5cdC8vIGZpbmQgdHJhbnNpdGlvbnNcblx0Ly8gdHJhbnNpdGlvbnMgPSB2aWV3LndvcmxkLmZpbmRUcmFuc2l0aW9ucyhkYXRhKTtcblx0XG5cdC8vIFRlbXBvcmFyeSAod2lsbCBiZSBtb3ZlZCB0byBzZXBhcmF0ZSB0aWxlIGNsYXNzZXMpXG5cdFxuXHR0aWxlRGF0YSA9IFRpbGUuV29vZFBhbmVsO1xuXG5cdGZvciAociA9IDA7IHIgPCByb3dzOyByKyspIHtcblx0XHRmb3IgKGMgPSAwOyBjIDwgY29sczsgYysrKSB7XG5cdFx0XHR0aWxlID0gZGF0YVtyXVtjXTtcblxuXHRcdFx0Ly8gU2tpcCBpZiB2b2lkXG5cdFx0XHRpZiAodGlsZSA9PT0gMCB8fCB0eXBlb2YgdGlsZSA9PT0gXCJ1bmRlZmluZWRcIikgY29udGludWU7XG5cblx0XHRcdC8vIENob29zZSBjb3JyZWN0IGNvbHVtblxuXHRcdFx0aWYgKHRpbGVEYXRhLmlzUGlwZSkge1xuXHRcdFx0XHRjb2x1bW4gPSB2aWV3LndvcmxkLmVkZ2VDb25maWcoYywgcik7XG5cdFx0XHR9IGVsc2UgaWYgKHRpbGVEYXRhLmhhc0FuaW1hdGlvbikge1xuXG5cdFx0XHR9IGVsc2UgaWYgKHRpbGVEYXRhLnJhbmRvbVNldExlbmd0aCA+IDEpIHtcblx0XHRcdFx0Ly8gVE9ETzogcmFuZG9tIHRpbGUgc2hvdWxkIGJlIHN0b3JlZCBpbiBjaHVuayBkYXRhXG5cdFx0XHRcdC8vIHNldCByYW5kb20gY29sdW1uIHVzaW5nIHRpbGUgY29vcmRpbmF0ZXMgYXMgc2VlZFxuXHRcdFx0XHQvLyBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aWxlRGF0YS5yYW5kb21TZXRMZW5ndGgpO1xuXHRcdFx0XHQvLyBzb2x1dGlvbjogcmFuZG9taXplIG9uY2UgcGVyIGNodW5rIGxvYWQgYW5kIHN0b3JlICh3aXRoIHRpbGUgdHJhbnNpdGlvbnMpXG5cdFx0XHRcdGNvbHVtbiA9IHZpZXcubGNnLnJhbmQoYyBeIHIgfCB0aWxlRGF0YS5pZCkgJSB0aWxlRGF0YS5yYW5kb21TZXRMZW5ndGg7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb2x1bW4gPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQYWludCB0aWxlXG5cdFx0XHR0aGlzLnBhaW50VGlsZSh2aWV3LCB0aWxlRGF0YS50ZXh0dXJlLCAwLCBjb2x1bW4sIGMsIHIpO1xuXHRcdH1cblx0fVxuXG5cdHZhciBoYXNFZGdlcyA9IHRpbGVEYXRhLmhhc093blByb3BlcnR5KFwiZWRnZXNcIikgJiYgdGlsZURhdGEuZWRnZXMgPiAwO1xuXHR2YXIgaGFzQ29ybmVycyA9IHRpbGVEYXRhLmhhc093blByb3BlcnR5KFwiY29ybmVyc1wiKSAmJiB0aWxlRGF0YS5jb3JuZXJzID4gMDtcblxuXHRpZiAoaGFzRWRnZXMgfHwgaGFzQ29ybmVycykge1xuXHRcdC8vIERlY29yYXRpb25zXG5cdFx0Zm9yIChyID0gMDsgciA8IHJvd3M7IHIrKykge1xuXHRcdFx0Zm9yIChjID0gMDsgYyA8IGNvbHM7IGMrKykge1xuXHRcdFx0XHR0aWxlID0gZGF0YVtyXVtjXTtcblx0XHRcdFx0ZWRnZUNvbmZpZyA9IHZpZXcud29ybGQuZWRnZUNvbmZpZyhjLCByKTtcblxuXHRcdFx0XHRpZiAodGlsZSA9PT0gMCkge1xuXHRcdFx0XHRcdGlmIChoYXNFZGdlcykge1xuXHRcdFx0XHRcdFx0Ly8gUGFpbnQgZWRnZXNcblx0XHRcdFx0XHRcdHRoaXMucGFpbnRUaWxlKHZpZXcsIHRpbGVEYXRhLnRleHR1cmUsIHRpbGVEYXRhLmVkZ2VzLCBlZGdlQ29uZmlnLCBjLCByKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGhhc0Nvcm5lcnMpIHtcblx0XHRcdFx0XHRcdC8vIFBhaW50IGNvcm5lcnNcblx0XHRcdFx0XHRcdGNvcm5lckNvbmZpZyA9IHZpZXcud29ybGQuY29ybmVyQ29uZmlnKGMsIHIpO1xuXHRcdFx0XHRcdFx0dGhpcy5wYWludFRpbGUodmlldywgdGlsZURhdGEudGV4dHVyZSwgdGlsZURhdGEuY29ybmVycywgY29ybmVyQ29uZmlnLCBjLCByKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn07XG4iLCIvKiBUaWxlIERhdGEgRGVjbGFyYXRpb25zXG4gKiBDb29yZGluYXRlcyB0aGUgdmFyaW91cyBnYW1lIHN1YnN5c3RlbXNcbiAqL1xuXG52YXIgVGlsZSA9IG1vZHVsZS5leHBvcnRzLlRpbGUgPSB7fTtcblxuVGlsZS5CbHVlQmxvY2sgPSB7XG5cdGlkOiAxLFxuXHRuYW1lOiBcIkJsdWUgQmxvY2tcIixcblx0cHJlY2VkZW5jZTogMTAsXG5cdHNvbGlkOiB0cnVlLFxuXHRpc1BpcGU6IHRydWUsXG5cdGhhc0FuaW1hdGlvbjogZmFsc2UsXG5cdHJhbmRvbVNldExlbmd0aDogMSxcblx0ZWRnZXM6IDEsXG5cdGNvcm5lcnM6IDIsXG5cdHRleHR1cmU6IDIsXG5cdHNvdW5kOiB7fVxufTtcblxuVGlsZS5Xb29kUGFuZWwgPSB7XG5cdGlkOiAyLFxuXHRuYW1lOiBcIldvb2QgUGFuZWxcIixcblx0cHJlY2VkZW5jZTogOCxcblx0c29saWQ6IHRydWUsXG5cdGlzUGlwZTogZmFsc2UsXG5cdGhhc0FuaW1hdGlvbjogZmFsc2UsXG5cdHJhbmRvbVNldExlbmd0aDogMixcblx0ZWRnZXM6IDEsXG5cdGNvcm5lcnM6IDAsXG5cdHRleHR1cmU6IDQsXG5cdHNvdW5kOiB7fVxufTtcblxuVGlsZS5Db25jcmV0ZSA9IHtcblx0aWQ6IDMsXG5cdG5hbWU6IFwiQ29uY3JldGVcIixcblx0cHJlY2VkZW5jZTogNixcblx0c29saWQ6IHRydWUsXG5cdGlzUGlwZTogZmFsc2UsXG5cdGhhc0FuaW1hdGlvbjogZmFsc2UsXG5cdHJhbmRvbVNldExlbmd0aDogNCxcblx0dGV4dHVyZTogNixcblx0ZWRnZXM6IDEsXG5cdGNvcm5lcnM6IDAsXG5cdHNvdW5kOiB7fVxufTtcblxuVGlsZS5NZXRhbFBsYXRlID0ge1xuXHRpZDogNCxcblx0bmFtZTogXCJNZXRhbCBQbGF0ZVwiLFxuXHRwcmVjZWRlbmNlOiAwLFxuXHRzb2xpZDogdHJ1ZSxcblx0aXNQaXBlOiB0cnVlLFxuXHRoYXNBbmltYXRpb246IGZhbHNlLFxuXHRyYW5kb21TZXRMZW5ndGg6IDEsXG5cdHRleHR1cmU6IDgsXG5cdGVkZ2VzOiAwLFxuXHRjb3JuZXJzOiAwLFxuXHRzb3VuZDoge31cbn07XG5cblRpbGUuV2F0ZXIgPSB7XG5cdGlkOiA1LFxuXHRuYW1lOiBcIldhdGVyXCIsXG5cdHByZWNlZGVuY2U6IDAsXG5cdHNvbGlkOiBmYWxzZSxcblx0aXNQaXBlOiBmYWxzZSxcblx0aGFzQW5pbWF0aW9uOiBmYWxzZSxcblx0cmFuZG9tU2V0TGVuZ3RoOiAxLFxuXHR0ZXh0dXJlOiAxMSxcblx0ZWRnZXM6IDAsXG5cdGNvcm5lcnM6IDAsXG5cdHNvdW5kOiB7fVxufTtcblxuVGlsZS5TYXBwaGlyZSA9IHtcblx0aWQ6IDYsXG5cdG5hbWU6IFwiU2FwcGhpcmVcIixcblx0cHJlY2VkZW5jZTogMTAwLFxuXHRzb2xpZDogdHJ1ZSxcblx0aXNQaXBlOiBmYWxzZSxcblx0aGFzQW5pbWF0aW9uOiBmYWxzZSxcblx0cmFuZG9tU2V0TGVuZ3RoOiAxLFxuXHR0ZXh0dXJlOiA5LFxuXHRlZGdlczogMSxcblx0Y29ybmVyczogMCxcblx0c291bmQ6IHt9XG59O1xuIiwiLyogSW5wdXQgTWFwIENsYXNzXG4gKiBNYXBzIGFuIGlucHV0IHN5c3RlbSB0byBnYW1lIGFjdGlvbnNcbiAqL1xuXG52YXIgSW5wdXRNYXAgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMua2V5TWFwID0ge307XG5cdHRoaXMub25Nb3VzZU1vdmUgPSBudWxsO1xuXHR0aGlzLmFjdGlvbiA9IHt9O1xuXHR0aGlzLnN0YXRlID0ge307XG5cdHRoaXMucmFuZ2UgPSB7fTtcbn07XG5cbklucHV0TWFwLnByb3RvdHlwZS5hdHRhY2hNb3VzZUxpc3RlbmVyID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdC8vIGJvZHkuLi5cbn07XG4iLCIvKiBVdGlsaXR5IEZ1bmN0aW9uc1xuICogSGVscGVycyBhbmQgbWFuaXB1bGF0b3JzIHVzZWQgdGhyb3VnaG91dCB0aGUgY29kZWJhc2VcbiAqL1xuXG52YXIgZmxvb3JlZERpdmlzaW9uID0gbW9kdWxlLmV4cG9ydHMuZmxvb3JlZERpdmlzaW9uID0gZnVuY3Rpb24gKGEsIG4pIHtcblx0cmV0dXJuIGEgLSBuICogTWF0aC5mbG9vcihhIC8gbik7XG59XG5cbi8qIExpbmVhciBDb25ncnVlbnRpYWwgR2VuZXJhdG9yICovXG52YXIgTENHID0gbW9kdWxlLmV4cG9ydHMuTENHID0gZnVuY3Rpb24gKHNlZWQsIG0pIHtcblx0dGhpcy5tID0gbSA/IChtIHwgMCkgOiAxMDIzO1xuXHR0aGlzLmEgPSAyMTQwMTM7XG5cdHRoaXMuYyA9IDI1MzEwMTE7XG5cdHNlZWQgPSBzZWVkID8gKHNlZWQgfCAwKSA6ICgoTWF0aC5yYW5kb20oKSAqIHRoaXMubSkgfCAwKTtcblx0dGhpcy52YWx1ZSA9IHNlZWQ7XG5cdHRoaXMubmV4dCgpO1xufTtcblxuTENHLnByb3RvdHlwZS5yYW5kID0gZnVuY3Rpb24gKHNlZWQpIHtcblx0c2VlZCA9IHNlZWQgPyBzZWVkIDogdGhpcy52YWx1ZTtcblx0cmV0dXJuICgoc2VlZCAqIHRoaXMuYSArIHRoaXMuYykgJiB0aGlzLm0pO1xufTtcblxuTENHLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLnZhbHVlID0gdGhpcy5yYW5kKHRoaXMudmFsdWUpO1xuXHQvLyByZXR1cm4gdGhpcy5yYW5kKHRoaXMudmFsdWUpO1xuXHRyZXR1cm4gdGhpcy52YWx1ZTtcbn07XG5cbi8qIFhNTCBIdHRwIFJlcXVlc3QgSGFuZGxlciAqL1xudmFyIFhIUiA9IG1vZHVsZS5leHBvcnRzLlhIUiA9IGZ1bmN0aW9uICh1cmwsIG1pbWUsIGNhbGxiYWNrKSB7XG5cdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgY2FsbGJhY2sgPSBtaW1lLCBtaW1lID0gbnVsbDtcblx0ZWxzZSBpZiAobWltZSAmJiByZXEub3ZlcnJpZGVNaW1lVHlwZSkgcmVxLm92ZXJyaWRlTWltZVR5cGUobWltZSk7XG5cdHJlcS5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XG5cdGlmIChtaW1lKSByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBtaW1lKTtcblx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0dmFyIHMgPSByZXEuc3RhdHVzO1xuXHRcdFx0Y2FsbGJhY2soIXMgJiYgcmVxLnJlc3BvbnNlIHx8IHMgPj0gMjAwICYmIHMgPCAzMDAgfHwgcyA9PT0gMzA0ID8gcmVxIDogbnVsbCk7XG5cdFx0fVxuXHR9O1xuXHRyZXEuc2VuZChudWxsKTtcbn07XG4iLCIvKiBWaWV3IENsYXNzXG4gKiBTdG9yZXMgY29weSBvZiB2aWV3YWJsZSB3b3JsZCB0ZXJyYWluIGFuZCBjYWNoZXMgdHJhbnNpdGlvbnNcbiAqL1xuXG52YXIgV29ybGQgPSByZXF1aXJlKCcuL3dvcmxkLmpzJyk7XG5cbnZhciBWaWV3ID0gbW9kdWxlLmV4cG9ydHMuVmlldyA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy5zY2FsZSA9IDM7XG5cdHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0dGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdHRoaXMub3JpZ2luID0gWzAsIDBdO1xuXHR0aGlzLm9mZnNldCA9IFswLCAwXTtcblx0dGhpcy5kYXRhID0gW107XG5cdHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcblx0dGhpcy5sY2cgPSBuZXcgTGluZWFyQ29uZ3J1ZW50aWFsR2VuZXJhdG9yKCk7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXREYXRhSW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgayA9IHRoaXMud29ybGQudGlsZVNpemUgKiB0aGlzLnNjYWxlO1xuXHR2YXIgZW5kWCA9IHRoaXMub3JpZ2luWzBdICsgTWF0aC5jZWlsKHRoaXMud2lkdGggLyBrKSArIDEsXG5cdFx0ZW5kWSA9IHRoaXMub3JpZ2luWzFdICsgTWF0aC5jZWlsKHRoaXMuaGVpZ2h0IC8gaykgKyAxLFxuXHRcdGRhdGEgPSBbXSxcblx0XHR5LCB4LCB5RGF0YTtcblxuXHRmb3IgKHkgPSB0aGlzLm9yaWdpblsxXTsgeSA8IGVuZFk7IHkrKykge1xuXHRcdHlEYXRhID0gW107XG5cdFx0Zm9yICh4ID0gdGhpcy5vcmlnaW5bMF07IHggPCBlbmRYOyB4KyspIHtcblx0XHRcdHlEYXRhLnB1c2godGhpcy53b3JsZC5nZXRUaWxlKHgsIHkpKTtcblx0XHR9XG5cdFx0ZGF0YS5wdXNoKHlEYXRhKTtcblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG4iLCIvKiBXb3JsZCBDbGFzc1xuICogU3RvcmVzIHdvcmxkIGRhdGEgYW5kIHByb3ZpZGVzIGFuIGludGVyZmFjZSB0byBhY2Nlc3NpbmdcbiAqIGFuZCBtYW5pcHVsYXRpbmcgdGhlIHdvcmxkIGRhdGFcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzLmpzJyk7XG5cbnZhciBXb3JsZCA9IG1vZHVsZS5leHBvcnRzLldvcmxkID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLnRpbGVTaXplID0gODtcblx0dGhpcy50ZXJyYWluID0gbmV3IEltYWdlKCk7XG5cdHRoaXMuYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xuXHR0aGlzLmRhdGEgPSBbXTtcblx0dGhpcy5zZXREaW1lbnNpb25zKDMyLCAyNCk7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG5cdHRoaXMud2lkdGggPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdHRoaXMuZGF0YSA9IG5ldyBBcnJheShoZWlnaHQpO1xuXG5cdGZvciAodmFyIHIgPSAwOyByIDwgaGVpZ2h0OyByKyspIHtcblx0XHR0aGlzLmRhdGFbcl0gPSBuZXcgQXJyYXkod2lkdGgpO1xuXHR9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0VGlsZSA9IGZ1bmN0aW9uICh4LCB5LCB0aWxlKSB7XG5cdHkgPSB1dGlsLmZsb29yZWREaXZpc2lvbih5LCB0aGlzLmRhdGEubGVuZ3RoKTtcblx0eCA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHgsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuXHR0aGlzLmRhdGFbeV1beF0gPSB0aWxlO1xufTtcblxuV29ybGQucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZLCBkYXRhKSB7XG5cdHZhciByb3dzID0gZGF0YS5sZW5ndGgsXG5cdFx0Y29scyA9IGRhdGFbMF0ubGVuZ3RoLFxuXHRcdHksIHg7XG5cblx0Zm9yICh5ID0gMDsgeSA8IHJvd3M7IHkrKykge1xuXHRcdGZvciAoeCA9IDA7IHggPCBjb2xzOyB4KyspIHtcblx0XHRcdHRoaXMuc2V0VGlsZShvZmZzZXRYICsgeCwgb2Zmc2V0WSArIHksIGRhdGFbeV1beF0pO1xuXHRcdH1cblx0fVxufTtcblxuV29ybGQucHJvdG90eXBlLnNldFRlcnJhaW4gPSBmdW5jdGlvbiAoaW1nVVJMKSB7XG5cdHRoaXMudGVycmFpbi5zcmMgPSBpbWdVUkw7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuc2V0QmFja2dyb3VuZCA9IGZ1bmN0aW9uIChpbWdVUkwpIHtcblx0dGhpcy5iYWNrZ3JvdW5kLnNyYyA9IGltZ1VSTDtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0dmFyIHJvd3MgPSB0aGlzLmRhdGEubGVuZ3RoLFxuXHRcdGNvbHMgPSB0aGlzLmRhdGFbMF0ubGVuZ3RoO1xuXG5cdGZvciAoeSA9IDA7IHkgPCByb3dzOyB5KyspIHtcblx0XHRmb3IgKHggPSAwOyB4IDwgY29sczsgeCsrKSB7XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuZGF0YVt5XVt4XSwgeCwgeSk7XG5cdFx0fVxuXHR9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuZ2V0VGlsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG5cdHkgPSB1dGlsLmZsb29yZWREaXZpc2lvbih5LCB0aGlzLmRhdGEubGVuZ3RoKTtcblx0eCA9IHV0aWwuZmxvb3JlZERpdmlzaW9uKHgsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuXHRyZXR1cm4gdGhpcy5kYXRhW3ldW3hdO1xufTtcblxuV29ybGQucHJvdG90eXBlLmVkZ2VDb25maWcgPSBmdW5jdGlvbiAoeCwgeSkge1xuXHRyZXR1cm4gdGhpcy5nZXRUaWxlKHggLSAxLCB5KVxuXHRcdHwgKHRoaXMuZ2V0VGlsZSh4LCB5IC0gMSkgPDwgMSlcblx0XHR8ICh0aGlzLmdldFRpbGUoeCArIDEsIHkpIDw8IDIpXG5cdFx0fCAodGhpcy5nZXRUaWxlKHgsIHkgKyAxKSA8PCAzKTtcbn07XG5cbldvcmxkLnByb3RvdHlwZS5jb3JuZXJDb25maWcgPSBmdW5jdGlvbiAoeCwgeSkge1xuXHR2YXIgZTEgPSB0aGlzLmdldFRpbGUoeCAtIDEsIHkpLFxuXHRcdGUyID0gdGhpcy5nZXRUaWxlKHgsIHkgLSAxKSxcblx0XHRlNCA9IHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSksXG5cdFx0ZTggPSB0aGlzLmdldFRpbGUoeCwgeSArIDEpO1xuXG5cdHJldHVybiAodGhpcy5nZXRUaWxlKHggLSAxLCB5IC0gMSkgJiYgIShlMSB8fCBlMikpXG5cdFx0fCAoKHRoaXMuZ2V0VGlsZSh4ICsgMSwgeSAtIDEpICYmICEoZTIgfHwgZTQpKSA8PCAxKVxuXHRcdHwgKCh0aGlzLmdldFRpbGUoeCArIDEsIHkgKyAxKSAmJiAhKGU0IHx8IGU4KSkgPDwgMilcblx0XHR8ICgodGhpcy5nZXRUaWxlKHggLSAxLCB5ICsgMSkgJiYgIShlOCB8fCBlMSkpIDw8IDMpO1xufTtcbiJdfQ==
