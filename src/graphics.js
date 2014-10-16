/**
 * Graphics Class
 * Abstracts rendering and handles texture importing
 */

var Tile = require('../data/tile/index.js');

var Graphics = function () {
	
};

Graphics.prototype.newImage = function (url, callback) {
	var image = new Image();
	img.src = url;
	image.addEventListener('load', function (e) {
		callback.call(this, image);
	}, false);
};

module.exports = Graphics;
