define([
	"jquery-ui",
	"views/tileset_view"
], function($, TilesetView) {

	var Tilesets = {}, Editor;
	Tilesets.collection = {};

	Tilesets.initialize = function(namespace) {
		Editor = namespace;
		this.view = TilesetView.initialize(Editor);

		this.add("img/tilesets/mage_city.png", {
			tilesize: {
				width: 32,
				height: 32
			},

			margin: null,
			alpha: null
		});

		return this;
	};

	Tilesets.set = function(name) {
		$("#tileset_container").css({
			width: Tilesets.collection[name].width,
			height: Tilesets.collection[name].height,
			backgroundImage: "url('" + Tilesets.collection[name].base64 + "')"
		});

		$("#tilesets select option").removeAttr("selected", true);
		$("#tilesets select option:contains(" + name + ")").removeAttr("selected", true);
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