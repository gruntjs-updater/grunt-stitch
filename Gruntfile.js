/*
 * grunt-stitch
 * https://github.com/cezary/grunt-stitch
 *
 * Copyright (c) 2013 Cezary Wojtkowski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.

    // configurable paths
    var configPaths = {
        app: 'app',
        dist: 'www',
        tmp: 'tmp',
        test: 'test'
    };

    grunt.initConfig({
        config: configPaths,
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        stitch: {
            options: {
                tmp: '<%= config.tmp %>',
                dependencies: [
                    'test/fixtures/sample/dep/**/*.js'
                ],
                paths: {
                    'test/fixtures/sample/module': 'module'
                }
            },
            files: {
                src: [
                    'test/fixtures/sample/app/**/*.js',
                    'test/fixtures/sample/module/**/*.js'
                ],
                dest: '<%= config.tmp %>/sample/out.js',
                filter: 'isFile'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'stitch', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
