# grunt-stitch

> Compile common.js modules with stitch

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-stitch --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-stitch');
```

## The "stitch" task
_Run this task with the `grunt stitch` command._

Task targets, files and options may be specified according to the Grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Overview
In your project's Gruntfile, add a section named `stitch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stitch: {
    options: {
      // Task-specific options go here.
    },
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.js',
    }
  }
})
```

### Options

#### options.paths
Type: `Object`
Default value: `[]`

paths option provides a way to do fancy bundling of Stitch packages in order to replicate something like require.js paths config. For example:

```js
paths: {
  'some/path/on/disk': 'fancy/path/in/client'
}
```

Suppose the `some/path/on/disk` directory looks like this:

    |- util.js
    |- lib/something.js

Then, in the client-side you can require the module using the aliased path:

```js
var something = require('fancy/path/in/client/lib/something');
```


#### options.dependencies
Type: `Array`
Default value: `[]`

An array of file glob patterns to pass as dependencies to `stitch.createPackage()`. These files are prepended to the bundled JavaScript package as-is, without being wrapped as a Stitch module. This is useful for third-party client-side only files, such as jQuery, that aren't wrapped in a CommonJS module.
Dependencies that are not defined as commonjs modules, files are
concatenated and prepended to packaged javascript file.

#### options.npmdependencies
Type: `Array`
Default value: `[]`

npmdependencies option provide a way to do fancy bundling of npm packages in order to Node js NPM bundles.
So, in the client-side you can require npm module using the modulename:

```js
var something = require('npm_module_name');
```

#### options.tmp
Type: `String`
Default value: `tmp`

Alternate path for tmp directory used for storing files before being stitched by `stitch.createPackage()`.

### Usage Examples

#### Options

All Options usage example

```js
grunt.initConfig({
  stitch: {
    options: {
      paths: [
        'assets/js': 'js'
      ],
      dependencies: [
        'public/js/modernizr-min.js',
        'public/js/jquery-min.js'
      ],
      npmdependencies: [
        'dist/handlebars.min.js': 'handlebars',
        'lib/matchdep.js': 'matchdep'
      ],
      tmp: 'path/to/alternate/tmpdir'
    },
    dist: {
      src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
      dest: 'dist/built.js'
    }
  }
})
```

#### Multiple targets

In this example, running `grunt stitch` will build two separate files. One "basic" version, with the main file essentially stitched to `dist/basic.js`, and another "with_extras" version written to `dist/with_extras.js`.

While each stitch target can be built individually by running `grunt stitch:basic` or `grunt stitch:extras`, running `grunt stitch` will build all stitch targets. This is because `stitch` is a [multi task][multitask].

```js
// Project configuration.
grunt.initConfig({
  stitch: {
    basic: {
      src: ['src/main.js'],
      dest: 'dist/basic.js'
    },
    extras: {
      src: ['src/main.js', 'src/extras.js'],
      dest: 'dist/with_extras.js'
    }
  }
});
```

#### Multiple files per target

Like the previous example, in this example running `grunt stitch` will build two separate files. One "basic" version, with the main file essentially stitched to `dist/basic.js`, and another "with_extras" version written to `dist/with_extras.js`.

This example differs in that both files are built under the same target.

Using the `files` object, you can have list any number of source-destination pairs.

```js
// Project configuration.
grunt.initConfig({
  stitch: {
    basic_and_extras: {
      files: {
        'dist/basic.js': ['src/main.js'],
        'dist/with_extras.js': ['src/main.js', 'src/extras.js'],
      }
    }
  }
});
```

#### Dynamic filenames

Filenames can be generated dynamically by using `<%= %>` delimited underscore templates as filenames.

In this example, running `grunt stitch:dist` generates a destination file whose name is generated from the `name` and `version` properties of the referenced `package.json` file (via the `pkg` config property).

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  stitch: {
    dist: {
      src: ['src/main.js'],
      dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
    },
  },
});
```

#### Advanced dynamic filenames

In this more involved example, running `grunt stitch` will build two separate files (because `stitch` is a [multi task][multitask]). The destination file paths will be expanded dynamically based on the specified templates, recursively if necessary.

For example, if the `package.json` file contained `{"name": "awesome", "version": "1.0.0"}`, the files `dist/awesome/1.0.0/basic.js` and `dist/awesome/1.0.0/with_extras.js` would be generated.

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  dirs: {
    src: 'src/files',
    dest: 'dist/<%= pkg.name %>/<%= pkg.version %>',
  },
  stitch: {
    basic: {
      src: ['<%= dirs.src %>/main.js'],
      dest: '<%= dirs.dest %>/basic.js',
    },
    extras: {
      src: ['<%= dirs.src %>/main.js', '<%= dirs.src %>/extras.js'],
      dest: '<%= dirs.dest %>/with_extras.js',
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2013-07-22 v0.2.0 Multi task and aliases and NPM support.
2013-04-01 v0.1.0 initial release
