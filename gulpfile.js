var gulp = require('gulp');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('webserver', function () {
	connect.server();
});

gulp.task('browserify', ['webserver'], function () {
	var bundleStream = browserify('./src/main.js', { debug: true }).bundle();

	bundleStream
		.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(source('./src/main.js'))
			// .pipe(streamify(uglify()))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build'));
});

gulp.task('default', ['webserver'], function () {
	gulp.src('./src/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(concat('game.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build'))
});
