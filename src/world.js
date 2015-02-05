/* World Class
 * Stores world data and provides an interface to accessing
 * and manipulating the world data
 */

var util = require('./utilities.js');
var uuid = require('node-uuid');
var _ = require('underscore');
var Layer = require('./layer.js');
var TileSet = require('./tileset.js');
var Field = require('ndarray-continuous');
// var Observer = require('continuous-observer');

var CHUNK_SIZE = 16;

var World = function (opts) {
	opts = _.defaults(opts, {
		name: 'New World',
		tileSize: 8,
		background: null,
		width: 128,
		height: 80
	});
	_.extend(this, opts);
	this.id = uuid.v4();
	this.layers = [];
	this.tileSets = [];
	this.setDimensions(this.width, this.height);
	this.data = Field({
		shape: [CHUNK_SIZE, CHUNK_SIZE],
		getter: function (position, done) {
			// TODO: load chunks from storage
			return done(null, zeros([CHUNK_SIZE, CHUNK_SIZE]));
		}
	});
};

World.prototype.add = function (obj) {
	if (obj instanceof Layer) {
		this.layers.push(obj);
	} else if (obj instanceof TileSet) {
		this.tileSets.push(obj);
	// } else if (obj instanceof Entity) {
	// 	this.entities.push(obj);
	}
};

World.prototype.setDimensions = function (width, height) {
	this.width = width;
	this.height = height;
};

World.prototype.setBackground = function (imgURL) {
	this.background.src = imgURL;
};

// TODO:
World.prototype.export = function (type) {
	switch (type.toLowerCase()) {
		case "json": break;
		default: break;
	}
};

module.exports = World;
