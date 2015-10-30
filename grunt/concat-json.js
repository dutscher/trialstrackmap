module.exports = function (grunt) {

    grunt.registerTask("convertInExtraFile", function () {
        var tracks = require("../database/tracks.json5"), // rename first
            images = {};

        tracks.forEach(function(track){
            // startline  datacube  candies
            if("datacube" in track) {
                images[track.id] = track.datacube;
            }
        });

        //grunt.file.write("database/media/datacubes.json", JSON.stringify(images, null, 2));
    });

    return {
        database: {
            src: [
                "database/*.{json,json5}",
                "database/media/*!(gfx).json"
            ],
            dest: "build/map.json"
        },
        rawToDist: {
            files: [
                {
                    src: [
                        "database/media/gfx.json"
                    ],
                    dest: "dist/gfx.json"
                },
                {
                    src: [
                        "database/events/seasons.json"
                    ],
                    dest: "dist/season.json"
                }
            ]
        }
    }
};