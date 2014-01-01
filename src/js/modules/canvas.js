define([
	"jquery-ui", 
	"jquery.draggable"
], function($) {

	var Canvas = {}, Editor;

	Canvas.cursor = [];
	Canvas.cursor.last = {}; // Yes that's possible

	Canvas.initialize = function(namespace) {

		Editor = namespace;

		// Selection movement
		$("#canvas").on("mousedown mousemove mouseup", function(e) {

			if (!Editor.active_tileset) { return; }
			if (e.which == 3) { Editor.Tilesets.reset_selection(); return; }

			var tileset = Editor.active_tileset,
		        tw = tileset.tilesize.width,
		        th = tileset.tilesize.height,

			    offset = $("#canvas").offset(),
			    x = Math.floor((e.pageX - offset.left) / tw),
			    y = Math.floor((e.pageY - offset.top) / th);

			Canvas.cursor[0] = x;
			Canvas.cursor[1] = y;

			$("#canvas").find(".selection").css({
				top: y * th,
				left: x * tw
			});

			if (!Editor.keystatus.spacebar) {

				if (Editor.selection && ((e.type == "mousedown" && e.which == 1) || Editor.mousedown)) {

					if (Editor.tool == "draw") { 

						// Prevent redrawing of previous drawn tiles.
						// Start x, Start x, End x, End y
				        var sx = Editor.selection[0][0],
					        sy = Editor.selection[0][1],
					        ex = Editor.selection[1][0],
					        ey = Editor.selection[1][1],

					        // Length for iterated x and y variables
					        lx = ex - sx,
					        ly = ey - sy;

					    // Iterate through selected tiles check to see if they have been previously drawn.
						for (y = 0; y <= ly; y++) {
							for (x = 0; x <= lx; x++) {
								if ([Canvas.cursor[0]+x,Canvas.cursor[1]+y] in Canvas.cursor.last) { return ;}
							}
						}

						Canvas.draw();

					} else if (Editor.tool == "fill" && e.type == "mousedown") { Canvas.fill(); }
					
				} else if (!Editor.selection) { Canvas.make_selection(e); }

				//On mouseup with selection clear last draw cache.
				if (Editor.selection && !Editor.mousedown){
					Canvas.cursor.last = {};
				}
			}
		});

		$("#canvas").draggable({
			mouseButton: 1,
			cursor: "move",
			start: function() {
				if (!Editor.keystatus.spacebar) {
					$("body").css("cursor", "");
					return false;
				}
			}
		});

		this.reposition();
		$("#canvas").fadeIn();
		$(window).on("resize", this.reposition);

		return this;
	};

	Canvas.draw = function() {

		var tileset = Editor.active_tileset,
		    layer = Editor.Layers.get_active(),

		    // Cursor position
		    cx = this.cursor[0],
		    cy = this.cursor[1],

		    // Tilsize
		    tw = tileset.tilesize.width,
		    th = tileset.tilesize.height,

		    // Start x, Start x, End x, End y
		    sx = Editor.selection[0][0],
		    sy = Editor.selection[0][1],
		    ex = Editor.selection[1][0],
		    ey = Editor.selection[1][1],

		    // Length for iterated x and y variables
		    lx = ex - sx,
		    ly = ey - sy,

		    // Background position
		    bgpos = $("#canvas").find(".selection").css("background-position").split(" "),
		    bgx = parseInt(bgpos[0], 10),
		    bgy = parseInt(bgpos[1], 10),

		    // Tile position on the canvas
		    pos_x, pos_y, coords,

		    // Misc
		    $div, x, y, query, cxp, cyp, $tile, top, left;

		// TODO optimize this:
		// Checks if the current tileset differs
		// from the one used on the current layer
		if (!$(layer.elem).attr("data-tileset")) {

			$(layer.elem).addClass("ts_" + tileset.id);
			$(layer.elem).attr("data-tileset", tileset.name);

		} else if ($(layer.elem).attr("data-tileset") != tileset.name) {

			if (!$("#canvas .warning:visible").length)
			{ $("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000); }
			
			return;
		}

		if (Editor.selection.custom) {
			console.log('DRAW CUSTOM')
			cxp = cx*tw;
			cyp = cy*th;

			$("#canvas").find(".selection").find("div").each(function() {
				top = parseInt($(this).css("top"), 10);
				left = parseInt($(this).css("left"), 10);

				$tile = $(this).clone();
				$tile.css({
					top: top + cyp,
					left: left + cxp
				});

				coords = ((left+cxp)/tw) + "." + ((top+cyp)/th);
				query = $(layer.elem).find("div[data-coords='" + coords + "']");

				if (query.length) {
					$(query).attr("style", $tile.attr("style"));
				} else {
					$tile.attr("data-coords", coords);
					$(layer.elem).append($tile);
				}
			});

		} else {
			// Iterate through selected tiles
			for (y = 0; y <= ly; y++) {
				for (x = 0; x <= lx; x++) {
					
					pos_x = cx + x;
					pos_y = cy + y;
					Canvas.cursor.last[[pos_x,pos_y]] = true;
					coords = pos_x + "." + pos_y;
					query = $(layer.elem).find("div[data-coords='" + coords + "']");

					// Update existing tile or create a new one and position it
					$div = query.length ? query : $("<div>").css({
						position: "absolute",
						left: pos_x * tw,
						top: pos_y * th
					}).attr("data-coords", coords);


					// Set/update the tileset information
					$div.attr("data-coords-tileset", (Math.abs(bgx/tw)+x) + "." + (Math.abs(bgy/th)+y));
					$div.css("background-position", (bgx-(x*tw)) + "px" + " " + (bgy-(y*th)) + "px");

					// Append the tile if it didn't on that coordinate
					if (!query.length) { $(layer.elem).append($div); }
				}
			}
		}
	};

	// TODO throw this in a webworker
	Canvas.fill = function(e) {
		var tileset = Editor.active_tileset,
		    layer = Editor.Layers.get_active(),

		    // Cursor position
		    cx = this.cursor[0],
		    cy = this.cursor[1],

		    // Tilsize
		    tw = tileset.tilesize.width,
		    th = tileset.tilesize.height,

		    // Start x, Start x, End x, End y
		    sx = Editor.selection[0][0],
		    sy = Editor.selection[0][1],
		    ex = Editor.selection[1][0],
		    ey = Editor.selection[1][1],

		    // Field size in tiles
		    fx = $("#canvas").width()/tw,
		    fy = $("#canvas").height()/th,

		    bgpos = $("#canvas").find(".selection").css("background-position").split(" "),
		    bgx = parseInt(bgpos[0], 10),
		    bgy = parseInt(bgpos[1], 10),

		    query = $(layer.elem).find("div[data-coords='" + cx + "." + cy + "']"),
		    search_bgpos = query.length ? query.attr("data-coords-tileset") : null,
		    replace_bgpos = Math.abs(bgx/tw) + "." + Math.abs(bgy/th),
		    
		    documentFragment = document.createDocumentFragment(),
		    closedList = [];

		    fill_recursive = function(ox, oy) {

				var coords = [
					[ox, oy-1], // top
					[ox, oy+1], // bottom
					[ox-1, oy], // left
					[ox+1, oy]  // right
				], $elem, x, y;

				coords.forEach(function(arr) {

					x = arr[0],
					y = arr[1];

					if (x < 0 || x >= fx || y < 0 || y >= fy) { return; }
					if (closedList.indexOf(x + "." + y) != -1) { return; }

					$elem = $(layer.elem).find("div[data-coords='" + arr[0] + "." + arr[1] + "']");

					if ((!$elem.length && !search_bgpos) || $elem.attr("data-coords-tileset") == search_bgpos) {

						if (!$elem.length) {
							$elem = $("<div>").css({
								position: "absolute",
								left: x * tw,
								top: y * th
							})

							.attr("data-coords", x + "." + y);
							documentFragment.appendChild($elem[0]);
						}

						$elem.css("background-position", bgx + "px" + " " + bgy + "px");
						$elem.attr("data-coords-tileset", replace_bgpos);

						closedList.push(x + "." + y);
						fill_recursive(x, y);
					}
				});
			};

		// TODO make unify this
		if (!$(layer.elem).attr("data-tileset")) {

			$(layer.elem).addClass("ts_" + tileset.id);
			$(layer.elem).attr("data-tileset", tileset.name);

		} else if ($(layer.elem).attr("data-tileset") != tileset.name) {

			if (!$("#canvas .warning:visible").length)
			{ $("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000); }
			
			return;
		}

		// Start the recursive search
		fill_recursive(cx, cy);
		$(layer.elem).append(documentFragment);
	};

	Canvas.make_selection = function(e) {

		var tileset, tw, th, ex, ey, $selection, layer, top, left, $tile;

		Editor.Utils.make_selection(e, "#canvas");

		if (e.type == "mousedown") {

			$("#canvas").find(".selection").css("background-color", "rgba(0, 0, 0, 0.3)");

		} else if (e.type == "mouseup") {
			tileset = Editor.active_tileset;
			tw = tileset.tilesize.width;
			th = tileset.tilesize.height;

			sx = Editor.selection[0][0] * tw;
			sy = Editor.selection[0][1] * th;
			ex = Editor.selection[1][0] * tw;
			ey = Editor.selection[1][1] * th;

			$selection = $("#canvas").find(".selection");
			layer = Editor.Layers.get_active();

			// Find all elements that are in range of
			// the selection and append a copy of them
			$(layer.elem).find("div").each(function() {
				top = parseInt($(this).css("top"), 10);
				left = parseInt($(this).css("left"), 10);

				if (left >= sx && left <= ex && top >= sy && top <= ey) {
					$tile = $(this).clone();

					$tile.css({
						top: top - sy,
						left: left - sx
					});
					
					$selection.append($tile);
				}
			});

			$selection.css("background-color", "transparent");
			$selection.addClass($(layer.elem).attr("class").replace("layer", "nobg"));
			Editor.selection.custom = true;
		}
	};

	Canvas.reposition = function(e) {
		var extra = $("#toolbar").width() + $("#canvas").width() < $(window).width() ? $("#toolbar").width() / 2 : 0,
		    left = ($(window).width() / 2) - ($("#canvas").width() / 2) + extra,
		    top = ($(window).height() / 2) - ($("#canvas").height() / 2);

		$("#canvas").css({ top: top, left: left });
	};

	// Creates a base64 image with two borders
	// resulting in a grid when used as a repeated background
	Canvas.update_grid = function() {
		var buffer = document.createElement("canvas"),
		    bfr = buffer.getContext("2d"),
		    tileset = Editor.active_tileset,
		    tw = tileset.tilesize.width,
		    th = tileset.tilesize.height;

		buffer.width = tw;
		buffer.height = th;

		bfr.fillStyle = "rgba(0, 0, 0, 0.1)";
		bfr.fillRect(0, th-1, tw, 1);
		bfr.fillRect(tw-1, 0, 1, th);

		$("#canvas").css("backgroundImage", "url(" + buffer.toDataURL() + ")");
		$("#canvas").find(".selection").css({
			width: tw,
			height: th
		});
	};

	return Canvas;
});