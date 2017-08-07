module.exports = function (grunt) {
    var fs = require("fs"),
        path = require("path"),
        gameVersion = "530",
        defaultExt = "txt",
        toExt = "json5",
        bikesFile = "database/secret/" + gameVersion + "/bikes.",
        customsFile = "database/secret/" + gameVersion + "/customization.",
        upgradesFile = "database/secret/" + gameVersion + "/upgrades.",
        rewardsFile = "database/secret/" + gameVersion + "/level_rewards.",
        levelsFile = "database/secret/" + gameVersion + "/levels.";

    function values(obj, toLowerCase) {
        var vals = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                vals.push(toLowerCase ? obj[key].toLowerCase() : obj[key]);
            }
        }
        return vals;
    }

    function ensureDirectoryExistence(filePath) {
        var dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    // rename ori files to json to parse via js
    grunt.registerTask("importConvertOri2Json", function () {
        var detectRepairs = [
                "    \}\r\n    \{",
                "\t}\r\n\t{\r\n",
                " \]\r\n \""
            ],
            repairWith = [
                "},\n{\n", // bikes.txt
                "},\n{\n", // bikes.txt
                "],\n\"" // levels.txt
            ],
            files = [
                bikesFile,
                customsFile,
                upgradesFile,
                levelsFile
            ],
            fileNameOld,
            fileNameNew,
            fileData = "",
            newData = {};
        // rename files /////////////////
        for (var i in files) {
            fileNameOld = files[i] + defaultExt;
            fileNameNew = files[i] + toExt;
            if (fs.existsSync(fileNameOld)) {
                console.log("rename: ", fileNameOld, "->", fileNameNew);
                fs.renameSync(fileNameOld, fileNameNew);
                // repair files if json mismatch are exists
                fileData = fs.readFileSync(fileNameNew, "utf8");
                var reg, repaired = false;
                for (var j in detectRepairs) {
                    reg = new RegExp(detectRepairs[j], "g");
                    if (reg.test(fileData)) {
                        repaired = true;
                        fileData = fileData.replace(reg, repairWith[j]);
                    }
                }
                // if some match is fixxed write it down
                if (repaired) {
                    console.log("repair: ", fileNameNew);
                    fs.writeFileSync(fileNameNew, fileData);
                }
            } else {
                console.error("no file exists or already renamed: ", fileNameOld);
            }
        }
        // convert file txt2json ////////
        fileNameOld = rewardsFile + defaultExt;
        fileNameNew = rewardsFile + toExt;
        if (fs.existsSync(fileNameOld)) {
            fileData = fs.readFileSync(fileNameOld, "utf8");
            // repair newlines
            fileData = fileData.replace(/\r\n/g, "\n");
            fileData = fileData.replace("#OVERRIDE 500", "#\n#\n#OVERRIDE 500");
            fileData = fileData.replace(/#\n#\n#\n/g, "#\n#\n");
            // split into id's
            fileData = fileData.split("#\n#\n");

            // walk through data
            for (var i in fileData) {
                var str = fileData[i].toLowerCase(),
                    rewardData = [],
                    tmpData = {};

                if (str.indexOf("# ") === -1
                    && str.indexOf("override") === -1) {
                    rewardData = str.split("\n");
                    tmpData.id = rewardData[1];
                    tmpData.name = rewardData[0].replace("#", "");
                    // rewards
                    tmpData.rewards = [];
                    tmpData.rewards.push(rewardData[2].replace("i,", "").split(","));
                    tmpData.rewards.push(rewardData[3].replace("i,", "").split(","));
                    tmpData.rewards.push(rewardData[4].replace("i,", "").split(","));
                    tmpData.rewards.push(rewardData[5].replace("i,", "").split(","));
                    // create tmpdata
                    tmpData.rewardData = {};
                    for (var j in tmpData.rewards) {
                        var reward = tmpData.rewards[j];
                        // raise level one plus
                        reward[1] = parseInt(reward[1]) + 1;
                        // create part level
                        if (!tmpData.rewardData.hasOwnProperty(reward[1])) {
                            tmpData.rewardData[reward[1]] = [];
                        }
                        // add part id
                        tmpData.rewardData[reward[1]].push(parseInt(reward[0]));
                    }
                    // make new data
                    newData[tmpData.id] = {
                        name: tmpData.name,
                        rewardStr: JSON.stringify(tmpData.rewardData),
                        xp: rewardData[6].replace("x,", ""),
                        diamonds: rewardData[7].replace("d,", "")
                    }
                }
            }
            //fs.renameSync(fileNameOld, fileNameNew);
            fs.writeFileSync(fileNameNew, JSON.stringify(newData, null, 2));
        }
    });

    // convert game data to trackmap data
    grunt.registerTask("importGameData", function () {
        require("json5/lib/require");

        var bikesJSON = require("../" + bikesFile + toExt),
            customsJSON = require("../" + customsFile + toExt),
            rewardsJSON = require("../" + rewardsFile + toExt),
            upgradesJSON = require("../" + upgradesFile + toExt),
            i18nJSON = require("../database/i18n/en.json"),
            trackKeys = Object.keys(i18nJSON.tracks),
            trackKeysOrdered = {},
            trackValues = values(i18nJSON.tracks, true),
            trackValuesRaw = values(i18nJSON.tracks),
            // Villages
            // Levels
            levelsJSON = require("../" + levelsFile + toExt),
            newLevels = [],
            unreleasedLevels = [],
            tmpData = {};
        // make data readable
        for (var i in levelsJSON.Levels) {
            var level = levelsJSON.Levels[i],
                name = level.N.toLowerCase().replace("lvl_", "").replace(/_/g, " "),
                trackIndex = trackValues.indexOf(name),
                trackID = parseInt(trackKeys[trackIndex]),
                trackIDQuotes = "  ,\"" + trackID + "\":",
                rewardData = rewardsJSON[level.I],
                trackData;

            trackData = {
                name: name,
                i18n: trackValuesRaw[trackIndex],
                author: level.A,
                oriID: level.ID,
                tier: level.B + 1,
                world: level.L + 1,
                coins: level.C,
                fuel: level.FU,
                trackID: trackID,
                rewards: {
                    dbStr: rewardData ? trackIDQuotes + rewardData.rewardStr : {},
                    id: level.I
                },
                time: {
                    dbStr: trackIDQuotes + "[" +
                    "\"" + level.F2 + "|" + level.M2 + "\"," +
                    "\"" + level.F1 + "|" + level.M1 + "\"," +
                    "\"" + level.F0 + "|" + level.M0 + "\"" +
                    "]",
                    clear: {
                        bronze: {
                            time: level.M2,
                            faults: level.F2
                        },
                        silver: {
                            time: level.M1,
                            faults: level.F1
                        },
                        platinum: {
                            time: level.M0,
                            faults: level.F0
                        }
                    }
                }
            };

            if(!Number.isNaN(trackID))
                newLevels.push(trackData);
            else
                unreleasedLevels.push(trackData);
        }

        console.log("levels: ", newLevels.length)
        console.log("unreleased: ", unreleasedLevels.length)

        newLevels.sort(function(a, b) {
            return a.trackID - b.trackID;
        });

        // write new db files
        tmpData.partsData = "";
        tmpData.timesData = "";
        for (var i in newLevels) {
            var str = newLevels[i].rewards.dbStr;
            tmpData.partsData += str + "\n";
            tmpData.timesData += newLevels[i].time.dbStr + "\n";
        }
        tmpData.partsData = tmpData.partsData.replace("  ,", "{\n   ") + "}";
        tmpData.timesData = tmpData.timesData.replace("  ,", "{\n   ") + "}";

        ensureDirectoryExistence("build/import/parts.json");
        fs.writeFileSync("build/import/parts.json", tmpData.partsData);
        fs.writeFileSync("build/import/times.json", tmpData.timesData);
    });

}
