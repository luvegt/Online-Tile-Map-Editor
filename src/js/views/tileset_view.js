define(function() {

	var TilesetView = {}, Editor;

	TilesetView.config = {
		filetypes: ["png", "jpg", "jpeg"]
	};

	TilesetView.tmp = {};

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	TilesetView.initialize = function() {

		Editor = require("editor");

		// Tileset UI functionality
		Editor.$("body").on("change", "#tilesets select", this.changeTileset)
		         .on("change", "input[name=file]", this.cacheFile)
		         .on("click",  "#tilesets_add",    this.add)
		         .on("click",  "#tilesets_remove", this.remove);

		Editor.$("#tileset_container").on("mousedown mouseup mousemove", this.makeSelection);
		Editor.$("#tileset_remove").on("click", this.remove);
	};

	/* ================= */
	/* ====== ADD ====== */
	/* ================= */

	// Todo disallow mixing different tilesizes

	TilesetView.add = function(e) {

		var opts = {

			tilesize: {
				width: +Editor.$("#dialog input[name=tile_width]").val(),
				height: +Editor.$("#dialog input[name=tile_height]").val()
			},

			margin: +Editor.$("#dialog input[name=tile_margin]").val(),
			alpha: Editor.$("#dialog input[name=tile_alpha]").val()

		}, hex = opts.alpha.match(/^#?(([0-9a-fA-F]{3}){1,2})$/), type, data;
		
		// Parse HEX to rgb
		if (hex && hex[1]) {
			hex = hex[1];

			if (hex.length == 3) {
				opts.alpha = [
					parseInt(hex[0]+hex[0], 16),
					parseInt(hex[1]+hex[1], 16),
					parseInt(hex[2]+hex[2], 16)
				];
			} else if (hex.length == 6) {
				opts.alpha = [
					parseInt(hex[0]+hex[1], 16),
					parseInt(hex[2]+hex[3], 16),
					parseInt(hex[5]+hex[6], 16)
				];
			}

		// Parse RGB
		} else if (opts.alpha.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])(, ?|$)){3}$/)) {
			opts.alpha = _.map(opts.alpha.split(","), function(num) { return parseInt(num, 10); });
		} else { opts.alpha = null; }

		// Editor.$("#loading").show();

		// URL or FileReader event
		if (!window.FileReader) {
			data = TilesetView.tmp.match(/.+\/(.+)\.(.+)/);
			opts.name = data[1];
			type = data[2].toLowerCase();
		} else {
			opts.name = TilesetView.tmp.name;
			type = TilesetView.tmp.type.split("/")[1];
		}

		// Wrong file type
		if (TilesetView.config.filetypes.indexOf(type.toLowerCase()) == -1) {
			alert("Wrong file type in \"" + opts.name + "\"\nSupported file types: " + TilesetView.config.filetypes.join(", "));
			//Editor.$("#loading").hide();

		// Tileset does already exist
		} else if (Editor.$("#tilesets select option:contains(" + opts.name + ")").length) {
			alert("File \"" + opts.name + "\" does already exist.");
			//Editor.$("#loading").hide();

		// Process tileset
		} else {
			if (window.FileReader) {
				var reader = new FileReader();
				reader.readAsDataURL(TilesetView.tmp);
				reader.onload = function(e) { TilesetView.process(e, opts) };
			} else { TilesetView.process(null, opts); }
		}
	};

	/* ==================== */
	/* ====== REMOVE ====== */
	/* ==================== */

	TilesetView.remove = function() {

		var tileset = Editor.activeTileset;

		if (!confirm("This will remove all tiles associated with \"" + tileset.name + "\", continue?")) { return; }
		
		Editor.$("style#tileset_" + tileset.id).remove();
		Editor.$("#tiles div.ts_" + tileset.id).remove();
		Editor.$(".layer[data-tileset='" + tileset.name + "']").removeAttr("data-tileset");
		Editor.$("#tilesets select option:selected").remove();

		delete Editor.Tilesets.collection[tileset.name];

		Editor.$("#tileset_container").css({
			width: 0,
			height: 0
		});

		if (Editor.$("#tilesets select option").length) {
			var name = Editor.$("#tilesets select option:eq(0)").html()

			// TODO active previous tileset not the first one
			Editor.$("#tilesets select option").removeAttr("selected");
			Editor.$("#tilesets select option:eq(0)").attr("selected", true);
			Editor.Tilesets.set(name);
		}
	};

	/* ============================ */
	/* ====== CHANGE TILESET ====== */
	/* ============================ */

	TilesetView.changeTileset = function(e) {
		var name = Editor.$("#tilesets select option:selected").html();

		Editor.Tilesets.set(name);
		Editor.Tilesets.resetSelection();
		Editor.Canvas.updateGrid();
	};

	/* ===================== */
	/* ====== PROCESS ====== */
	/* ===================== */

	// Form validation is done
	// task is passed to the model's add method

	TilesetView.process = function(e, opts) {
		var data = e ? e.target.result : TilesetView.tmp;

		Editor.Tilesets.add(data, opts);
		Editor.$("#dialog").dialog("close");
	};

	/* ======================== */
	/* ====== CACHE FILE ====== */
	/* ======================== */

	TilesetView.cacheFile = function(e) {
		if (!window.FileReader) {
			e.preventDefault();
			TilesetView.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "");
		} else if (e.type == "change") {
			TilesetView.tmp = e.target.files[0];
			Editor.$("#dialog input[name=tileset_file_overlay]").val(TilesetView.tmp.name);
		}
	};

	/* ============================ */
	/* ====== MAKE SELECTION ====== */
	/* ============================ */

	TilesetView.makeSelection = function(e) {

		if (!Editor.$("#tilesets select option:selected").length) { return; }
		var tileset, tw, th, ex, ey;

		Editor.Utils.makeSelection(e, "#tileset_container");

		if (e.type == "mouseup") {

			tileset = Editor.activeTileset;
			tw = tileset.tilesize.width;
			th = tileset.tilesize.height;

			sx = Editor.selection[0][0] * tw;
			sy = Editor.selection[0][1] * th;
			ex = Editor.selection[1][0] * tw;
			ey = Editor.selection[1][1] * th;

			if (!Editor.$("#canvas .selection").length)
			{ Editor.$("#canvas").append("<div class='selection'></div>"); }

			Editor.$("#canvas .selection").css({
				width: (ex-sx) + tw,
				height: (ey-sy) + th,
				backgroundColor: "transparent",
				backgroundPosition: (-sx) + "px " + (-sy) + "px"
			}).attr("class", "selection ts_" + tileset.id);

			Editor.$("#tileset_container").find(".selection").remove();
			delete Editor.selection.custom;
		}
	};

	return TilesetView;
});