define([
	"jquery-ui",
	"underscore"
], function($, _) {

	var Utils = {}, Editor;

	Utils.initialize = function(namespace) {

		Editor = namespace;

		return this;
	};

	Utils.make_selection = function(e, container) {

		var tileset = Editor.active_tileset,
			tw = tileset.tilesize.width,
			th = tileset.tilesize.height,

			$container = $(container),
			offset =  $container.offset(),

			// Current x position relative to the tileset area
			x = Math.floor(((e.pageX - offset.left) + $container.scrollTop()) / tw) * tw,
			y = Math.floor(((e.pageY - offset.top) + $container.scrollLeft()) / th) * th,

			$selection = $container.find(".selection");

		// Create and append selection div
		if (e.type == "mousedown") {

			if (!$selection.length)
			{ $container.append("<div class='selection'></div>"); }

			$selection.css({
				left: x,
				top: y,
				width: tw,
				height: th
			});

			delete Editor.selection;
			Editor.tmp_selection = [[x, y], new Array(2)];

		} else if (e.type == "mousemove") {

			// Resize selection div in the correct direction
			if (Editor.mousedown) {

				var sx = Editor.tmp_selection[0][0],
					sy = Editor.tmp_selection[0][1],

					w = Math.abs((x-sx) + tw),
					h = Math.abs((y-sy) + th);

				// Selection goes right
				if (sx <= x) { $selection.css({ left: sx, width: w }); }
				// Selection goes left
				else { $selection.css({ left: x, width: w + tw*2 }); }
				// Selection goes down
				if (sy <= y) { $selection.css({ top: sy, height: h }); }
				// Selection goes up
				else { $selection.css({ top: y, height: h + th*2 }); }

			// Hover selection
			} else {
				if (!$selection.length)
				{ $container.append("<div class='selection'></div>"); }

				$container.find(".selection").css({
					left: x, top: y,
					width: tw, height: th
				});
			}

		} else if (e.type == "mouseup" && Editor.tmp_selection) {

			var s = Editor.tmp_selection,
				id = $("select[name=tileset_select] option:selected").index(),
				sx, sy, ex, ey

			s[1][0] = x;
			s[1][1] = y;

			// Normalize selection, so that the start coordinates
			// are smaller than the end coordinates
			sx = s[0][0] < s[1][0] ? s[0][0] : s[1][0];
			sy = s[0][1] < s[1][1] ? s[0][1] : s[1][1];
			ex = s[0][0] > s[1][0] ? s[0][0] : s[1][0];
			ey = s[0][1] > s[1][1] ? s[0][1] : s[1][1];

			Editor.selection = [[sx/tw, sy/th], [ex/tw, ey/th]];
		}
	};

	return Utils;

});