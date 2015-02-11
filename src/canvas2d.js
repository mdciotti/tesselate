/* Canvas 2D Renderer Class
 * Provides methods to render the game onto an HTML5 canvas
 */

var util = require('./utilities.js');
var _ = require('underscore');

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
	var k = world.tileSize * scene.scale;
	var sourceX = world.tileSize * tileX,
		sourceY = world.tileSize * tileY;
	var destX = -scene.viewBox[0] + x * k,
		destY = -scene.viewBox[1] + y * k;

	// TODO: actually load correct tile set?
	var img = world.tileSets[0].image;
	this.context.drawImage(img, sourceX, sourceY, world.tileSize, world.tileSize, destX, destY, k, k);
};

Canvas2DRenderer.prototype.clear = function (color) {	
	this.context.fillStyle = color || "#000000";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2DRenderer.prototype.drawText = function (str, x, y, opts) {
	this.context.save();
	if (typeof opts === "undefined") { opts = {}; }
	opts = _.defaults(opts, {
		fontSize: 16,
		fontFamily: "monospace",
		color: "#ffffff",
		baseline: "top",
		align: "left",
		backgroundColor: "#000000",
		backgroundOpacity: 0,
		backgroundPadding: 0
	});
	// TODO: assert options are valid
	this.context.font = opts.fontSize + "px " + opts.fontFamily;
	this.context.textBaseline = opts.baseline;
	this.context.textAlign = opts.align;
	if (opts.backgroundOpacity > 0) {
		this.context.save();
		var bp = opts.backgroundPadding;
		var textMetrics = this.context.measureText(str);
		this.context.globalAlpha = opts.backgroundOpacity;
		this.context.fillStyle = opts.backgroundColor;
		this.context.fillRect(x - bp, y - bp, textMetrics.width + bp*2, opts.fontSize + bp*2);
		this.context.restore();
	}
	this.context.fillStyle = opts.color;
	this.context.fillText(str, x, y);
	this.context.restore();
};

Canvas2DRenderer.prototype.drawPlainText = function (strings, x, y, opts) {
	this.context.save();
	if (typeof opts === "undefined") { opts = {}; }
	opts = _.defaults(opts, {
		fontSize: 16,
		fontFamily: "monospace",
		color: "#ffffff"
	});
	// TODO: assert options are valid
	this.context.font = opts.fontSize + "px " + opts.fontFamily;
	this.context.fillStyle = opts.color;
	strings.forEach(function (str, i) {
		this.context.fillText(str, x, y + (i + 1) * opts.fontSize);
	}.bind(this));
	this.context.restore();
};

module.exports = Canvas2DRenderer;
