module.exports = function (shared) {
    // convert game data to trackmap data
    var JSON_ = (function () {
            var obj = {};
            for (var i in shared.workingFilesOfGame) {
                var file = shared.workingFilesOfGame[i],
                    json = require("../../" + file + shared.toExt),
                    key = file.split("/")[4].replace("\.", "");
                obj[key] = json;
            }

            obj.i18n = require("../../database/i18n/en.json");

            return obj;
        })(),
        trackKeys = Object.keys(JSON_.i18n.tracks),
        trackKeysOrdered = {},
        trackValues = shared.values(JSON_.i18n.tracks, true),
        trackValuesRaw = shared.values(JSON_.i18n.tracks),
        // Villages
        // Levels
        levelNames = [],
        levelNamesWithId = {},
        newLevels = [],
        unreleasedLevels = [],
        tmpData = {};

    // make data readable
    for (var i in JSON_.levels.Levels) {
        var level = JSON_.levels.Levels[i],
            name = (shared.renameTrack.hasOwnProperty(level.N)
                ? shared.renameTrack[level.N]
                : level.N)
                .toLowerCase()
                .replace("lvl_", "")
                .replace(/_/g, " "),
            trackIndex = trackValues.indexOf(name),
            // needable for i18n matching
            trackID = parseInt(trackKeys[trackIndex]),
            trackIDQuotes = "  ,\"" + trackID + "\":",
            rewardData = JSON_.level_rewards[level.I],
            trackData;

        // add name to levelNames
        if (shared._.startsWith(level.N, "LVL_")) {
            levelNames.push(level.N);
            levelNamesWithId[level.N] = trackID;
        }

        trackData = {
            name: name,
            i18n: trackValuesRaw[trackIndex],
            author: level.A,
            oriID: level.ID,
            tier: {
                int: level.D,
                dbStr: trackIDQuotes + " " + (level.D)
            },
            world: level.L + 1,
            coins: level.C,
            fuel: level.FU,
            trackID: trackID,
            trackIDOrigin: level.N,
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

        if (!Number.isNaN(trackID)) {
            newLevels.push(trackData);
        } else {
            unreleasedLevels.push(trackData);
        }
    }

    console.log("levels: ", newLevels.length);
    console.warn("unreleased: ", unreleasedLevels.map(function (track) {
        return track.name + " '" + track.trackIDOrigin + "'";
    }));

    newLevels.sort(function (a, b) {
        return a.trackID - b.trackID;
    });

    // write new db files
    tmpData.partsData = "";
    tmpData.timesData = "";
    tmpData.tierData = "";
    for (var i in newLevels) {
        var str = newLevels[i].rewards.dbStr;
        tmpData.partsData += str + "\n";
        tmpData.timesData += newLevels[i].time.dbStr + "\n";
        tmpData.tierData += newLevels[i].tier.dbStr + "\n";
    }
    tmpData.partsData = tmpData.partsData.replace("  ,", "{\n   ") + "}";
    tmpData.timesData = tmpData.timesData.replace("  ,", "{\n   ") + "}";
    tmpData.tierData = tmpData.tierData.replace("  ,", "{\n   ") + "}";

    shared.ensureDirectoryExistence("build/import/parts.json");
    shared.fs.writeFileSync("build/import/parts.json", tmpData.partsData);
    shared.fs.writeFileSync("build/import/times.json", tmpData.timesData);
    shared.fs.writeFileSync("build/import/tiers.json", tmpData.tierData);
    shared.fs.writeFileSync(shared.i18nPath + "/names.txt", levelNames.join("\r\n"));
    shared.fs.writeFileSync("build/import/names-with-ids.json", JSON.stringify(levelNamesWithId));
};