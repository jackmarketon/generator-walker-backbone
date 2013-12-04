/* globals app */
define([
	// Path aliases defined in main.js
	'jquery',
	'underscore',
	'backbone',
	// Put Initial Router Here
	'routers/router',
	// No Variable Packages
], function($, _, Backbone, Router) {
	'use strict';
	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		Router.initialize();
	};

	return {
		initialize: initialize
	};
});