define([
	"jquery-ui", 
	"modules/utils",
	"modules/menubar",
	"modules/tools",
	"modules/canvas",
	"modules/tilesets",
	"modules/layers",
	"modules/export",
], function($, Utils, Menubar, Tools, Canvas, Tilesets, Layers, Export) {

	var Editor = {}; 

	Editor.tool = "draw";
	Editor.keystatus = {};
	Editor.mousedown = false;
	Editor.selection = null;

	Editor.Utils = Utils.initialize(Editor);
	Editor.Menubar = Menubar.initialize(Editor);
	Editor.Tools = Tools.initialize(Editor);
	Editor.Canvas = Canvas.initialize(Editor);
	Editor.Tilesets = Tilesets.initialize(Editor);
	Editor.Layers = Layers.initialize(Editor);
	Editor.Export = Export.initialize(Editor);

	Editor.initialize = function() {

		// Menubar interaction
		$("#menubar > li").on("click mouseover", function(e) {
			if (e.type == "mouseover" && !$("#menubar > li.open").length) { return; }
			$("#menubar > li").removeClass("open");
			$(e.currentTarget).addClass("open");
		});

		$("body").on("mousedown", function(e) {
			if (!$("#menubar").find(e.target).length) {
				$("#menubar > li").removeClass("open");
			}
		});

		// Make toolbar resizable
		$("#toolbar").resizable({
			minWidth: 250,
			mouseButton: 1,
			handles: "e",
			alsoResize: "#tileset, #tileset .jspPane, #tileset .jspContainer, #tileset .jspHorizontalBar *",
			stop: function() { $("#tileset").jScrollPane(); }
		});

		// Global mouse status
		$(document).on("mousedown mouseup", function(e) {
			Editor.mousedown = e.type == "mousedown" && e.which == 1;
		});

		// Global input status
		$(document).on("keydown keyup", function(e) {
			var c = e.keyCode, down = e.type == "keydown";
			
			if (e.altKey) { Editor.keystatus.altKey = down; }
			if (e.ctrlKey) { Editor.keystatus.ctrlKey = down; }
			if (e.shiftKey) { Editor.keystatus.shiftKey = down; }
			if (c == 32) { Editor.keystatus.spacebar = down; }
		});

		// Disable selection
		$("#tileset, #canvas_wrapper").disableSelection();

		// Hide the loading screen
		$("#loading_screen").delay(500).fadeOut();
	};

	return Editor;
});