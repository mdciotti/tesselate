/**
 * Graphics Module
 * Drawing of shapes and images, management of screen geometry.
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

Graphics.prototype.drawImage = function (image) {
	
};

module.exports = Graphics;
