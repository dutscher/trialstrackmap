module.exports = function (grunt) {
    var _ = require("lodash"),
        fs = require("fs"),
        fsExt = require("fs-extra"),
        http = require("http"),
        https = require("https"),
        path = require("path"),
        consts = require("./import/00.const.js"),
        // VARS
        gameVersion = require("../database/map.json").stats.app_version.replace(/\./g, ""),
        hddPath = function () {
            var dirOnStation = consts.drives.find(function (pathToDir) {
                return fs.existsSync(pathToDir + consts.trialsUtilsDir);
            });
            //console.log("dirOnStation", dirOnStation);
            return dirOnStation ? dirOnStation + consts.trialsUtilsDir + "/" : "";
        }(),
        toolPath = (function () {
            var obj = {};
            consts.tools.map(function (name) {
                obj[name] = hddPath ? hddPath + "#" + name.toLowerCase() : "";
            });
            return obj;
        })(),
        importPath = hddPath + gameVersion,
        importedPath = consts.importedPath.replace("${gameVersion}", gameVersion),
        newContentPath = importPath + "/" + consts.allInOneDir,
        filesOfGame = consts.filesOfGame.map(function (name) {
            return name + ".";
        }),
        workingFilesOfGame = _.extend([], filesOfGame)
            .map(function (name) {
                return importedPath + "/" + name;
            }),
        dates = [];
    // put them together
    var importShared = _.extend({}, require("./import/00.utils.js")(grunt, http, https, path, fs, fsExt), {
        grunt: grunt,
        _: _,
        fs: fs,
        fsExt: fsExt,
        http: http,
        https: https,
        versionPath: importPath,
        secretPath: importedPath,
        dataGet: consts.cloudPath.replace("${gameVersion}", gameVersion),
        hddPath: hddPath,
        toolPath: toolPath,
        gameVersion: gameVersion,
        newContentPath: newContentPath,
        i18nPath: newContentPath + "/gen/lang",
        confPath: newContentPath + "/conf",
        appPath: consts.appPath,
        appId: consts.appId,
        androidPath: consts.androidPath,
        allInOneDir: consts.allInOneDir,
        filesOfGame: filesOfGame, // !!!
        workingFilesOfGame: workingFilesOfGame,
        defaultExt: consts.defaultExt,
        toExt: consts.toExt,
        // use this map for matching/renaming it to match the i18n
        renameTrack: consts.renameTrack,
    });

    for (var i in consts.importTasks) {
        var importTask = consts.importTasks[i];
        importShared.createTask(importTask, importShared, function () {
            dates.push(new Date());
        });
    }

    grunt.registerTask("importPrintDates", function () {
        console.log(dates);
    });
};