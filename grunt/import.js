module.exports = function (grunt) {
    var fs = require("fs"),
        fsExt = require("fs-extra"),
        http = require("http"),
        path = require("path"),
        gameVersion = "540",
        dataGet = "http://s3.amazonaws.com/dlcontent_frontier_android/" + gameVersion + "/info.json",
        hddPath = "E:/#trails/#TFunpacker/", // neofonie pc / cameo hdd
        versionPath = hddPath + gameVersion,
        phonePath = "Dieser PC\\Moto G\\Internal shared storage\\Android\\data\\com.ubisoft.redlynx.trialsfrontier.ggp",
        defaultExt = "txt",
        toExt = "json5",
        filesOfGame = ["bikes.", "customization.", "upgrades.", "level_rewards.", "levels."],
        bikesFile = "database/secret/" + gameVersion + "/" + filesOfGame[0],
        customsFile = "database/secret/" + gameVersion + "/" + filesOfGame[1],
        upgradesFile = "database/secret/" + gameVersion + "/" + filesOfGame[2],
        rewardsFile = "database/secret/" + gameVersion + "/" + filesOfGame[3],
        levelsFile = "database/secret/" + gameVersion + "/" + filesOfGame[4],
        dirsOfResource = [
            "/MENUZ/HOMESHACK", // customization _ON small _BIG maximal
            "/MENUZ/ITEM", // paintjob icons,
            "/MENUZ/WIDGETS/BIKES.png", // 14 paintjobs
            "/MENUZ/WIDGETS/BIKES2.png", // 31
            "/MENUZ/WIDGETS/BIKES3.png", // 33
            "/MENUZ/WIDGETS/BIKES4.png", // 14
            "/MENUZ/MENUZ/MAP/LAYER_0", // world 1
            "/MENUZ/MENUZ/MAP/LAYER_1", // world 2
        ]
    ;

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

    function downloadFile(url, pathDest, cb) {
        var http_or_https = http;
        if (/^https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url)) {
            http_or_https = https;
        }
        http_or_https.get(url, function (response) {
            var headers = JSON.stringify(response.headers);
            switch (response.statusCode) {
                case 200:
                    var file = fs.createWriteStream(pathDest);
                    response.on("data", function (chunk) {
                        file.write(chunk);
                    }).on("end", function () {
                        file.end();
                        cb(null);
                    });
                    break;
                case 301:
                case 302:
                case 303:
                case 307:
                    downloadFile(response.headers.location, pathDest, cb);
                    break;
                default:
                    cb(new Error("Server responded with status code " + response.statusCode));
            }

        })
            .on("error", function (err) {
                cb(err);
            });
    }

    grunt.registerTask("importGameDataS3", function () {
        var done = this.async(),
            filesToDownload = [];

        function downloadS3Data() {
            // get urls to files
            http.get(dataGet, function (res) {
                var body = "";
                res.on("data", function (chunk) {
                    body += chunk;
                });
                res.on("end", function () {
                    var response = JSON.parse(body);
                    console.log("downloading files from s3");
                    for (var i in response.content) {
                        var fileData = response.content[i],
                            fileSrc = fileData.url.replace("https", "http"),
                            fileDest = versionPath + "/" + fileData.name
                        ;
                        filesToDownload.push({
                            src: fileSrc,
                            dest: fileDest
                        });
                    }

                    downloadFiles();
                });
            }).on("error", function (e) {
                console.error("Got an error: ", e);
                done();
            });
        }

        function downloadFiles(index) {
            var downloadIndex = index || 0,
                downloadFileObj = filesToDownload[downloadIndex];

            if (downloadIndex === 0) {
                console.log("Download content files", filesToDownload.length);
            }

            if (!downloadFileObj) {
                console.log("All files downloaded.");
                done();
                return;
            }

            // download file
            console.log("Download", downloadIndex, downloadFileObj.src);
            downloadFile(downloadFileObj.src, downloadFileObj.dest, function () {
                downloadFiles(downloadIndex + 1);
            });
        }

        // start download
        downloadS3Data();
    });

    grunt.registerTask("importGameDataPhone", function () {
        // copy game content.dat
        if (fs.existsSync(phonePath)) {
            console.log("phone data exists");
        } else {
            console.error("Phone path dont exists", "'" + phonePath + "'");
            console.log("Copy 'content.dat' into", "'" + hddPath + "'");
            return;
        }
    });

    grunt.registerTask("importGameDataRaw", function () {
        var newContentPath = versionPath + "/all-in-one",
            confPath = versionPath + "/content/conf"
        ;

        function copyAllToOne(){
            if (fs.existsSync(confPath)) {
                // make one content repository
                console.log("Copy all dirs into one");
                ensureDirectoryExistence(newContentPath + "/import.json");
                var dirData = fs.readdirSync(versionPath);
                for (var i in dirData) {
                    var dir = dirData[i];
                    if (dir !== "all-in-one"
                        && dir !== "content"
                        && fs.lstatSync(versionPath + "/" + dir).isDirectory()) {
                        console.log("Copy: " + dir + " ...");
                        fsExt.copySync(versionPath + "/" + dir, newContentPath)
                    }
                }
                console.log("Copied all dirs to one", "'" + newContentPath + "'");
            }
        }

        function copyDbtoImport(){
            if (fs.existsSync(confPath)) {
                // copy gamedata import dir
                for (var i in filesOfGame) {
                    var fileSrc = confPath + "/" + filesOfGame[i] + defaultExt,
                        fileDest = "database/secret/" + gameVersion + "/" + filesOfGame[i] + defaultExt;
                    fsExt.copySync(fileSrc, fileDest);
                    console.log(fileDest + " copied...");
                }
            }
        }

        copyAllToOne();

        copyDbtoImport();
    });

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
    grunt.registerTask("importGameDataViaJson", function () {
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

            if (!Number.isNaN(trackID)) {
                newLevels.push(trackData);
            } else {
                unreleasedLevels.push(trackData);
            }
        }

        console.log("levels: ", newLevels.length)
        console.log("unreleased: ", unreleasedLevels.length)

        newLevels.sort(function (a, b) {
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

    // import data from
    // www.bit.ly/midnightchampteams
    // https://docs.google.com/spreadsheets/d/1AzHLhHP8i7QAXexPkiKnen_XrBHx9NBCtyl5rJb1mrA/edit#gid=0
    grunt.registerTask("importCSVMidnightChampTeams", function () {
        var fileData = fs.readFileSync("database/import/midnightchamps_2017.csv", "utf8"),
            fieldData = fileData.split("##\r\n"),
            finalData = {devices: ["Android", "iOS"], teams: {}};

        for (var i in fieldData) {
            var fieldsRaw = fieldData[i].split("\r\n"),
                headers = fieldsRaw[0].split(";"),
                fieldsDataRaw = fieldsRaw.splice(1, fieldsRaw.length - 2),
                lastTeamName = "",
                lastMemberIndex = 0;
            // fix csv end
            headers.push("Device");
            // iterate rows
            for (var j in fieldsDataRaw) {
                var fieldsData = fieldsDataRaw[j].split(";");
                for (var k in fieldsData) {
                    var isTeamName = headers[k] !== "Device",
                        value = fieldsData[k];
                    // cache teamName
                    if (isTeamName) {
                        lastTeamName = headers[k];
                    }
                    // create team
                    if (!(lastTeamName in finalData.teams)) {
                        finalData.teams[lastTeamName] = [];
                    }

                    // add team member
                    if (isTeamName) {
                        finalData.teams[lastTeamName].push({
                            name: value,
                            dvce: 0
                        });

                        lastMemberIndex = finalData.teams[lastTeamName].length - 1;
                    } else {
                        finalData.teams[lastTeamName][lastMemberIndex].dvce = finalData.devices.indexOf(value);
                    }
                }
            }
        }

        ensureDirectoryExistence("database/events/midnightchamps_2017.json");
        fs.writeFileSync("database/events/midnightchamps_2017.json", JSON.stringify(finalData));
    });
}