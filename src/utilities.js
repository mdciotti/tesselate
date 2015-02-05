/* Utility Functions
 * Helpers and manipulators used throughout the codebase
 */

var util = {};

util.flooredDivision = function (a, n) {
	return a - n * Math.floor(a / n);
}

/* Linear Congruential Generator */
util.LCG = function (seed, m) {
	this.m = m ? (m | 0) : 1023;
	this.a = 214013;
	this.c = 2531011;
	seed = seed ? (seed | 0) : ((Math.random() * this.m) | 0);
	this.value = seed;
	this.next();
};

util.LCG.prototype.rand = function (seed) {
	seed = seed ? seed : this.value;
	return ((seed * this.a + this.c) & this.m);
};

util.LCG.prototype.next = function () {
	this.value = this.rand(this.value);
	// return this.rand(this.value);
	return this.value;
};

/* XML Http Request Handler */
util.XHR = function (url, mime, callback) {
	var req = new XMLHttpRequest;
	if (arguments.length < 3) callback = mime, mime = null;
	else if (mime && req.overrideMimeType) req.overrideMimeType(mime);
	req.open("GET", url, true);
	if (mime) req.setRequestHeader("Accept", mime);
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			var s = req.status;
			callback(!s && req.response || s >= 200 && s < 300 || s === 304 ? req : null);
		}
	};
	req.send(null);
};

util.hasProp = function (obj, prop) {
	// return obj.hasOwnProperty(prop); // Works for non-prototyped properties
	// return prop in obj; // Works for all properties
	return !!obj[prop]; // Seems to work fastest
}

module.exports = util;
