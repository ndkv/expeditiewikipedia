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
			},
			images: {
				src: ['images/logos/*.jpg', 'images/icons/*.*', 'images/lib/*.*', 'images/intro/*.jpg'],
				dest: 'dist/'
			},
			// data: {
			// 	src: ['data/expeditions.json', 'data/expeditions-geometries.json'],
			// 	dest: 'dist/'
			// },
			// deploy: {
			// 	src: ['data/**/*'],
			// 	dest: 'dist/'
			// }
			
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
			scripts: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint']
			},
			css: {
				files: ['css/style.css'],
				tasks: ['copy']
			},
			deployed: {
				files: ['dist/css/style.css'],
				options: {
					livereload: true
				}
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
	grunt.registerTask('default', ['browserify', 'concat', 'copy:css', 'copy:images', 'watch']);
	grunt.registerTask('minify', ['browserify', 'uglify', 'concat', 'copy', 'cssmin']);
	// grunt.registerTask('copy-data', ['copy:deploy']);

};