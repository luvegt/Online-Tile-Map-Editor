define(["jquery-ui"], function($) {

	var Export = {}, Editor;

	Export.initialize = function(namespace) {

		Editor = namespace;

		$("body").on("click", "#export", this.process);

		return this;
	};

	// TODO comment this
	Export.process = function() {
		var type = $("select[name=export_format]").val(),
			include_base64 = $("select[name=include_base64]").val() == "yes",
			format_output = $("select[name=format_output]").val() == "yes",
		    tileset = Editor.active_tileset,

		    w = $("#canvas").width() / tileset.tilesize.width,
		    h = $("#canvas").height() / tileset.tilesize.height,

		    output, layer, coords, tileset, y, x, query, elem, data;

		if (type == "JSON") {
			
			output = {};
			output.layers = [];

			$(".layer").each(function() {

				layer = {
					name: $(this).attr("data-name"),
					tileset: $(this).attr("data-tileset"),
					data: []
				};

				for (y = 0; y < h; y++) {
					for (x = 0; x < w; x++) {
						query = $(this).find("div[data-coords='" + x + "." + y + "']");
						coords = query.length ? parseFloat(query.attr("data-coords-tileset"), 10) : 0.0;
						layer.data.push(coords);
					}
				}

				output.layers.push(layer);
			});

			output.tilesets = [];

			for (tileset in Editor.Tilesets.collection) {
				tileset = Editor.Tilesets.collection[tileset];

				output.tilesets.push({
					name: tileset.name,
					image: include_base64 ? tileset.base64 : tileset.name,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilesize.width,
					tileheight: tileset.tilesize.height
				});
			}

			output = JSON.stringify(output);

		} else if (type == "XML") {

			output = $("<root>").append("<layers>");

			$(".layer").each(function() {

				layer = $("<layer>");
				layer.attr({
					name: $(this).attr("data-name"),
					tileset: $(this).attr("data-tileset"),
				});

				data = [];

				for (y = 0; y < h; y++) {
					for (x = 0; x < w; x++) {
						query = $(this).find("div[data-coords='" + x + "." + y + "']");
						coords = query.length ? query.attr("data-coords-tileset") : "0.0";
						if (x == w-1 && format_output) { coords += "\r\n"; }
						data.push(coords);
					}
				}

				layer.text(data.join(","));
				output.find("layers").append(layer);
			});

			output.append("<tilesets>");

			for (tileset in Editor.Tilesets.collection) {
				tileset = Editor.Tilesets.collection[tileset];

				elem = $("<tileset>");

				elem.attr({
					name: tileset.name,
					image: include_base64 ? tileset.base64 : tileset.name,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilesize.width,
					tileheight: tileset.tilesize.height
				});

				output.find("tilesets").append(elem);
			}

			output = encodeURIComponent((new XMLSerializer()).serializeToString(output[0]));
		}

		window.open("data:text/" + type + ";charset=UTF-8;," + output, "_blank");
	};

	return Export;
});