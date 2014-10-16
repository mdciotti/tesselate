/* Scene Class
 * Stores copy of viewable world terrain and caches transitions
 */

var World = require('./world.js');

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
	this.scale = n;
};

Scene.prototype.draw = function () {
	this.renderer.draw(this);
};

Scene.prototype.centerAt = function (x, y) {
	this.viewBox[0] = x - this.viewBox[2] / 2;
	this.viewBox[1] = y - this.viewBox[3] / 2;
};

Scene.prototype.getDataInView = function () {
	var k = this.world.tileSize * this.scale;
	var tileX = Math.floor(this.viewBox[0] / this.world.tileSize),
		tileY = Math.floor(this.viewBox[1] / this.world.tileSize);
	var endX = tileX + Math.ceil(this.viewBox[2] / k) + 1,
		endY = tileY + Math.ceil(this.viewBox[3] / k) + 1,
		data = [],
		y, x, yData;

	for (y = tileY; y < endY; y++) {
		yData = [];
		for (x = tileX; x < endX; x++) {
			yData.push(this.world.getTile(x, y));
		}
		data.push(yData);
	}
	return data;
};

module.exports = Scene;
