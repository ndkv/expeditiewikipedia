module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// concat: {
		// 	options: {
		// 		separator: ";"
		// 	},
		// 	dist: {
		// 		src: ['js/*.js'],
		// 		dest: 'dist/<%= pkg.name %>.js'
		// 	}
		// },
		uglify: {
			options: {
			},
			dist: {
				files: {
					'dist/js/index.min.js': ['dist/js/index.js']
				}
			}
		},
		jshint: {
			files: ['gruntfile.js', 'js/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},
		browserify: {
			all: {
				files: {
					'dist/js/index.js': ['js/app.js']					
				}
			},
			options: {
				watch: true
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['<%= jshint.files %>'],
				// tasks: ['jshint', 'browserify', 'concat', 'uglify']
				// tasks: ['jshint', 'concat', 'browserify']
				tasks: ['jshint']
				// tasks: ['browserify']

			},
			css: {
				files: ['css/*.css']
				// tasks: ['jshint', 'browserify', 'concat', 'uglify']
				// tasks: ['jshint', 'concat']

			}

		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.registerTask('test', ['jshint']);

	//grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'watch']);
	grunt.registerTask('default', ['browserify', 'watch']);
	grunt.registerTask('minify', ['uglify']);

};