/* Tilemap Module
 * Stores layer data and provides an interface to accessing
 * and manipulating the layer data
 */

var uuid = require('node-uuid');
var util = require('./utilities.js');

var Tilemap = function (opts) {
	util.extend(this, util.defaults(opts, {
		name: 'New Tilemap',
		tileSize: 8,
		tileWidth: 8,
		tileHeight: 8,
		background: null,
		width: 128,
		height: 80,
		orientation: 'orthogonal'
	}));

	this.id = uuid.v4();
	this.layers = [];
	this.tilesets = [];
	// this.setDimensions(this.width, this.height);
};

Tilemap.prototype.addLayer = function (layer) {
	this.layers.push(layer);
};

Tilemap.prototype.addTileset = function (tileset) {
	this.tilesets.push(tileset);
};

Tilemap.prototype.setDimensions = function (width, height) {
	this.width = width;
	this.height = height;
};

Tilemap.prototype.finalize = function () {
	this.layers.forEach(function (layer) {
		layer.generateCache();
	});
	this.sortLayers();
};

Tilemap.prototype.sortLayers = function () {
	this.layers.sort(function (layerA, layerB) {
		return layerA.tileData.precedence - layerB.tileData.precedence;
	});
};

// TODO: Write export function
Tilemap.prototype.export = function (type) {
	switch (type.toLowerCase()) {
		case "json": break;
		default: break;
	}
};

module.exports = Tilemap;
