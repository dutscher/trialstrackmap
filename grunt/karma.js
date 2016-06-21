module.exports = function (grunt) {

    var _ = require("lodash"),
        arrFiles = [
            "./dist/vendor.min.js",
            "./dist/map.min.js",
            "./vendor/angular-mocks/angular-mocks.js"
        ];

    grunt.registerTask("testUnit", [
        "karma:unit"
    ]);

    function buildFiles(specPath) {
        var buildFiles = _.extend([], arrFiles);
        if (specPath) {
            buildFiles.push(specPath);
        } else {
            buildFiles.push("./lib/**/*.spec.js");
        }
        return buildFiles;
    }

    grunt.config.set("karmaFiles", buildFiles());

    // Event handling
    //grunt.event.on("watch", function (action, filepath) {
    //    // Update the config to only build the changed less file.
    //    var newFiles = [];
    //
    //    if (_.endsWith(filepath, ".spec.js")) {
    //        newFiles = buildFiles(filepath);
    //    } else {
    //        newFiles = buildFiles();
    //    }
    //    grunt.config.set("karmaFiles", newFiles);
    //});

    return {
        unit: {
            configFile: "./grunt/config/karma.js",
            options: {
                files: grunt.config.get("karmaFiles")
            }
        }
    }
}