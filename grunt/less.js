module.exports = function (grunt) {
    const generator = require("./generator/sprite.js")();

    grunt.registerTask("convertLess", function () {
        generator.generateSprites();
        grunt.task.run("less");
    });

    return {
        options: {
            paths: [
                "css/mixins",
            ],
            plugins: [
                require("less-plugin-glob")
            ],
            javascriptEnabled: true
        },
        dist: {
            files: {
                "dist/css/main.css": "css/main.less"
            }
        },
        map: {
            files: {
                "dist/css/map.css": "css/trackmap/main.less"
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
        garage: {
            files: {
                "dist/css/garage.css": "css/pages/garage.less"
            }
        },
        bonxy: {
            files: {
                "dist/css/bonxy.css": "css/bonxy.less"
            }
        }
    };
};