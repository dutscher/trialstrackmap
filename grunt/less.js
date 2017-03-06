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
            globalVars: globalVars,
            //compress: true
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
        share: {
            files: {
                "dist/share.css": "css/share/share.less"
            }
        }
    }
};