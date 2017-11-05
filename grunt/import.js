module.exports = function (grunt) {
    /*
     /MENUZ/HOMESHACK // customization _ON small _BIG maximal
     /MENUZ/ITEM // paintjob icons,
     /MENUZ/WIDGETS/BIKES.png // 14 paintjobs
     /MENUZ/WIDGETS/BIKES2.png // 31
     /MENUZ/WIDGETS/BIKES3.png // 33
     /MENUZ/WIDGETS/BIKES4.png // 14
     /MENUZ/MENUZ/MAP/LAYER_0 // world 1
     /MENUZ/MENUZ/MAP/LAYER_1 // world 2
     */
    // VARS
    var gameVersion = "560",
        drive = "C:/www/", // hp lappy / WIN7
        //drive = "E:/#trails/", // neofonie pc / cameo hdd / WIN10
        //drive = "C:/www/software/", // thinkpad neo / WIN10
        // CONST
        dataGet = "http://s3.amazonaws.com/dlcontent_frontier_android/" + gameVersion + "/info.json",
        hddPath = drive + "#TFunpacker/",
        toolPath = {
            hashes: hddPath + "#hashes",
            bin2Txt: hddPath + "#bin2txt",
            unpacker: hddPath + "#unpacker",
            adb: hddPath + "#adb"
        },
        versionPath = hddPath + gameVersion,
        allInOneDir = "#content",
        newContentPath = versionPath + "/" + allInOneDir,
        i18nPath = newContentPath + "/content/gen/lang",
        confPath = newContentPath + "/content/conf",
        defaultExt = "txt",
        toExt = "json5",
        filesOfGame = ["bikes.", "customization.", "upgrades.", "level_rewards.", "levels."],
        secretPath = "database/secret/" + gameVersion + "/",
        bikesFile = secretPath + filesOfGame[0],
        customsFile = secretPath + filesOfGame[1],
        upgradesFile = secretPath + filesOfGame[2],
        rewardsFile = secretPath + filesOfGame[3],
        levelsFile = secretPath + filesOfGame[4],
        // node modules
        fs = require("fs"),
        _ = require("lodash"),
        fsExt = require("fs-extra"),
        http = require("http"),
        path = require("path"),
        dates = [];

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

    function copyToolTo(from, to) {
        console.log("copyToolTo", from, to);
        if (fs.existsSync(from)) {
            var dirData = fs.readdirSync(from);
            for (var i in dirData) {
                var dir = dirData[i];
                if (!fs.existsSync(to + "/" + dir) || dir === "main.cpp") {
                    console.log("Copy: " + dir + " to " + to);
                    fsExt.copySync(from + "/" + dir, to + "/" + dir);
                } else {
                    console.info("Exists already: " + dir + " to " + to);
                }
            }
        }
    }

    function makeWinPath(path) {
        return path.replace(/\//g, "\\");
    }

    function deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    grunt.registerTask("import1GameDataPhone", function () {
        dates.push(new Date());
        var cmds = [
            "echo move to " + makeWinPath(toolPath.adb),
            "pushd " + makeWinPath(toolPath.adb), // navigate to adb tool
            "adb devices", // test if device is ready
            "adb pull /sdcard/Android/data/com.ubisoft.redlynx.trialsfrontier.ggp " + makeWinPath(versionPath) // pull files
        ];
        grunt.config("exec.copyContentViaAdb.cmd", cmds.concat(["echo 'run adb pull'"]).join(" & "));
        ensureDirectoryExistence(versionPath + "/adb.jo");
        grunt.task.run(["exec:copyContentViaAdb", "import2GameDataS3"]);
    });

    grunt.registerTask("import2GameDataS3", function () {
        dates.push(new Date());
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
                allFilesDownloaded();
                return;
            }

            // download file
            console.log("Download", downloadIndex, downloadFileObj.src);
            downloadFile(downloadFileObj.src, downloadFileObj.dest, function () {
                downloadFiles(downloadIndex + 1);
            });
        }

        function allFilesDownloaded() {
            grunt.task.run("import3DoUnpacking");
        }

        // start download
        ensureDirectoryExistence(versionPath + "/amazon.jo");
        downloadS3Data();
    });

    grunt.registerTask("import3DoUnpacking", function () {
        dates.push(new Date());
        copyToolTo(toolPath.unpacker, versionPath);

        var scriptAll = "unpacker-mod-all.cmd",
            scriptPng = "unpacker-mod-to-png.cmd",
            cmds = ["pushd " + makeWinPath(versionPath)];

        grunt.config("exec.unpackerAll.cmd", cmds.concat(["echo 'run dat to dir'", scriptAll]).join(" & "));
        grunt.config("exec.unpackerPng.cmd", cmds.concat(["echo 'run pvr to png'", scriptPng]).join(" & "));

        grunt.task.run(["exec:unpackerAll", "exec:unpackerPng", "import4DoPackagesToOneDir"]);
    });

    grunt.registerTask("import4DoPackagesToOneDir", function () {
        dates.push(new Date());
        function copyAllToOne() {
            // make one content repository
            console.log("Copy all dirs into one");
            ensureDirectoryExistence(newContentPath + "/import.json");
            // remove unused dir
            if (fs.existsSync(versionPath + "/files")) {
                fs.unlinkSync(versionPath + "/files"); // remove dir
            }

            var dirData = fs.readdirSync(versionPath);
            for (var i in dirData) {
                var dir = dirData[i];
                if (dir !== allInOneDir
                    && fs.lstatSync(versionPath + "/" + dir).isDirectory()) {
                    console.log("Copy: " + dir + " to ", newContentPath, "and remove src");
                    fsExt.copySync(versionPath + "/" + dir, newContentPath);
                    // after extract remove or move
                    deleteFolderRecursive(versionPath + "/" + dir); // remove dir
                }
            }
            console.log("Copied all dirs to one", "'" + newContentPath + "'");
        }

        function copyDbtoImport() {
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

        grunt.task.run("import5ConvertOri2Json");
    });

    // rename ori files to json to parse via js
    grunt.registerTask("import5ConvertOri2Json", function () {
        dates.push(new Date());
        var detectRepairs = [
                "    \}\r\n    \{",
                "   \}\r\n   \{",
                "\}\r\n\t\{",
                "\t}\r\n\t{\r\n",
                " \]\r\n \""
            ],
            repairWith = [
                "},\n{\n", // bikes.txt
                "},\n{\n", // bikes.txt
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
                    };
                }
            }
            //fs.renameSync(fileNameOld, fileNameNew);
            fs.writeFileSync(fileNameNew, JSON.stringify(newData, null, 2));
        }

        grunt.task.run("import6GameDataViaJson");
    });

    // convert game data to trackmap data
    grunt.registerTask("import6GameDataViaJson", function () {
        dates.push(new Date());
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
            levelNames = [],
            levelNamesWithId = {},
            newLevels = [],
            unreleasedLevels = [],
            tmpData = {},
            renameTrack = {
                "LVL_SPINNERS_ALLEY": "Spinner's Alley",
                "LVL_HILLTOP_CHETTO": "Hilltop Ghetto",
                "LVL_STILTED_PATHWAY": "Stilted Path",
                "LVL_CRANE_PEEK": "Crane Peak"
            };

        // make data readable
        for (var i in levelsJSON.Levels) {

            var level = levelsJSON.Levels[i],
                name = (renameTrack.hasOwnProperty(level.N) ? renameTrack[level.N] : level.N).toLowerCase().replace("lvl_", "").replace(/_/g, " "),
                trackIndex = trackValues.indexOf(name),
                trackID = parseInt(trackKeys[trackIndex]),
                trackIDQuotes = "  ,\"" + trackID + "\":",
                rewardData = rewardsJSON[level.I],
                trackData;

            // add name to levelNames
            if (_.startsWith(level.N, "LVL_")) {
                levelNames.push(level.N);
                levelNamesWithId[level.N] = trackID;
            }

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

        console.log("levels: ", newLevels.length);
        console.log("unreleased: ", unreleasedLevels.length);

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
        fs.writeFileSync(i18nPath + "/names.txt", levelNames.join("\r\n"));
        fs.writeFileSync("build/import/names-with-ids.json", JSON.stringify(levelNamesWithId));

        grunt.task.run(["import7ConvertLanguages"]);
    });

    grunt.registerTask("import7ConvertLanguages", function () {
        dates.push(new Date());
        copyToolTo(toolPath.bin2Txt, i18nPath);

        var scriptAll = "bin2txt.cmd",
            cmds = ["pushd " + makeWinPath(i18nPath)];

        grunt.config("exec.i18nBin2Txt.cmd", cmds.concat(["echo 'convert bin to txt'", scriptAll]).join(" & "));

        grunt.task.run(["exec:i18nBin2Txt", "import8GetLanguageHashes"]);
    });

    grunt.registerTask("import8GetLanguageHashes", function () {
        dates.push(new Date());
        copyToolTo(toolPath.hashes, i18nPath);

        var scriptAll = "hashtest.cmd",
            cmds = ["pushd " + makeWinPath(i18nPath)];

        grunt.config("exec.i18nHashes.cmd", cmds.concat(["echo 'get hashes'", scriptAll]).join(" & "));

        grunt.task.run(["exec:i18nHashes", "import9GetTrackNamesViaHashes"]);
    });

    grunt.registerTask("import9GetTrackNamesViaHashes", function () {
        dates.push(new Date());
        var fileData = fs.readFileSync(i18nPath + "/hashes.txt", "utf8"),
            rowsFileData = fileData.split("\r\n"),
            fileDataWithIds = require("../build/import/names-with-ids.json"),
            hashes = {},
            levels = {};
        // jsonfy hashes
        for (var i in rowsFileData) {
            var rowData = rowsFileData[i].split("\t");
            if (rowData[0]) {
                levels[rowData[0]] = {hash: rowData[1].toUpperCase(), id: fileDataWithIds[rowData[0]], i18n: {}};
                hashes[rowData[1].toUpperCase()] = rowData[0];
            }
        }

        // read strings from all *_strings.txt files
        var dirData = fs.readdirSync(i18nPath),
            i18nMap = {
                braz_portuguese: "br",
                english: "en",
                spanish: "es",
                french: "fr",
                german: "de",
                italian: "it",
                russian: "ru",
                korean: "kp",
                japanese: "jp",
                trad_chinese: "tcn",
                simp_chinese: "cn"
            };

        for (var j in dirData) {
            var file = dirData[j].toLowerCase();
            if (_.endsWith(file, "_strings.txt")) {
                // iterate strings
                var fileDataJo = fs.readFileSync(i18nPath + "/" + file, "utf8"),
                    fileLang = file.replace("_strings.txt", ""),
                    rowsJo = fileDataJo.split("\r\n");
                // convert them to lvl objects
                for (var k in rowsJo) {
                    var rowDataJO = rowsJo[k].split("\t"),
                        hash = rowDataJO[0], trackName = rowDataJO[1];
                    if (hashes.hasOwnProperty(hash)) {
                        var trackLVLtag = hashes[hash];
                        levels[trackLVLtag].i18n[i18nMap[fileLang]] = trackName;
                    }
                }
            }
        }
        // now we have
        /*
         levels = LVL_WRECKED_TRACKS:
         { hash: '957C09D8',
         id: 128,
         i18n:
         { br: 'Pistas Arruinadas',
         en: 'Wrecked Tracks',
         fr: 'Rails brisés',
         de: 'Zertrümmerte Strecken',
         it: 'Tracciati distrutti',
         jp: 'レックトラック',
         kp: '파손 트랙',
         ru: 'Разрушенные пути',
         cn: '失事赛道',
         es: 'Pistas destruidas',
         tcn: '迷幻賽道' } } }

         */

        // compare levels and languages
        var i18nFiles = {};
        for (var track in levels) {
            var trackData = levels[track];
            for (var i18nLang in trackData.i18n) {
                var i18nName = trackData.i18n[i18nLang],
                    trackId = trackData.id;
                if (!i18nFiles.hasOwnProperty(i18nLang)) {
                    i18nFiles[i18nLang] = {tracks: {}, unreleased: []};
                }
                if (trackId === null) {
                    i18nFiles[i18nLang].unreleased.push(i18nName);
                } else {
                    i18nFiles[i18nLang].tracks[trackId] = i18nName;
                }
            }
        }

        //console.log(i18nFiles);
        // write i18n files
        ensureDirectoryExistence("build/import/i18n/de.json");
        for (var file in i18nFiles) {
            var fileData = i18nFiles[file];

            fileData.unreleased.sort();

            fs.writeFileSync("build/import/i18n/" + file + ".json", JSON.stringify(fileData, null, 2));
        }

        console.log("all files are written");
    });

    grunt.registerTask("importPrintDates", function () {
        console.log(dates);
    })
};