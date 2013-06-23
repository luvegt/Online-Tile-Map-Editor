define(["jquery-ui"], function($) {

	var Export = {}, Editor;

	Export.initialize = function(namespace) {
		Editor = namespace;

		$("body").on("click", "#export", this.process);

		return this;
	};

	Export.process = function() {
		var output = {}, layer, coords, tileset;

		$(".layer").each(function() {

			layer = $(this).attr("data-name");
			output[layer] = [];

			$(this).find("div").each(function() {
				output[layer].push({
					coords: $(this).attr("data-coords"),
					tileset: $(this).attr("data-tileset"),
				});
			});
		});

		window.open("data:text/json;charset=UTF-8;," + JSON.stringify(output), "_blank");
	};

	return Export;
});