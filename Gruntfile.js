module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
  	  // define the files to lint
  	  files: ['js/app.js'],
  	  // configure JSHint (documented at http://www.jshint.com/docs/)
  	  options: {
  	      // more options here if you want to override JSHint defaults
  	    globals: {
  	      jQuery: true,
  	      console: true,
  	      module: true
  	    }
  	  }
  	},
    concat: {
//	  options: {
//	    // define a string to put between each file in the concatenated output
//	    separator: ';'
//	  },
	  dist: {
		    // the files to concatenate
		    src: ['js/**/*.js'],
		    // the location of the resulting JS file
		    dest: 'dist/<%= pkg.name %>.js'
	  },
	  css: {
		    // the files to concatenate
		    src: ['css/ref.min.css','css/jquery.mobile-1.3.0.min.css'],
		    // the location of the resulting JS file
		    dest: 'css/ref.all.min.css'
		  }
	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
        options: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        my_target: {
            src: 'css/ref.css',
            dest: 'css/ref.min.css'
        }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('css', ['cssmin','concat']);

  grunt.registerTask('default', ['jshint','cssmin','concat','uglify']);

};