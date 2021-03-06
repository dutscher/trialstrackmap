module.exports = function (grunt) {
    var config = {
        database: {
            files: {
                "build/map.json": [
                    "database/{map,rider2country,ferries}.json",
                    "database/trackdata/*.json",
                    "database/media/*.json"
                ]
            }
        },
        jsonWithComments: {
            files: {
                "build/bikes.json": [
                    "build/bikes.json"
                ],
                "build/hunt-events.json": [
                    "database/events/hunt/*.json"
                ]
            }
        },
        rawToDist: {
            files: {
                "dist/json/gfx.json": [
                    "database/media/gfx.json"
                ]
            }
        },
        danTeam: {
            files: {
                "build/danteam/danteam.json": [
                    "build/danteam/teamTimes.json",
                    "build/danteam/teams.json"
                ]
            }
        }
    };

    grunt.registerTask("concatDatabase", function () {
        // all jsons to one
        grunt.task.run([
            "concat-json:database",
            "concat-json:danTeam"
        ]);
        // jsons with comments
        grunt.task.run([
            "copy:jsonWithCommentsToBuild",
            "concat-json:jsonWithComments",
            "copy:jsonWithCommentsToDist"
        ]);
        // seasons concat
        grunt.task.run("concatSeasonsData");
    });

    grunt.registerTask("concatSeasonsData", function () {
        var fs = require("fs"),
            distFilePath = "dist/json/seasons.json",
            prizesFile = "prizes.json",
            seasonIndex = 1,
            seasonsFile = {
                "_prizes": {},
                "_seasons": []
            },
            list = function (path) {
                fs.readdirSync(path).forEach(function (file) {
                    if(file.indexOf(".compare") !== -1)
                        return;

                    if (fs.lstatSync(path + "/" + file).isDirectory()) {
                        // read dir and step into
                        list(path + "/" + file);
                    } else if (file === prizesFile) {
                        // read prizes
                        seasonsFile._prizes = require("../" + path + "/" + file);
                    } else {
                        // read season
                        var seasonX = require("../" + path + "/" + file);
                        seasonX.id = seasonIndex;
                        seasonsFile._seasons.push(seasonX);
                        seasonIndex++;
                    }
                });
            };
        // start read seasons
        list("database/events/seasons");
        // make last season active
        seasonsFile._seasons[seasonIndex - 2].active = true;
        seasonsFile._active_season = seasonIndex - 2;
        // write file to dist
        grunt.file.write(distFilePath, JSON.stringify(seasonsFile, null, 2));
    });

    return config;
};