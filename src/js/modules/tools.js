define(["jquery-ui"], function($) {

	var Tools = {}, Editor;

	Tools.initialize = function(namespace) {

		Editor = namespace;
		
		$("*[data-tool]").on("click", this.select);

		return this;
	};

	Tools.select = function(e) {
		var $target = $(e.currentTarget);

		$("#tools").find("span").removeClass("active");
		$target.addClass("active");
		Editor.tool = $target.attr("data-tool");
	};

	return Tools;
});