define([
	"jquery-ui",
	"views/tileset_view"
], function($, TilesetView) {

	var Tilesets = {}, Editor;
	Tilesets.collection = {};

	Tilesets.initialize = function(namespace) {

		Editor = namespace;
		this.view = TilesetView.initialize(Editor);

		// this.add("img/tilesets/forest_tiles.png", {
		// 	tilesize: { width: 16, height: 16 },
		// 	alpha: "#F0F"
		// });

		this.add("img/tilesets/mage_city.png", {
			tilesize: { width: 32, height: 32 }
		});

		return this;
	};

	Tilesets.set = function(name) {

		var tileset = Tilesets.collection[name];

		$("#tileset_container").css({
			width: tileset.width,
			height: tileset.height,
		}).attr("class", "ts_" + tileset.id);

		$("#tilesets select option").removeAttr("selected");
		$("#tilesets select option:contains(" + name + ")").attr("selected", true);
		$("#tilesets .loading").remove();
	}

	Tilesets.add = function(src, opts) {

		var img = new Image(),
		    ctx = document.createElement("canvas").getContext("2d"),
		    name = opts.name || src.match(/(?:.+)\/([^\/]+)/)[1],
		    style = style = document.createElement("style"),
		    id = name.replace(/[^a-zA-Z]/g, '_'), css;

		img.src = src;
		img.addEventListener("load", function() {

			ctx.canvas.width = opts.width = this.width;
			ctx.canvas.height = opts.height = this.height;
			ctx.drawImage(this, 0, 0);
			
			opts.base64 = ctx.canvas.toDataURL();
			opts.id = id;
			opts.url = opts.name ? undefined : src;
			opts.name = name;

			Tilesets.collection[name] = opts;
			Tilesets.set(name);

			$(style).attr("id", "tileset_" + id);

			css = ".ts_" + id + " {\n";
			css += "\twidth: " + opts.tilesize.width + "px;\n";
			css += "\theight: " + opts.tilesize.height + "px;\n";
			css += "\tbackground-image: url('" + opts.base64 + "');\n";
			css += "}";

			$(style).append(css);
			$("head").append(style);
			$("#tilesets select").append("<option selected>" + name + "</option>");
			$("#tileset").jScrollPane();
			Editor.Canvas.update_grid();

		}, false);
	};

	Tilesets.get_active = function() { return Tilesets.collection[$("#tilesets select option:selected").val()]; }

	return Tilesets;
});