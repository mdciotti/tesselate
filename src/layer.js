/* Layer Class
 * Manages layers
 */

var uuid = require('node-uuid');
var _ = require('underscore');
var ndarray = require('ndarray');
var pool = require('ndarray-scratch');
var op = require('ndarray-ops');
var util = require('./utilities.js');

var TileLayer = function (opts) {
	opts = _.defaults(opts, {
		name: 'Tile Layer',
		width: 128,
		height: 80,
		opacity: 1,
		visible: true,
		x: 0,
		y: 0
	});
	_.extend(this, opts);
	this.id = uuid.v4();
	this.mask = pool.zeros([this.width, this.height], "uint8");
	this.tiles = pool.zeros([this.width, this.height], "uint8");
	this.edges = pool.zeros([this.width, this.height], "uint8");
	this.corners = pool.zeros([this.width, this.height], "uint8");
	this.tileData = {};
	this.hasEdges = false;
	this.hasCorners = false;
};

// TileLayer.prototype.inject = function (offsetX, offsetY, data) {
// 	var rows = data.length,
// 		cols = data[0].length,
// 		y, x;

// 	for (y = 0; y < rows; y++) {
// 		for (x = 0; x < cols; x++) {
// 			this.setTile(offsetX + x, offsetY + y, data[y][x]);
// 		}
// 	}
// };

TileLayer.prototype.inject = function (offsetX, offsetY, data) {
	var endX = offsetX + data.shape[0];
	var endY = offsetY + data.shape[1];
	op.assign(this.mask.hi(endX, endY).lo(offsetX, offsetY), data);
};

TileLayer.prototype.generateCache = function () {	
	this.calculateTiles();
	this.calculateEdges();
}

TileLayer.prototype.setTileType = function (tileType) {
	// TODO: apply defaults
	this.tileData = tileType;
};

TileLayer.prototype.setDimensions = function (width, height) {
	this.width = width;
	this.height = height;
	this.tiles = pool.malloc([this.width, this.height]);
};

TileLayer.prototype.tileExists = function (x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	x = util.flooredDivision(x, this.mask.shape[0]);
	y = util.flooredDivision(y, this.mask.shape[1]);
	return this.mask.get(x, y);
};

TileLayer.prototype.getTile = function (x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	x = util.flooredDivision(x, this.tiles.shape[0]);
	y = util.flooredDivision(y, this.tiles.shape[1]);
	return this.tiles.get(x, y);
};

TileLayer.prototype.getEdge = function (x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	x = util.flooredDivision(x, this.edges.shape[0]);
	y = util.flooredDivision(y, this.edges.shape[1]);
	return this.edges.get(x, y);
};

TileLayer.prototype.getCorner = function (x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	x = util.flooredDivision(x, this.corners.shape[0]);
	y = util.flooredDivision(y, this.corners.shape[1]);
	return this.corners.get(x, y);
};

var tileExists = function (data, x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	x = util.flooredDivision(x, data.shape[0]);
	y = util.flooredDivision(y, data.shape[1]);
	return data.get(x, y) > 0;
};

TileLayer.prototype.setTile = function (x, y, tile) {
	// If placed out of layer bounds, wrap around
	// alternatively, we could auto-expand the layer
	y = util.flooredDivision(y, this.height);
	x = util.flooredDivision(x, this.width);
	this.mask.set(x, y, tile);
};

TileLayer.prototype.edgeConfig = function (data, c, r) {
	return tileExists(data, c - 1, r)
		| (tileExists(data, c, r - 1) << 1)
		| (tileExists(data, c + 1, r) << 2)
		| (tileExists(data, c, r + 1) << 3);
};

TileLayer.prototype.cornerConfig = function (data, c, r) {
	var e1 = tileExists(data, c - 1, r),
		e2 = tileExists(data, c, r - 1),
		e4 = tileExists(data, c + 1, r),
		e8 = tileExists(data, c, r + 1);

	return (tileExists(data, c - 1, r - 1) && !(e1 || e2))
		| ((tileExists(data, c + 1, r - 1) && !(e2 || e4)) << 1)
		| ((tileExists(data, c + 1, r + 1) && !(e4 || e8)) << 2)
		| ((tileExists(data, c - 1, r + 1) && !(e8 || e1)) << 3);
};

TileLayer.prototype.calculateTiles = function () {
	// TODO: assert that `this.width` = `this.tiles.shape[0]`
	// TODO: assert that `this.height` = `this.tiles.shape[1]`
	var cols = this.width;
	var rows = this.height;
	var tile, r, c;

	for (r = 0; r < rows; r++) {
		for (c = 0; c < cols; c++) {
			tile = this.mask.get(c, r);

			// Skip if void
			if (tile === 0) continue;

			// Choose correct column
			if (this.tileData.isPipe) {
				column = this.edgeConfig(this.mask, c, r);
			} else if (this.tileData.hasAnimation) {
				// TODO: animation?
			} else if (this.tileData.randomSetLength > 1) {
				// TODO: random tile should be stored in chunk data
				// set random column using tile coordinates as seed
				column = Math.floor(Math.random() * this.tileData.randomSetLength);
				// solution: randomize once per chunk load and store (with tile transitions)
				// column = this.lcg.rand(c ^ r | this.tileData.id) % this.tileData.randomSetLength;
			} else {
				column = 0;
			}

			// Store data
			this.tiles.set(c, r, column);
		}
	}
};

TileLayer.prototype.calculateEdges = function () {
	// TODO: assert that `this.width` = `this.tiles.shape[0]`
	// TODO: assert that `this.height` = `this.tiles.shape[1]`
	var cols = this.width;
	var rows = this.height;
	var tile, r, c, edgeConfig, cornerConfig;

	this.hasEdges = util.hasProp(this.tileData, "edges") && this.tileData.edges > 0;
	this.hasCorners = util.hasProp(this.tileData, "corners") && this.tileData.corners > 0;

	if (this.hasEdges || this.hasCorners) {
		for (r = 0; r < rows; r++) {
			for (c = 0; c < cols; c++) {
				tile = this.mask.get(c, r);

				if (tile === 0) {
					if (this.hasEdges) {
						edgeConfig = this.edgeConfig(this.mask, c, r);
						this.edges.set(c, r, edgeConfig);
					} else {
						this.edges.set(c, r, 0);
					}
					if (this.hasCorners) {
						cornerConfig = this.cornerConfig(this.mask, c, r);
						this.corners.set(c, r, cornerConfig);
					} else {
						this.corners.set(c, r, 0);
					}
				}
			}
		}
	}
};

TileLayer.prototype.iterate = function (callback) {
	for (y = 0; y < this.height; y++) {
		for (x = 0; x < this.width; x++) {
			callback.call(this, this.tiles.get(x, y), x, y);
		}
	}
};

module.exports = TileLayer;
