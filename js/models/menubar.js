define(["jquery-ui"], function($) {

	var Menubar = {}, Editor;

	Menubar.initialize = function(namespace) {

		Editor = namespace;

		$("*[data-template]").on("click", this.open_dialog);

		return this;
	};

	Menubar.open_dialog = function(e) {
		var template = $(e.currentTarget).attr("data-template"),
		    title = $(e.currentTarget).text();

		$.get("templates/" + template + ".tpl", function(data) {
			$("#dialog").html(data).dialog({
				title: title, modal: true,
				closeText: "<span class='icon-remove-sign'></span>",
				resizable: false
			});
		});
	};

	return Menubar;
});