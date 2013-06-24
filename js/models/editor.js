define([
	"jquery-ui", 
	"models/menubar",
	"models/canvas",
	"models/tilesets",
	"models/layers",
	"models/export",
], function($, Menubar, Canvas, Tilesets, Layers, Export) {

	var Editor = {}; 

	Editor.config = {
		// TODO save current tileset/layer here
	};

	Editor.mousedown = false;
	Editor.selection = null;

	Editor.Menubar = Menubar.initialize(Editor);
	Editor.Canvas = Canvas.initialize(Editor);
	Editor.Tilesets = Tilesets.initialize(Editor);
	Editor.Layers = Layers.initialize(Editor);
	Editor.Export = Export.initialize(Editor);

	Editor.initialize = function() {

		$("#toolbar").resizable({
			minWidth: 250,
			mouseButton: 1,
			handles: "w",
			alsoResize: "#tileset, #tileset .jspPane, #tileset .jspContainer, #tileset .jspHorizontalBar *",
			stop: function() { $("#tileset").jScrollPane(); }
		});

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

		// Global mouse status
		$(document).on("mousedown mouseup", function(e) {
			Editor.mousedown = e.type == "mousedown" && e.which == 1;
		});

		$("#tileset, #canvas_wrapper").disableSelection();

		Editor.Layers.add(null, "background");
		Editor.Layers.add(null, "world");

		$("#loading_screen").delay(500).fadeOut();
	};

	return Editor;
});