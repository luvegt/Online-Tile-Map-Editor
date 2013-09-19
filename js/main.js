/*!
 Online Tile Map Editor (https://github.com/elias94xx/Online-Tile-Map-Editor)
 Copyright 2012-2013 Elias Schütt <contact@elias-schuett.de>
 Open source under the MIT or CC-BY-SA license.
*/

require.config({

	baseUrl: "js",

	shim: {
		"jquery-ui": {
			exports: "$",
			deps: ["jquery", "jquery.mousewheel", "jquery.jscrollpane"]
		},

		"underscore": {
			exports: "_"
		},

		"jquery.draggable": {
			deps: ["jquery-ui"]
		}
	},

	paths: {
		"jquery": "libs/jquery",
		"jquery-ui": "libs/jquery-ui",
		"jquery.mousewheel": "plugins/jquery.mousewheel",
		"jquery.jscrollpane": "plugins/jquery.jscrollpane",
		"jquery.draggable": "plugins/jquery.draggable",

		"underscore": "libs/underscore",
		"text": "plugins/text",
		"templates": "../templates"
	}
});

require(["jquery", "modules/editor"], function($, Editor) {
	$(document).ready(function() {
		Editor.initialize();
	});
});