module.exports = function (grunt) {
    var generator = require("./generator/sprite.js")();
    grunt.registerTask("convertLess", function () {
        grunt.config("less.options.globalVars", generator.generateSprites());
        grunt.task.run("less");
    });

    return {
        options: {
            paths: ["css/mixins"],
            plugins: [
                require("less-plugin-glob")
            ]
        },
        dist: {
            files: {
                "dist/css/main.css": "css/main.less"
            }
        },
        map: {
            files: {
                "dist/css/map.css": "css/map/main.less"
            }
        },
        table: {
            files: {
                "dist/css/table.css": "css/pages/table.less"
            }
        },
        trackfinder: {
            files: {
                "dist/css/trackfinder.css": "css/pages/trackfinder.less"
            }
        },
        bonxy: {
            files: {
                "dist/css/bonxy.css": "css/bonxy.less"
            }
        }
    };
};