'use strict';
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: SERVER_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: '<%= templateFramework %>'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            scss: {
                files: ['<%%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: SERVER_PORT
                },
                files: [
                    '{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
                    '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    'test/spec/{,*/}*.js'
                ]
            },
            markup: {
                files: ['<%%= yeoman.app %>/*.html'],
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['Gruntfile.js', '<%%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
            // test: {
            //     files: ['<%%= yeoman.app %>/js/{,*/}*.js', 'test/spec/**/*.js'],
            //     tasks: ['test']
            // }
        },
        connect: {
            options: {
                port: SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                forin: true,
                noarg: true,
                noempty: true,
                eqeqeq: true,
                bitwise: true,
                strict: true,
                undef: true,
                curly: true,
                expr: true,
                browser: true,
                devel: true,
                maxerr: 50,
                node: true,
                globals: {
                    jQuery: true,
                    $: true,
                    define: true,
                    require: true
                }
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/scripts/**/*.js',
                '!<%%= yeoman.app %>/scripts/vendor/**/*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                config: 'config.rb'
            },
            dist: {
                options: {
                    environment: 'production',
                    force: true
                }
            },
            server: {
                options: {
                    environment: 'development',
                    debugInfo: true
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '<%%= yeoman.app %>/scripts',
                    optimize: 'none',
                    paths: {
                    },
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    name: 'main',
                    out: '<%%= yeoman.dist %>/js/main.js',
                    mainConfigFile: '<%%= yeoman.app %>/scripts/main.js'
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%%= yeoman.app %>/index.html',
            options: {
                dest: '<%%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%%= yeoman.dist %>/**/*.html'],
            css: ['<%%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%%= yeoman.dist %>']
            }
        },
        imageoptim: {
            src: ['<%%= yeoman.dist %>/images'],
            options: {
                jpegMini: true,
                imageAlpha: true,
                quitAfter: true
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/styles/main.css': [
                        // '.tmp/css/**/*.css'
                        '<%%= yeoman.app %>/styles/**/*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/scripts/main.js': [
                        '<%%= yeoman.dist %>/scripts/main.js'
                    ]
                }
            },
            requirejs: {
                files: {
                    '<%%= yeoman.dist %>/bower_components/requirejs/require.js': [
                        '<%%= yeoman.dist %>/bower_components/requirejs/require.js'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>',
                    dest: '<%%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'css/fonts/{,*/}*.{eot,svg,ttf,woff}',
                        'images/**/*.{png,jpg,jpeg,gif,webp}',
                        '!images/sprite/**'
                    ]
                }]
            },
            requirejs: {
                src: '<%%= yeoman.app %>/bower_components/requirejs/require.js',
                dest: '<%%= yeoman.dist %>/bower_components/requirejs/require.js'
            }
        },
        bower: {
            all: {
                rjsConfig: '<%%= yeoman.app %>/scripts/main.js'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%%= yeoman.dist %>/scripts/**/*.js',
                        '<%%= yeoman.dist %>/styles/**/*.css'
                        // '<%%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        // '<%= yeoman.dist %>/css/fonts/{,*/}*.*'
                    ]
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'compass:server',
                'connect:test',
                'watch:livereload'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'compass:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'compass',
        'connect:test',
        'mocha',
        'watch:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist',
        'useminPrepare',
        'requirejs',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify:dist',
        'copy:dist',
        'copy:requirejs',
        'uglify:requirejs',
        'uglify:generated',
        'imageoptim',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', ['server']);
};