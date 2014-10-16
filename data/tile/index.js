/* Tile Data Declarations
 * Coordinates the various game subsystems
 */

var Tile = {};

Tile.BlueBlock = {
	id: 1,
	name: "Blue Block",
	precedence: 10,
	solid: true,
	isPipe: true,
	hasAnimation: false,
	randomSetLength: 1,
	edges: 1,
	corners: 2,
	texture: 2,
	sound: {}
};

Tile.WoodPanel = {
	id: 2,
	name: "Wood Panel",
	precedence: 8,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 2,
	edges: 1,
	corners: 0,
	texture: 4,
	sound: {}
};

Tile.Concrete = {
	id: 3,
	name: "Concrete",
	precedence: 6,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 4,
	texture: 6,
	edges: 1,
	corners: 0,
	sound: {}
};

Tile.MetalPlate = {
	id: 4,
	name: "Metal Plate",
	precedence: 0,
	solid: true,
	isPipe: true,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 8,
	edges: 0,
	corners: 0,
	sound: {}
};

Tile.Water = {
	id: 5,
	name: "Water",
	precedence: 0,
	solid: false,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 11,
	edges: 0,
	corners: 0,
	sound: {}
};

Tile.Sapphire = {
	id: 6,
	name: "Sapphire",
	precedence: 100,
	solid: true,
	isPipe: false,
	hasAnimation: false,
	randomSetLength: 1,
	texture: 9,
	edges: 1,
	corners: 0,
	sound: {}
};

module.exports = Tile;
