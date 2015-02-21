/* TileSet Class
 * Loads tile sets
 */

var uuid = require('node-uuid');
var util = require('./utilities.js');

var TileSet = function (opts) {
	util.extend(this, util.defaults(opts, {
		name: "Tile Set",
		tileSize: 8,
		image: new Image(),
		margin: 0,
		spacing: 0
	}));
	this.id = uuid.v4();
};

TileSet.prototype.load = function (imgURL) {
	// TODO: actually preload images, this doesn't
	// work unless the image is pre-specified in HTML
	this.image.src = imgURL;
	this.image.style.display = "none";
	document.body.appendChild(this.image);
};

module.exports = TileSet;
