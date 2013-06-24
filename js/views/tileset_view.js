define([
	"jquery-ui",
	"underscore"
], function($, _) {

	var TilesetView = {}, Editor;

	TilesetView.config = {
		filetypes: ["png", "jpg", "jpeg"]
	};

	TilesetView.tmp = {};

	TilesetView.initialize = function(namespace) {

		Editor = namespace;

		// Tileset UI functionality
		$("body").on("change", "#tilesets select", this.change_tileset);
		$("body").on("change", "input[name=file]", this.cacheFile);
		$("body").on("click", "#tilesets_add", this.add);
		$("body").on("click", "#tilesets_remove", this.remove);

		$("#tileset_container").on("mousedown mouseup mousemove", this.make_selection);
		$("#tileset_remove").on("click", this.remove);

		return this;
	};

	// Todo disallow mixing different tilesizes
	TilesetView.add = function(e) {

		var opts = {

			tilesize: {
				width: +$("#dialog input[name=tile_width]").val(),
				height: +$("#dialog input[name=tile_height]").val()
			},

			margin: +$("#dialog input[name=tile_margin]").val(),
			alpha: $("#dialog input[name=tile_alpha]").val()

		}, hex = opts.alpha.match(/^#?(([0-9a-fA-F]{3}){1,2})$/), type, data;
		
		// HEX
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

		// RGB
		} else if (opts.alpha.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9]?[0-9])(, ?|$)){3}$/)) {
			opts.alpha = _.map(opts.alpha.split(","), function(num) { return parseInt(num, 10); });
		} else { opts.alpha = null; }

		// $("#loading").show();

		// URL or FileReader event
		if (!window.FileReader) {
			data = TilesetView.tmp.match(/.+\/(.+)\.+/);
			opts.name = data[1];
			type = data[2].toLowerCase();
		} else {
			opts.name = TilesetView.tmp.name;
			type = TilesetView.tmp.type.split("/")[1];
		}

		// Wrong file type
		if (TilesetView.config.filetypes.indexOf(type.toLowerCase()) == -1) {
			alert("Wrong file type in \"" + opts.name + "\"\nSupported file types: " + TilesetView.config.filetypes.join(", "));
			//$("#loading").hide();

		// Tileset does already exist
		} else if ($("#tilesets select option:contains(" + opts.name + ")").length) {
			alert("File \"" + opts.name + "\" does already exist.");
			//$("#loading").hide();

		// Process tileset
		} else {
			if (window.FileReader) {
				var reader = new FileReader();
				reader.readAsDataURL(TilesetView.tmp);
				reader.onload = function(e) { TilesetView.process(e, opts) };
			} else { TilesetView.process(null, opts); }
		}
	};

	TilesetView.remove = function() {

		var tileset = Editor.Tilesets.get_active();
		
		$("style#tileset_" + tileset.id).remove();
		$("#tiles div.ts_" + tileset.id).remove();
		$("#tilesets select option:selected").remove();

		delete Editor.Tilesets.collection[tileset.name];

		// TODO add warning; remove tiles using this tileset
		$("#tileset_container").css({
			width: 0,
			height: 0
		});

		if ($("#tilesets select option").length) {
			var name = $("#tilesets select option:eq(0)").html()

			// TODO active previous tileset not the first one
			$("#tilesets select option").removeAttr("selected");
			$("#tilesets select option:eq(0)").attr("selected", true);
			Editor.Tilesets.set(name);
		}
	};

	TilesetView.change_tileset = function(e) {
		var name = $("#tilesets select option:selected").html();
		Editor.Tilesets.set(name);
	}

	TilesetView.process = function(e, opts) {
		var data = e ? e.target.result : TilesetView.tmp;

		Editor.Tilesets.add(data, opts);
		$("#dialog").dialog("close");
	};

	TilesetView.cacheFile = function(e) {
		if (!window.FileReader) {
			e.preventDefault();
			TilesetView.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:");
		} else if (e.type == "change") {
			TilesetView.tmp = e.target.files[0];
			$("#dialog input[name=tileset_file_overlay]").val(TilesetView.tmp.name);
		}
	};

	// TODO use index values for Editor.selection
	TilesetView.make_selection = function(e) {

		if (!$("#tilesets select option:selected").length) { return; }

		var tileset = Editor.Tilesets.get_active(),
			tw = tileset.tilesize.width,
		    th = tileset.tilesize.height,

		    x = Math.floor(((e.pageX - $("#tileset_container").offset().left) + $("#tileset_container").scrollTop()) / tw) * tw,
		    y = Math.floor(((e.pageY - $("#tileset_container").offset().top) + $("#tileset_container").scrollLeft()) / th) * th,

		    $selection = $("#tileset_container .selection");

		if (e.type == "mousedown") {

			if (!$selection.length)
			{ $("#tileset_container").append("<div class='selection'></div>"); }

			$selection.css({
				left: x,
				top: y,
				width: tw,
				height: th
			});

			Editor.selection = [[x, y], new Array(2)];

		} else if (e.type == "mousemove") {

			if (Editor.mousedown ) {

				var sx = Editor.selection[0][0],
				    sy = Editor.selection[0][1],

				    w = Math.abs((x-sx) + tw),
				    h = Math.abs((y-sy) + th);

				if (sx <= x) {
					$selection.css({
						left: sx,
						width: w
					});
				} else {
					$selection.css({
						left: x,
						width: w + tw*2
					});
				}

				if (sy <= y) {
					$selection.css({
						top: sy,
						height: h
					});
				} else {
					$selection.css({
						top: y,
						height: h + th*2
					});
				}
			} else {
				if (!$selection.length)
				{ $("#tileset_container").append("<div class='selection'></div>"); }

				$("#tileset_container .selection").css({
					left: x,
					top: y,
					width: tw,
					height: th
				});
			}

		} else if (e.type == "mouseup" && Editor.selection) {
			$selection.remove();

			var s = Editor.selection, sx, sy, ex, ey, w, h,
			    id = $("select[name=tileset_select] option:selected").index();

			s[1][0] = x;
			s[1][1] = y;

			sx = s[0][0] < s[1][0] ? s[0][0] : s[1][0];
			sy = s[0][1] < s[1][1] ? s[0][1] : s[1][1];
			ex = s[0][0] > s[1][0] ? s[0][0] : s[1][0];
			ey = s[0][1] > s[1][1] ? s[0][1] : s[1][1];

			Editor.selection = [[sx, sy], [ex, ey]];

			w = (ex-sx) + tw;
			h = (ey-sy) + th;

			$("#canvas .selection").css({
				width: w,
				height: h,
				backgroundColor: "transparent",
				backgroundPosition: (-sx) + "px " + (-sy) + "px"
			}).attr("class", "selection ts_" + tileset.id);
		}
	};

	return TilesetView;
});