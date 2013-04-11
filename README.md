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

### Overview
In your project's Gruntfile, add a section named `stitch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stitch: {
    options: {
      // Task-specific options go here.
    },
  },
})
```

### Options

#### options.paths
Type: `Array`

Paths or directories of files containing javascript and/or coffeescript modules.

#### options.dependencies
Type: `Array`

Dependencies that are not defined as commonjs modules, files are
concatenated and prepended to packaged javascript file.

#### options.dest
Type: `String`

Path destination for resulting packaged javascript file.

### Usage Examples

#### Options

```js
grunt.initConfig({
  stitch: {
    options: {
      paths: [
        'assets/js'
      ],
      dependencies: [
        'public/js/modernizr-min.js',
        'public/js/jquery-min.js'
      ],
      dest: 'public/js/app.js'
    }
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2013-04-01 v0.1.0 initial release
