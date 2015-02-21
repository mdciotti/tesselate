/* WebGL Renderer Module
 * Provides methods to render the game onto an HTML5 canvas
 */

 var shell = require('gl-now')();
 var glslify = require('glslify');

var createShader = glslify({
	vertex: './vertex.glsl',
	fragment: './fragment.glsl'
});

var program;

shell.on('shell-init', function () {
	program = createShader(shell.gl);
});

var WebGLRenderer = function () {
	// initialize renderer
};

WebGLRenderer.prototype.setSize = function (width, height) {
	
};

WebGLRenderer.prototype.paintTile = function (scene, ) {
	
};

WebGLRenderer.prototype.clear = function (color) {
	
};

WebGLRenderer.prototype.setSize = function (width, height) {
	
};


