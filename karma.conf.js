/*
 * angular-mixpanel
 *
 * Copyright (c) 2014 "kuhnza" David Kuhn
 * Licensed under the MIT license.
 * https://github.com/kuhnza/angular-mixpanel/blob/master/LICENSE
 */
 
'use strict';

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		logLevel: 'INFO',
		browsers: ['PhantomJS2'],
		autoWatch: true,
		reporters: ['progress', 'coverage'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/mixpanel/mixpanel-jslib-snippet.min.js',
			'src/**/*.js',
			'test/**/*.js'
		],
		preprocessors: {
			'src/**/*.js': 'coverage'
		},
		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		}
	});
};
