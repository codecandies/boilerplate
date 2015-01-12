//Wrapper function with one parameter
module.exports = function(grunt) {

    // configuration vars
    var project = {
        bannerContent: '/*! <%= pkg.name %> <%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        dirs: {
            assets: 'dist/assets/',
            dist: 'dist/',
            src: 'src/'
        },
        tasks: {
            lint: [
                'jshint',
                'jscs'
            ],
            // build a dev version of the code, leaving files read and debuggable
            dev: [
                'bower',
                'modernizr',
                'lint',
                'copy:fonts',
                'copy:html',
                'compass:dev',
                'imagemin',
                'concat',
                'copy:css',
                'stylestats'
            ],
            // build a distribution version of the code, all compressed and uglyfied
            dist: [
                'bower',
                'modernizr',
                'lint',
                'copy:fonts',
                'copy:html',
                'compass:dist',
                'imagemin',
                'uglify',
                'copy:css',
                'stylestats'
            ]
        }
    };

    // load all grunt node modules starting with 'grunt-'
    require('load-grunt-tasks')(grunt);

    // configuration
    grunt.initConfig({

        // read from package.json
        pkg: grunt.file.readJSON('package.json'),

        /*
         * grunt-bower-task
         * prepares and fetches external libraries
         * puts them in the source vendor directory
         * config file: ./bower.json
         */
        bower: {
            install: {
                options: {
                    targetDir: project.dirs.src + 'vendor',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {
                        production: true
                    }
                }
            }
        },

        /*
         * grunt-contrib-clean
         * clean asset directory
         * not in any task, just for dorect call by 'grunt clean'
         */
        clean: {
            build: {
                src: [ 
                    project.dirs.dist + '**/*',
                ]
            }
        },

        /*
         * grunt-contrib-compass
         * supplies uncompressed css in dev and compressed code in dist
         */
        compass: {
            options: {
                cssDir: project.dirs.assets + 'css',
                fontsPath: project.dirs.assets + 'css/fonts',
                fontsDir: project.dirs.assets + 'css/fonts',
                imagesPath: project.dirs.assets + 'img',
                javascriptsPath: project.dirs.assets + 'js',
                sassDir: project.dirs.src + 'sass',
                raw: 'preferred_syntax=:sass\n',
                relativeAssets: true
            },
            dev: {
                options: {
                    force: true,
                    environment: 'development',
                    outputStyle: 'expanded'
                }
            },
            dist: {
                options: {
                    force: true,
                    sourcemap: true,
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            }
        },

        /*
         * grunt-contrib-concat
         * use concatination instead of uglifing during dev
         */
        concat: {
            options: {
                banner: project.bannerContent,
            },
            dev: {
                src: [
                    'src/vendor/**/*.js',
                    'src/javascript/*.js',
                    '!src/vendor/modernizr/**'
                ],
                dest: project.dirs.assets + 'js/app.js'
            }
        },

        /*
         * grunt-contrib-copy
         * need to copy some files? Do it here
         */
        copy: {
            css: {
                expand: true,
                cwd: project.dirs.src + 'vendor/',
                src: 'normalize.css/*',
                dest: project.dirs.assets + 'vendor'
            },
            fonts: {
                expand: true,
                cwd: project.dirs.src,
                src: 'fonts/**',
                dest: project.dirs.assets + 'css'
            },
            html: {
                expand: true,
                cwd: project.dirs.src + 'html/',
                src: '**/*.html',
                dest: project.dirs.dist
            }
        },

        /*
         * grunt-contrib-imagemin
         * optimizes images and moves them to dist destination
         */
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: project.dirs.src + 'images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: project.dirs.assets + 'img' 
                }]
            }
        },

        /*
         * grunt-asset-injector
         * places our local dependencies into the html
         */
        injector: {
            options: {
                addRootSlash: false,
                destFile: project.dirs.dist + '**/.html',
                template: project.dirs.dist + 'index.html'
            },
            src: [
                project.dirs.assets + 'vendor/normalize.css/normalize.css',
                project.dirs.assets + 'css/screen.css',
                '<%= concat.dev.dest %>'
            ]
        },

        /*
         * grunt-contrib-jshint
         * js hinting but it does not all the good parts so…
         */
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            target: {
                src: [ project.dirs.src + 'javascript/**/*.js' ]
            }
        },

        /*
         * grunt-jscs
         * …we need some more linting and hinting
         */
        jscs: {
            options: {
                config: '.jscrc'
            },
            target: {
                src: [ '<%= jshint.target.src %>' ]
            }
        },

        /*
         * grunt-contrib-modernizr
         * build an optimized and personalized modernizr file
         */
        modernizr: {
            dist: {
                // [REQUIRED] Path to the build you're using for development.
                'devFile': project.dirs.src + 'vendor/modernizr/modernizr.js',
                // [REQUIRED] Path to save out the built file.
                'outputFile': project.dirs.assets + 'js/modernizr-custom-min.js',
                // Based on default settings on http://modernizr.com/download/
                'extra': {
                    'shiv': true,
                    'printshiv': false,
                    'load': false, // was true
                    'mq': false,
                    'cssclasses': true
                },
                // Based on default settings on http://modernizr.com/download/
                'extensibility': {
                    'addtest': false,
                    'prefixed': false,
                    'teststyles': false,
                    'testprop': false,
                    'testallprops': false,
                    'hasevents': false,
                    'prefixes': false,
                    'domprefixes': false
                },
                // By default, source is uglified before saving
                'uglify': true,
                // Define any tests you want to implicitly include.
                'tests': [ 'video', 'touch' ],
                // By default, this task will crawl your project for references to Modernizr tests.
                // Set to false to disable.
                'parseFiles': true,
                // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
                // You can override this by defining a 'files' array below.
                'files': {
                    'src': []
                },
                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                'matchCommunityTests': false,
                // Have custom Modernizr tests? Add paths to their location here.
                'customTests': []
            }

        },

        /*
         * grunt-phantomas
         * test project for further optimazation
         * not in any tasks, call with 'grunt phantomas≤'
         */
        phantomas: {
            site: {
                indexPath: './boilerplate/dist',
                url: 'http://localhost/boilerplate/dist/'
            }
        },

        /*
         * grunt-stylestats echoes some statistics about the stylesheets
         */
        stylestats: {
            src: project.dirs.assets + 'css/**/*.css'
        },

        /*
         * grunt-contrib-uglify
         * uglify the same shit that is concatinated in dev for dist
         */
        uglify: {
            options: {
                banner: project.bannerContent,
                compress: {
                    drop_console: true
                },
                mangle: {
                    except: [ 'jQuery' ]
                },
                sourceMap: true
            },
            dist: {
                src: '<%= concat.dev.src %>',
                dest: '<%= concat.dev.dest %>'
            }
        },


        watch: {
            jslint: {
                files: [ '<%= jshint.target.src %>' ],
                tasks: [ 'lint' ]
            },
            jsbuild: {
                files: [ '<%= concat.dev.src %>' ],
                tasks: [ 'concat' ]
            },
            compass: {
                files: [ '<%= compass.options.sassDir %>' + '/**/*' ],
                tasks: [ 'compass:dev' ]
            },
            images: {
                files: [ '<%= imagemin.dynamic.files %>' ],
                tasks: [ 'imagemin' ]
            },
            config: {
                files: [
                    project.dirs.src + '.jscsrc',
                    project.dirs.src + '.jshintrc',
                    project.dirs.src + 'bower.json',
                    project.dirs.src + 'Gruntfile.js'
                ],
                options: {
                    reload: true
                }
            }
        }

    });

    grunt.registerTask('default', project.tasks.dev);
    grunt.registerTask('lint', project.tasks.lint);
    grunt.registerTask('dev', project.tasks.dev);
    grunt.registerTask('dist', project.tasks.dist);
};