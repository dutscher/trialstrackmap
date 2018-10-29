module.exports = function (shared) {
    // convert game data to trackmap data
    const i18nDefaultFile = "database/i18n/en.json",
        fuelToTier = {
            0: 0,
            5: 1,
            7: 2,
            10: 3,
        },
        worldCoordsDifference = [
            {x: 2035, y: 949},
            {x: 2049, y: 1015},
        ],
        JSON_ = (function () {
            const obj = {};
            for (const i in shared.workingFilesOfGame) {
                const file = shared.workingFilesOfGame[i];
                const key = file.split("/")[4].replace("\.", "");
                obj[key] = require("../../" + file + shared.toExt);
            }
            obj.i18n = require("../../" + i18nDefaultFile);
            return obj;
        })(),
        trackKeys = Object.keys(JSON_.i18n.tracks),
        trackValues = shared.values(JSON_.i18n.tracks, true),
        trackValuesRaw = shared.values(JSON_.i18n.tracks),
        // Villages
        // Levels
        levelNames = [],
        levelNamesWithId = {},
        newLevels = [],
        knownUnreleasedLevels = [],
        unreleasedLevels = [],
        tmpData = {};

    // make data readable
    for (const i in JSON_.levels.Levels) {
        const level = JSON_.levels.Levels[i],
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
            coords = {
                x: level.X !== -10000 ? level.X + worldCoordsDifference[level.L].x : -1,
                y: level.Y !== -10000 ? level.Y + worldCoordsDifference[level.L].y : -1,
            };
        let trackData;

        // add name to levelNames
        if (shared._.startsWith(level.N, "LVL_")) {
            levelNames.push(level.N);
            levelNamesWithId[level.N] = trackID;
        }

        trackData = {
            name,
            upperName: name.replace(/\b\w/g, l => l.toUpperCase()),
            i18n: trackValuesRaw[trackIndex],
            author: level.A,
            oriID: level.ID,
            idStr: "  // " + trackValuesRaw[trackIndex] + "\n" +
            "  {\n" +
            "    \"id\": " + trackID + ",\n" +
            "    \"oid\": " + level.ID +
            (level.L + 1 === 2 ? "," : "") + "\n" +
            (level.L + 1 === 2 ? "    \"world\": 2\n" : "") +
            "  },",
            tier: {
                int: fuelToTier[level.FU],
                dbStr: trackIDQuotes + " " + (fuelToTier[level.FU])
            },
            world: level.L + 1,
            coins: level.C,
            fuel: level.FU,
            trackID: trackID,
            trackIDOrigin: level.N,
            coords: {
                x: coords.x,
                y: coords.y,
                dbStr: coords.x !== -1 ? trackIDQuotes + " \"" + coords.x + "," + coords.y + "\"" : "",
            },
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
        // test tracks aka
        } else if(JSON_.i18n.unreleased.indexOf(trackData.upperName) !== -1) {
            knownUnreleasedLevels.push(trackData.upperName);
        // new tracks
        } else {
            unreleasedLevels.push(trackData);
        }
    }

    const lastId = trackKeys[trackKeys.length - 1];
    const newLevelsNotInI18NObj = {};
    let nextId = lastId;
    unreleasedLevels.map((track) => {
        nextId++;
        newLevelsNotInI18NObj[nextId] = track.upperName;
    });
    console.log("levels:", newLevels.length, `nextId: ${lastId}`,
        "\nknownUnreleasedLevels:", knownUnreleasedLevels.length, knownUnreleasedLevels,
        "\nunreleasedLevels:", unreleasedLevels.length);
    console.log(shared.print(shared.flat.flatten(newLevelsNotInI18NObj)),
        "\nadd them to renameTrack in 00.const.js or",
        "\nadd them to", i18nDefaultFile);

    newLevels.sort(function (a, b) {
        return a.trackID - b.trackID;
    });

    // write new db files
    tmpData.partsData = "";
    tmpData.timesData = "";
    tmpData.tierData = "";
    tmpData.idData = "";
    tmpData.coordsData = "";
    // add all lines
    for (const i in newLevels) {
        const str = newLevels[i].rewards.dbStr;
        tmpData.partsData += str + "\n";
        tmpData.timesData += newLevels[i].time.dbStr + "\n";
        tmpData.tierData += newLevels[i].tier.dbStr + "\n";
        tmpData.idData += newLevels[i].idStr + "\n";
        tmpData.coordsData += newLevels[i].coords.dbStr !== "" ? newLevels[i].coords.dbStr + "\n" : "";
    }
    tmpData.partsData = tmpData.partsData.replace("  ,", "{\n   ") + "}";
    tmpData.timesData = tmpData.timesData.replace("  ,", "{\n   ") + "}";
    tmpData.tierData = tmpData.tierData.replace("  ,", "{\n   ") + "}";
    tmpData.idData = tmpData.idData.replace("  ,", "{\n   ") + "}";
    tmpData.coordsData = tmpData.coordsData.replace("  ,", "{\n   ") + "}";

    shared.ensureDirectoryExistence("build/import/parts.json");
    shared.fs.writeFileSync("build/import/parts.json", tmpData.partsData);
    shared.fs.writeFileSync("build/import/times.json", tmpData.timesData);
    shared.fs.writeFileSync("build/import/tiers.json", tmpData.tierData);
    shared.fs.writeFileSync("build/import/ids.json", tmpData.idData);
    shared.fs.writeFileSync("build/import/coords.json", tmpData.coordsData);
    shared.fs.writeFileSync(shared.i18nPath + "/names.txt", levelNames.join("\r\n"));
    shared.fs.writeFileSync("build/import/names-with-ids.json", JSON.stringify(levelNamesWithId));
};