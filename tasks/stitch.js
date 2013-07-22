/*
 * grunt-stitch
 * https://github.com/cezary/grunt-stitch
 *
 * Copyright (c) 2013 Cezary Wojtkowski
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var stitch = require('stitch');

module.exports = function(grunt) {

    grunt.registerMultiTask('stitch', 'Compile common.js modules with stitch.', function() {
        var done = this.async();

        var options = this.options();
        var tmpDir = __dirname + options.tmp;
        var dependencies = grunt.file.expand(options.dependencies);
        var aliasregx = new RegExp('^(' + grunt.util._.keys(options.paths).join('|') + ')');

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {

            var pathMaps = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                var matches = filepath.match(aliasregx);
                var dest = filepath;
                if (matches) {
                    dest = filepath.replace(matches[0], options.paths[matches[0]]);
                }
                return [filepath, dest];
            });

            // Copy over any NPM dependencies, so they can be `require`d in a sexy way.
            pathMaps = pathMaps.concat(grunt.util._.map(options.npmDependencies, function(src, module) {
                var filepath = path.normalize('node_modules/' + module + '/' + src);
                return [filepath, module + '.js'];
            }));

            // Clean the tmp dir, to prevent picking up old files.
            if (grunt.file.exists(tmpDir)) {
                grunt.file.delete(tmpDir);
            }

            // Copy everything to the tmp directory, which will be the
            // base path for the Stitch bundle.
            pathMaps.forEach(function(pathMap) {
                grunt.file.copy(pathMap[0], tmpDir + '/' + pathMap[1]);
            });

            assertFiles(pathMaps.length, tmpDir, function() {
                // Create the Stitch package.
                stitch.createPackage({
                    paths: [tmpDir],
                    dependencies: dependencies
                }).compile(function(err, source) {
                    if (err) {
                        return done(err);
                    }
                    grunt.file.write(f.dest, source);
                    grunt.log.writeln('File "' + f.dest + '" created.');
                    done();
                });
            });
        });
    });

    /**
    * Sometimes, the Stitch compliation appears to happen before all files are copied over to
    * the `tmpDir`.  We simply wait until they are.
    */
    function assertFiles(expectedNumFiles, tmpDir, callback) {
        function countFiles() {
            var numFiles = 0;
            grunt.file.recurse(tmpDir, function(abspath, rootdir, subdir, filename) {
                numFiles++;
            });
            return numFiles === expectedNumFiles;
        }

        var interval = setInterval(function() {
            if (countFiles()) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }
};
