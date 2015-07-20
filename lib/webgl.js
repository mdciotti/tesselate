/* WebGL Renderer Module
 * Provides methods to render the game onto an HTML5 canvas
 */

// var glslify = require('glslify');

// var createShader = glslify({
// 	vertex: './vertex.glsl',
// 	fragment: './fragment.glsl'
// });

var WebGLRenderer = function () {
	// initialize renderer

	console.log("initializing webgl...");
	
	this.canvas = document.createElement("canvas");
	this.canvas.width = null;
	this.canvas.height = null;
	this.gl = this.canvas.getContext("webgl");
	document.body.appendChild(this.canvas);

	// TODO: are there WebGL equivalents of the Canvas save/restore context API?
	// Empty stubs for now
	// this.saveContext = function () {};
	// this.restoreContext = function () {};

	if (!this.gl) {
		this.gl = null;
		console.error("Failed to initialize WebGL");
		return;
	}

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Load vertex and fragment shaders
	var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
	this.gl.shaderSource(vertexShader, [
		"attribute vec4 aVTCoord;",
		"varying vec2 vTextureCoord;",
		"void main(void) {",
		"	vTextureCoord = aVTCoord.zw;",
		"	gl_Position.zw = vec2(1.0, 1.0);",
		"	gl_Position.xy = aVTCoord.xy;",
		"}"].join("\n"));
	this.gl.compileShader(vertexShader);
	if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
		var msg = this.gl.getShaderInfoLog(vertexShader);
		console.error("Error while compiling vertex shader: " + msg);
	}

	var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	this.gl.shaderSource(fragmentShader, [
		"#ifdef GL_ES",
		"precision highp float;",
		"#endif",
		"varying vec2 vTextureCoord;",
		"uniform sampler2D uSampler;",
		"void main(void) {",
		"	gl_FragColor = texture2D(uSampler, vTextureCoord);",
		"}"].join("\n"));
	this.gl.compileShader(fragmentShader);
	if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
		var msg = this.gl.getShaderInfoLog(fragmentShader);
		console.error("Error while compiling fragment shader:\n" + msg);
	}

	// Link shaders and create program
	this.program = this.gl.createProgram();
	this.gl.attachShader(this.program, vertexShader);
	this.gl.attachShader(this.program, fragmentShader);
	this.gl.linkProgram(this.program);

	if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
		console.error("Failed to initialize the shader program");
	}

	this.gl.useProgram(this.program);
	this.program.VTCoordAttribute = this.gl.getAttribLocation(this.program, "aVTCoord");
	this.gl.enableVertexAttribArray(this.program.VTCoordAttribute);

	this.program.samplerUniform = this.gl.getUniformLocation(this.program, "uSampler");

	// TODO: manage multiple textures (maybe integrate with tileset.js or graphics.js)
	this.textures = [];

	// Buffer data
	this.positionBuffer = this.gl.createBuffer();

	// NOTE: using a generic untyped array to add an unknown amount of items
	// and then converting to a typed array. Is this efficient?
	this.vtCoordinates = [];
};

WebGLRenderer.prototype.loadTileset = function (tileset) {
	// Load texture
	this.textures.push(this.gl.createTexture());
	var texture = this.textures[this.textures.length - 1];
	texture.image = tileset.image;

	// Handle loaded texture
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
	// this.gl.generateMipmap(this.gl.TEXTURE_2D);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

WebGLRenderer.prototype.setSize = function (width, height) {
	this.canvas.width = width;
	this.canvas.height = height;
	this.gl.viewport(0, 0, width, height);
};

WebGLRenderer.prototype.paintTile = function (scene, tileY, tileX, x, y) {
	// TODO: pass in tileset/texture ID
	var texture = this.textures[this.textures.length - 1];

	var kx = scene.map.tileWidth * scene.scale / (this.canvas.width / 2),
		ky = scene.map.tileHeight * scene.scale / (this.canvas.height / 2);
	var destX = -scene.viewBox[0] / (this.canvas.width / 2) + x * kx - 1,
		destY = scene.viewBox[1] / (this.canvas.height / 2) - (y+1) * ky + 1;
	var textureW = scene.map.tileWidth / texture.image.width,
		textureH = scene.map.tileHeight / texture.image.height;
	var textureX = tileX * textureW,
		textureY = 1 - (tileY + 1) * textureH;
	
	// Vertex and texture coordinates are stored in vec4: first two coordinates
	// are for the vertex, while the second two coordinates are for the texture

	if (!this.firstVertex) {
		// Create a degenerate strip between the previous quad and this one
		this.vtCoordinates[this.vIndex] = this.vtCoordinates[this.vIndex - 4];
		++this.vIndex;
		this.vtCoordinates[this.vIndex] = this.vtCoordinates[this.vIndex - 4];
		++this.vIndex;
		this.vtCoordinates[this.vIndex++] = 0;
		this.vtCoordinates[this.vIndex++] = 0;

		// Top left
		this.vtCoordinates[this.vIndex++] = destX;
		this.vtCoordinates[this.vIndex++] = destY + ky;
		this.vtCoordinates[this.vIndex++] = 0;
		this.vtCoordinates[this.vIndex++] = 0;
	} else {
		this.firstVertex = false;
	}

	// Top left
	this.vtCoordinates[this.vIndex++] = destX;
	this.vtCoordinates[this.vIndex++] = destY + ky;
	this.vtCoordinates[this.vIndex++] = textureX;
	this.vtCoordinates[this.vIndex++] = textureY + textureH;
	
	// Bottom left
	this.vtCoordinates[this.vIndex++] = destX;
	this.vtCoordinates[this.vIndex++] = destY;
	this.vtCoordinates[this.vIndex++] = textureX;
	this.vtCoordinates[this.vIndex++] = textureY;

	// Top right
	this.vtCoordinates[this.vIndex++] = destX + kx;
	this.vtCoordinates[this.vIndex++] = destY + ky;
	this.vtCoordinates[this.vIndex++] = textureX + textureW;
	this.vtCoordinates[this.vIndex++] = textureY + textureH;
	
	// Bottom right
	this.vtCoordinates[this.vIndex++] = destX + kx;
	this.vtCoordinates[this.vIndex++] = destY;
	this.vtCoordinates[this.vIndex++] = textureX + textureW;
	this.vtCoordinates[this.vIndex++] = textureY;
};

WebGLRenderer.prototype.clear = function (color) {
	// TODO: set clear color to parameter value
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

WebGLRenderer.prototype.drawText = function (str, x, y, opts) {

};

WebGLRenderer.prototype.drawPlainText = function (strings, x, y, opts) {

};

WebGLRenderer.prototype.preDraw = function () {
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[this.textures.length - 1]);
	this.gl.uniform1i(this.program.samplerUniform, 0);

	this.vIndex = 0;
	this.firstVertex = true;
	this.vtCoordinates = [];
};

WebGLRenderer.prototype.postDraw = function () {
	var data = new Float32Array(this.vtCoordinates);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STREAM_DRAW);
	this.positionBuffer.itemSize = 4;
	this.positionBuffer.numItems = this.vtCoordinates.length / this.positionBuffer.itemSize;
	this.gl.vertexAttribPointer(this.program.positionAttribute, this.positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.positionBuffer.numItems);
};

module.exports = WebGLRenderer;
