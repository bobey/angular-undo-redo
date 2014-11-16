module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {

      partials: {
        files: [
          {expand: true, cwd: 'src/partials/', src: ['**'], dest: 'public/partials'}

        ]
      },

      application: {
        files: [
          {src: ['src/index.html'], dest: 'public/index.html'}
        ]
      }

    },

    concat: {

      application: {
        src: [
          'src/js/app.js',
          'src/js/**/*.js'
        ],
        dest: 'public/js/app.js',
        options: {
          banner: ";(function( window, undefined ){",
          footer: "}( window ));"
        }
      },

      vendors: {
        src: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/cryptojslib/components/core.js',
            'bower_components/cryptojslib/components/sha1.js'
        ],
        dest: 'public/js/vendor.js',
        nonull: true
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      all: {
        files: {
          'public/js/app.js': ['public/js/app.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', ['copy', 'concat', 'ngAnnotate']);
};
