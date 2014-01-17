define(function() {

	var Import = {}, Editor;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Import.initialize = function() {

		Editor = require("editor");
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Import.events = {
		"click #import": function(e) { Import.process(e); }
	};

	/* ===================== */
	/* ====== PROCESS ====== */
	/* ===================== */

	Import.process = function() {

	};

	return Import;
});