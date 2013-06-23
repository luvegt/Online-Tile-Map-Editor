(function() {
	var left = (window.innerWidth / 2) - 250;
	var top = (window.innerHeight / 2) - 300;

	// Center canvas before initializing
	$("<style>#container { top: " + top + "px; left: " + left + "px; }</style>").appendTo("head");
})();

window.onload = function() {

	$(':not(input,select,textarea,#container)').disableSelection();

	// Makes each section inside the toolbar collapsible
	$("#toolbar section > h2").collapsible({
		// custom scrollbars fail if closed
		defaultOpen: 'section1,section2,section3',
		cssClose: 'collapsed',
		cssOpen: '',
		speed: 200,
		animateOpen: function(elem, opts) { elem.next().slideUp(opts.speed, function() { $("#toolbar").jScrollPane(); }); },
		animateClose: function(elem, opts) { elem.next().slideDown(opts.speed, function() { $("#toolbar").jScrollPane(); }); }
	});

	// Initialize toolbar scrollbars and keep them updated
	$(window).on("resize", function() { $("#toolbar").jScrollPane(); });
	$("#toolbar").jScrollPane();

	// Global mouse state variable
	$(document).on("mousedown", function(e) {
		if (e.which == 1)
		{ window.mousedown = true; }
	}).on("mouseup", function(e) {
		if (e.which == 1)
		{ window.mousedown = false; }
	});

	init();
}

function init() {

	// Initialize global settings
	var settings = new SettingsModel;
	var settings_view = new SettingsView({ model: settings });

	// settings_view is needed to update checkbox menubar items
	var menubar = new MenuBarModel({ settings_view: settings_view });
	var menubar_view = new MenuBarView({ model: menubar });

	var layer_view = new LayerCollectionView;
	var tileset_view = new TilesetCollectionView;
	var canvas = new CanvasModel({ tileset_view: tileset_view, layer_view: layer_view });
	var canvas_view = new CanvasView({ model: canvas });
}