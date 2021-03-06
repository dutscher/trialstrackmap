module.exports = function (grunt) {

    grunt.registerTask("#startServer", () => {
        grunt.task.run([
            "deploy",
            "copy:assetsOffline",
            "connect:dist",
            "watch"
        ]);
    });

    grunt.registerTask("serverWithBackup", function () {
        grunt.task.run([
            "doBackup",
            "server"
        ]);
    });

    var rewrite = require("connect-modrewrite"),
        config = require("./connect-config.json5"),
        rules = require("./connect-rewrite-rules.json5"),
        serveStatic = require("serve-static");

    return {
        options: {
            port: config.port,
            livereload: config.livereload,
            hostname: config.hostname,
            middleware: function (connect, options, middlewares) {
                // 1. mod-rewrite behavior
                middlewares.unshift(rewrite(rules));

                // 2. original middleware behavior
                var base = typeof options == "object" && options.base[0].hasOwnProperty("path") ? options.base[0].path : options.base;
                if (!Array.isArray(base)) {
                    base = [base];
                }
                base.forEach(function (path) {
                    middlewares.unshift(serveStatic(path));
                });

                middlewares.unshift(
                    function (req, res, next) {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Methods', '*');
                        next();
                    }
                );

                return middlewares;
            }
        },
        /**
         * Server in dist folder.
         */
        dist: {
            options: {
                open: true,
                base: [
                    "./"
                ]
            }
        },
        /**
         * Server for unit tests in deploy folder.
         */
        testUnit: {
            options: {
                open: {
                    target: "http://localhost:" + config.port + "/_SpecRunner.html"
                },
                port: config.port,
                //keepalive: true,
                base: {
                    path: "./"
                }
            }
        }
    };
};
