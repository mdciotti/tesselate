/* Canvas 2D Renderer Class
 * Provides methods to render the game onto an HTML5 canvas
 */

var Tile = require('../data/tile/index.js');
var util = require('./utilities.js');

// Sets image smoothing property on canvas context
function setImageSmoothing(context, state) {
	makePrefixArray('imageSmoothingEnabled', ['moz', 'o'])
		.forEach(function (prop) {
			if (prop in context) context[prop] = state;
		});
}

// High dpi screen (BackingStorePixelRatio, only in Safari so far)
function hasBSPRGreaterThanOne(context) {
	var prefixedProperties = makePrefixArray('backingStorePixelRatio', ['moz', 'webkit', 'o']);
	var prop;

	for (var i = 0, l = prefixedProperties.length; i < l; i++) {
		prop = prefixedProperties[i];
		if ((prop in context) && context[prop] > 1) return true;
	}
	return false;
}

// Creates an array of vendor-prefixed properties (JS)
function makePrefixArray(propName, prefixes) {
	var prefixedProperties = prefixes.map(function (prefix) {
		return prefix + propName[0].toUpperCase() + propName.slice(1);
	});
	prefixedProperties.unshift(propName);
	return prefixedProperties;
}

// Creates an array of vendor-prefixed properties (CSS)
function makeCSSPrefixArray(propName) {
	var prefixedProperties = ['moz', 'webkit', 'o'].map(function (prefix) {
		return '-' + prefix + '-' + propName;
	});
	prefixedProperties.unshift(propName);
	return prefixedProperties;
}

// Returns the value of the property for any vendor prefix
function normalizePrefixedValue(obj, propName) {
	var prefixedProperties = makePrefixArray(propName);
	var prop;
	for (var i = 0; i < prefixedProperties.length; i++) {
		prop = prefixedProperties[i];
		if (prop in obj) return obj[prop];
	}
	return undefined;
}

// Sets a vendor-prefixed CSS property
function setCSSPrefixedValue(el, propName, valueName) {
	var prefixedProps = makePrefixArray(propName);
	var prefixedVals = makeCSSPrefixArray(valueName);
	var prop, val;
	for (var i = 0, l = prefixedProps.length; i < l; i++) {
		prop = prefixedProps[i];
		if (prop in el.style) {
			el.style[prop] = prefixedVals[i];
			// console.log(prop, prefixedVals[i]);
			return;
		}
	}
}

// Forces crisp pixel rendering
function disableImageSmoothing(context) {
	// Thanks to Dominic Szablewski (http://phoboslab.org/log/2012/09/drawing-pixels-is-hard)
	if (hasBSPRGreaterThanOne(context)) {
		console.log('High DPI screen detected, using CSS scaling');
		var pxRatio = normalizePrefixedValue(context, 'backingStorePixelRatio');
		context.canvas.width /= pxRatio;
		context.canvas.height /= pxRatio;
		// context.canvas.style.webkitImageRendering = "-webkit-crisp-edges";
		setCSSPrefixedValue(context.canvas, 'imageRendering', 'crisp-edges');
		context.canvas.style.width *= pxRatio;
		context.canvas.style.height *= pxRatio;
	}
	setImageSmoothing(context, false);
	// For IE, use internal scaling method
}

var Canvas2DRenderer = function () {
	this.canvas = document.createElement("canvas");
	this.canvas.width = null;
	this.canvas.height = null;
	document.body.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	// this.setSize(600, 400);
};

Canvas2DRenderer.prototype.setSize = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
	disableImageSmoothing(this.context);
};

Canvas2DRenderer.prototype.paintTile = function (scene, tileY, tileX, x, y) {
	var world = scene.world;
	var offsetX = scene.viewBox[0] % world.tileSize,
		offsetY = scene.viewBox[1] % world.tileSize;
	var k = world.tileSize * scene.scale,
		sourceX = world.tileSize * tileX,
		sourceY = world.tileSize * tileY,
		destX = -offsetX * scene.scale + x * k,
		destY = -offsetY * scene.scale + y * k;

	// TODO: actually load correct tile set?
	var img = world.tileSets[0].image;
	this.context.drawImage(img, sourceX, sourceY, world.tileSize, world.tileSize, destX, destY, k, k);
	// if (tileY) {
	// 	this.context.fillStyle = "#ff00ff";
	// 	this.context.fillRect(destX, destY, k, k);
	// }
};

Canvas2DRenderer.prototype.clear = function (color) {	
	this.context.fillStyle = color || "#000000";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2DRenderer.prototype.draw = function (scene) {
	
	this.clear("#000000");

	// TODO: expect data to be ndarray
	var data = scene.getDataInView();

	// Draw terrain
	var tile, column, cornerConfig, seed,
		rows = data.length,
		cols = data[0].length;

	// TODO: actually load correct layer
	var layer = scene.world.layers[0];

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
	
	// TODO: actually load proper tile data
	tileData = Tile.WoodPanel;

	// TODO: switch to layer.iterate(function (tile, c, r) {});
	for (r = 0; r < rows; r++) {
		for (c = 0; c < cols; c++) {
			tile = data[r][c];

			// Skip if void
			if (tile === 0 || typeof tile === "undefined") continue;

			// Choose correct column
			if (tileData.isPipe) {
				column = layer.edgeConfig(c, r);
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
			this.paintTile(scene, tileData.texture, column, c, r);
		}
	}

	var hasEdges = util.hasProp(tileData, "edges") && tileData.edges > 0;
	var hasCorners = util.hasProp(tileData, "corners") && tileData.corners > 0;

	if (hasEdges || hasCorners) {
		// Decorations
		for (r = 0; r < rows; r++) {
			for (c = 0; c < cols; c++) {
				tile = data[r][c];
				edgeConfig = layer.edgeConfig(c, r);

				if (tile === 0) {
					if (hasEdges) {
						// Paint edges
						// world.layer['transition'].storeData(c, r, tileData.texture, edgeConfig);
						this.paintTile(scene, tileData.texture + tileData.edges, edgeConfig, c, r);
					}
					if (hasCorners) {
						// Paint corners
						cornerConfig = layer.cornerConfig(c, r);
						this.paintTile(scene, tileData.texture + tileData.corners, cornerConfig, c, r);
					}
				}
			}
		}
	}
};

module.exports = Canvas2DRenderer;
