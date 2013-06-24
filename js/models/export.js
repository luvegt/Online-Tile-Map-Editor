define(["jquery-ui"], function($) {

	var Export = {}, Editor;

	Export.initialize = function(namespace) {
		Editor = namespace;

		$("body").on("click", "#export", this.process);

		return this;
	};

	Export.process = function() {
		var type = $("select[name=export_format]").val(),
		    tileset = Editor.Tilesets.get_active(),
		    w = $("#canvas").width() / tileset.tilesize.width,
		    h = $("#canvas").height() / tileset.tilesize.height,
		    output, layer, coords, tileset, elem, sub_elem, text_node, y, x, query;

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
					image: tileset.url || tileset.base64,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilesize.width,
					tileheight: tileset.tilesize.height
				});
			}

			output = JSON.stringify(output);
		} else if (type == "XML") {

			// output = $.parseXML("<root/>");

			// $(".layer").each(function() {
			// 	layer = $(this).attr("data-name");

			// 	$(this).find("div").each(function() {
			// 		coords = $(this).attr("data-coords");
			// 		tileset = $(this).attr("data-tileset");
			
			// 		if (!output.querySelector("layer[tileset='" + tileset + "']")) {
			// 			elem = output.createElement("layer");
			// 			elem.setAttribute("tileset", tileset);
			// 			output.documentElement.appendChild(elem);
			// 		}

			// 		elem = output.querySelector("layer[tileset='" + tileset + "']");
			// 		sub_elem = output.createElement("coords");
			// 		text_node = document.createTextNode(coords);
			// 		sub_elem.appendChild(text_node);
			// 		elem.appendChild(sub_elem);
			// 		output.documentElement.appendChild(elem);
			// 	});
			// });

			// output = (new XMLSerializer()).serializeToString(output);
		}

		window.open("data:text/" + type + ";charset=UTF-8;," + output, "_blank");
	};

	return Export;
});