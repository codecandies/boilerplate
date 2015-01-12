# My Boilerplate

A grunt driven starting point for small websites from onepage to small projects. Features a configured grunt development and build system using the usual suspects like jquery, modernizr, sass.

## Features:
- bower support to add external libraries; jquery, modernizr and normalize.css preconfigured
- personal config of modernizr file preconfigured
- javascript linting with jslint and jscs following the [ZEIT ONLINE Frontend Coding Guidelines](https://github.com/ZeitOnline/coding-guidelines/blob/master/js/guidelines.md)
- concatination/uglyfiing of javascript files preconfigured
- sass and compass preconfigured
- image optimization with imagemin preconfigured
-  grunt watch
-  special watch tasks for css and javascript performance checking

## Planned features:
- grunt server integration
- deployment system

## Howto:
- fork this repository
- if you haven't before install [node](http://nodejs.org/)
- ensure your npm is up to date `npm update -g npm`
- if you haven't, install the grunt commandline interface `npm install -g grunt-cli`
- change into the repos dir and initialize it with `npm install`
- initially run the grunt default task as `grunt`
- during development you can use `grunt watch` oder `grunt dev` or just `grunt` to compile files under development circumstances (viewable, uncompressed, comments readable)
- edit html in `./html`, sass in `./sass` and scripts in `./javascript`
- to build a distributional version of your site, run `grunt dist` explicitly
- the dist files will be written to `./dist`
