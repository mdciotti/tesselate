/* Scene Class
 * Stores copy of viewable world terrain and caches transitions
 */

var World = require('./world.js');
// var ndarray = require('ndarray');

var Scene = function (renderer) {
	this.scale = 3;
	this.viewBox = [0, 0, window.innerWidth, window.innerHeight];
	this.data = [];
	this.world = null; // new World();
	this.renderer = renderer;
	this.renderer.setSize(this.viewBox[2], this.viewBox[3]);
	// this.lcg = new LinearCongruentialGenerator();
};

Scene.prototype.setWorld = function (world) {
	if (world instanceof World) {
		this.world = world;
	} else {
		throw new Error("Scene::setWorld() requires a World object");
	}
};

Scene.prototype.setScale = function (n) {
	// TODO: center viewport when scaling
	this.scale = Math.floor(Math.max(1, n));
};

Scene.prototype.clear = function (color) {
	this.renderer.clear(color);
};

Scene.prototype.draw = function () {

	// var data = this.getDataInView();
	var bounds = this.getViewBounds();

	// Draw terrain
	var tile, i, r, c,
		cornerConfig, edgeConfig;
	var startX = bounds.left;
	var startY = bounds.top;
	var endX = bounds.right;
	var endY = bounds.bottom;

	// 1. Draw background(s)
	// 2. Draw wall tiles
	// 3. Draw tiles
	// 4. Draw entities
	// 5. Draw tile transitions
	// 6. Draw effects
	// TODO: lighting
	
	// TODO: only loop over layers with visible elements
	for (i = 0; i < this.world.layers.length; i++) {
		layer = this.world.layers[i];

		for (r = startY; r < endY; r++) {
			for (c = startX; c < endX; c++) {
				// Skip if 0 (no tile)
				if (!layer.tileExists(c, r)) continue;

				tile = layer.getTile(c, r);

				// Paint tile
				this.renderer.paintTile(this, layer.tileData.texture, tile, c, r);
			}
		}

		if (layer.hasEdges || layer.hasCorners) {
			// Decorations
			for (r = startY; r < endY; r++) {
				for (c = startX; c < endX; c++) {
					if (layer.hasEdges) {
						// Paint edges
						edgeConfig = layer.getEdge(c, r);
						this.renderer.paintTile(this, layer.tileData.texture + layer.tileData.edges, edgeConfig, c, r);
					}
					if (layer.hasCorners) {
						// Paint corners
						cornerConfig = layer.getCorner(c, r);
						this.renderer.paintTile(this, layer.tileData.texture + layer.tileData.corners, cornerConfig, c, r);
					}
				}
			}
		}
	}
};

Scene.prototype.centerAt = function (x, y) {
	this.viewBox[0] = x - this.viewBox[2] / 2;
	this.viewBox[1] = y - this.viewBox[3] / 2;
};

// Scene.prototype.getDataInView = function () {
// 	var k = this.world.tileSize * this.scale;
// 	var tileX = Math.floor(this.viewBox[0] / k),
// 		tileY = Math.floor(this.viewBox[1] / k);
// 	var endX = tileX + Math.ceil(this.viewBox[2] / k) + 1,
// 		endY = tileY + Math.ceil(this.viewBox[3] / k) + 1;
// 	var data = [];
// 	var layer, i, x, y;
// 	var numLayers = this.world.layers.length;

// 	// var layer = this.world.layers[0];
// 	for (i = 0; i < numLayers; i++) {
// 		layer = this.world.layers[i];
// 		for (x = tileX; x < endX; x++) {
// 			for (y = tileY; y < endY; y++) {
// 				data.push(layer.getTile(x, y));
// 			}
// 		}
// 	}
// 	return ndarray(data, [endX - tileX, endY - tileY, numLayers]);
// };

Scene.prototype.getViewBounds = function () {
	var k = this.world.tileSize * this.scale;
	var tileX = Math.floor(this.viewBox[0] / k),
		tileY = Math.floor(this.viewBox[1] / k);
	var endX = tileX + Math.ceil(this.viewBox[2] / k) + 1,
		endY = tileY + Math.ceil(this.viewBox[3] / k) + 1;

	return { left: tileX, top: tileY, right: endX, bottom: endY };
};

module.exports = Scene;
