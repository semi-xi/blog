var gulp    = require('gulp'),
	plugins = require('gulp-load-plugins')();

require('./tasks/gulpfile-dev')(gulp, plugins)
require('./tasks/gulpfile-build')(gulp, plugins)
