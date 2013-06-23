define(["jquery-ui"], function($) {

	var Menubar = {}, Editor;

	Menubar.initialize = function(namespace) {

		Editor = namespace;
		
		$("*[data-template]").on("click", this.open_dialog);
		$("*[data-toggle]").on("click", this.toggle);

		return this;
	};

	Menubar.open_dialog = function(e) {
		var template = $(e.currentTarget).attr("data-template"),
		    title = $(e.currentTarget).text();

		$.get("templates/" + template + ".tpl", function(data) {
			$("#dialog").html(data).dialog({
				title: title, modal: true,
				closeText: "<span class='icon-remove-sign'></span>",
				resizable: false,
				width: "auto"
			});
		});
	};

	Menubar.toggle = function(e) {
		var value = $(e.currentTarget).attr("data-toggle"),
			extra = value.split(":"), status;

		if (extra[0] == "visibility") {
			status = $(extra[1]).toggle();
			$(e.currentTarget).find("span").toggleClass("icon-check-empty", "icon-check");
		} else if (extra[0] == "class") {
			status = $(extra[2]).toggleClass(extra[1]);
			$(e.currentTarget).find("span").toggleClass("icon-check-empty", "icon-check");
		} else {
			Menubar.toggleFunctions[value]();
		}
	};

	Menubar.toggleFunctions = {
	};

	return Menubar;
});