/* Layer Class
 * Manages layers
 */

var uuid = require('node-uuid');
var _ = require('underscore');
var ndarray = require('ndarray');
var pool = require('ndarray-scratch');
var util = require('./utilities.js');

var Layer = function (opts) {
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
	this.data = pool.malloc([this.width, this.height]);
};

Layer.prototype.inject = function (offsetX, offsetY, data) {
	var rows = data.length,
		cols = data[0].length,
		y, x;

	for (y = 0; y < rows; y++) {
		for (x = 0; x < cols; x++) {
			this.setTile(offsetX + x, offsetY + y, data[y][x]);
		}
	}
};

Layer.prototype.setDimensions = function (width, height) {
	this.width = width;
	this.height = height;
	this.data = pool.malloc([this.width, this.height]);
};

Layer.prototype.getTile = function (x, y) {
	// If accessed out of layer bounds, wrap around
	// alternatively, we could return nothing
	y = util.flooredDivision(y, this.data.shape[1]);
	x = util.flooredDivision(x, this.data.shape[0]);
	return this.data.get(x, y);
};

Layer.prototype.setTile = function (x, y, tile) {
	// If placed out of layer bounds, wrap around
	// alternatively, we could auto-expand the layer
	y = util.flooredDivision(y, this.height);
	x = util.flooredDivision(x, this.width);
	this.data.set(x, y, tile);
};

Layer.prototype.edgeConfig = function (x, y) {
	return this.getTile(x - 1, y)
		| (this.getTile(x, y - 1) << 1)
		| (this.getTile(x + 1, y) << 2)
		| (this.getTile(x, y + 1) << 3);
};

Layer.prototype.cornerConfig = function (x, y) {
	var e1 = this.getTile(x - 1, y),
		e2 = this.getTile(x, y - 1),
		e4 = this.getTile(x + 1, y),
		e8 = this.getTile(x, y + 1);

	return (this.getTile(x - 1, y - 1) && !(e1 || e2))
		| ((this.getTile(x + 1, y - 1) && !(e2 || e4)) << 1)
		| ((this.getTile(x + 1, y + 1) && !(e4 || e8)) << 2)
		| ((this.getTile(x - 1, y + 1) && !(e8 || e1)) << 3);
};

Layer.prototype.iterate = function (callback) {
	for (y = 0; y < this.height; y++) {
		for (x = 0; x < this.width; x++) {
			callback.call(this, this.data.get(x, y), x, y);
		}
	}
};

module.exports = Layer;
