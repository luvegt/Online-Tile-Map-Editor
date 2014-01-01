module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		sass: {
			dist: {
				options: {
					outputStyle: "compressed"
				},
				files: {
					"www/build/build.css": "src/css/main.scss"
				}
			}
		},

		jshint: {
			options: {
				curly: true,
				eqnull: true,
				browser: true,
				asi: true,
				smarttabs: true,
				expr: true
			},
			before: ["src/js/*.js", "src/js/modules/*.js"],
			after: ["www/build/build.js"]
		},

		requirejs: {
			compile: {
				options: {
					banner: "/*!\n <%= pkg.name %> - v<%= pkg.version %> - " +
					        "<%= grunt.template.today('yyyy-mm-dd') %> " +
					        "(https://github.com/elias94xx/G5-JS)\n " +
					        "Copyright 2012-2014 Elias Schütt <contact@elias-schuett.de>\n " + 
					        "Open source under the MIT license.\n*/\n\n",
					name: "main",
					baseUrl: "src/js",
					out: "www/build/build.js",
					mainConfigFile: "src/js/main.js",
					include: ["libs/require.js"]
				}
			}
		}
	});

	Object.keys(grunt.config.data.pkg.devDependencies).forEach(function(v) {
		if (v == "grunt") { return true; }
		grunt.loadNpmTasks(v);
	});

	grunt.registerTask("default", [
		"sass",
		"jshint:before",
		"requirejs"
	]);

};
