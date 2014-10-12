module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			// options: {
			// 	separator: ";"
			// },
			css: {
				src: ['css/*.css', '!css/style.css'],
				dest: 'dist/css/vendor.css'
			}
		},
		copy: {
			css: {
				src: ['css/style.css'],
				dest: 'dist/css/style.css'
			}
		},
		uglify: {
			options: {
			},
			dest: {
				files: {
					'dist/js/index.js': ['dist/js/index.js']
				}
			}
		},
		cssmin: {
			vendor: {
				src: 'dist/css/vendor.css',
				dest: 'dist/css/vendor.css'
			},
			style: {
				src: 'dist/css/style.css',
				dest: 'dist/css/style.css'	
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
				files: ['css/*.css'],
				// tasks: ['jshint', 'browserify', 'concat', 'uglify']
				 tasks: ['copy']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-css');
	grunt.registerTask('test', ['jshint']);


	//grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'watch']);
	grunt.registerTask('default', ['browserify', 'concat', 'copy', 'watch']);
	grunt.registerTask('minify', ['uglify', 'concat', 'copy', 'cssmin']);

};