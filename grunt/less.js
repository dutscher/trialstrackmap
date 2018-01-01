module.exports = function (grunt) {
    var generator = require("./generator/sprite.js")(),
        globalVars = generator.generateSprites();

    grunt.registerTask("convertLess", function () {
        globalVars = generator.generateSprites();
        grunt.task.run("less");
    });

    return {
        options: {
            paths: ["css/mixins"],
            plugins: [
                require("less-plugin-glob")
            ],
            globalVars: globalVars
            //,compress: true
        },
        dist: {
            files: {
                "dist/main.css": "css/main.less"
            }
        },
        map: {
            files: {
                "dist/map.css": "css/map/main.less"
            }
        },
        table: {
            files: {
                "dist/table.css": "css/pages/table.less"
            }
        },
        trackfinder: {
            files: {
                "dist/trackfinder.css": "css/pages/trackfinder.less"
            }
        },
        bonxy: {
            files: {
                "dist/bonxy.css": "css/bonxy.less"
            }
        }
    };
};