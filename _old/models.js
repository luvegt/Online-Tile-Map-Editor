var TilesetModel = Backbone.Model.extend({

	// Waits for the source image to be loaded and applies the given settings
	initialize: function() {
		var img = new Image();
		img.src = this.get("src");

		if (!this.has("name"))
		{ this.set("name", img.src.match(/.+\/(.+)/)[1]); }

		var self = this;
		img.onload = function() {
			self.set("src", this);
			if (self.get("alpha") != null) { self.setAlpha(); }
			else { self.ready(); }
		};
	},

	defaults: {
		margin: 0,
		alpha: null,
		ready: false
	},

	// Filters specified color and makes it transparent
	setAlpha: function() {
		var img = this.get("src");
		var w = parseInt(img.width, 10);
		var h = parseInt(img.height, 10);
		var alpha = this.get("alpha");

		var buffer = document.createElement("canvas");
		buffer.width = w;
		buffer.height = h;

		var bfr = buffer.getContext("2d");
		bfr.drawImage(img, 0, 0);

		var imgData = bfr.getImageData(0, 0, w, h);
		var tolerance = 10;

		for (var i = 0, l = imgData.data.length; i < l; i++) {
			var red = i%4 == 0 ? true : false;

			if (red) {
				if (
					imgData.data[i] >= alpha[0]-tolerance && imgData.data[i] <= alpha[0]+tolerance &&
					imgData.data[i+1] >= alpha[1]-tolerance && imgData.data[i+1] <= alpha[1]+tolerance &&
					imgData.data[i+2] >= alpha[2]-tolerance && imgData.data[i+2] <= alpha[2]+tolerance

				) {
					imgData.data[i+3] = 0;
				}
			}
		}

		bfr.clearRect(0, 0, w, h);
		bfr.putImageData(imgData, 0, 0);
		img.src = buffer.toDataURL();

		var self = this;
		img.onload = function() { self.ready(); }
	},

	// Slices the tileset according to tile size and margin
	slice: function() {
		var img = this.get("src");
		var w = parseInt(img.width, 10);
		var h = parseInt(img.height, 10);
		var tw = this.get("tile_size")[0];
		var th = this.get("tile_size")[1];
		var m = this.get("margin");
		var alpha = this.get("alpha");
		var tiles = [];

		var buffer = document.createElement("canvas");
		buffer.width = tw;
		buffer.height = th;

		var bfr = buffer.getContext("2d");

		for (var iy = 0, y = Math.floor(h / th); iy < y; iy++) {
			for (var ix = 0, x = Math.floor(w / tw); ix < x; ix++) {
				
				bfr.clearRect(0, 0, tw, th);

				bfr.drawImage(
					img,
					ix * tw, iy * tw,
					tw, th,
					0, 0,
					tw, th
				);

				var tile = new Image();
				tile.src = buffer.toDataURL();
				tiles.push(tile);
			}
		}

		this.set("tiles", tiles);
	},

	ready: function() {
		this.set("ready", true);

		if (this.has("callback")) {
			var fn = this.get("callback")[0];
			var self = this.get("callback")[1] || this;
			fn.call(self);
		}
	}
});