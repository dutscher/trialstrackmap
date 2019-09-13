module.exports = function (grunt) {
    var package = grunt.config("pkg"),
        _ = require("lodash"),
        fs = require("fs"),
        fsExt = require("fs-extra"),
        flat = require("flat"),
        http = require("http"),
        https = require("https"),
        path = require("path"),
        encoding = require("text-encoding"),
        consts = require("./import/00.const.js"),
        // VARS
        gameVersion = package.version.replace(/\./g, ""),
        gameVersionRaw = package.version,
        seasonID = package.seasonID,
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
        cachePath = hddPath + consts.s3Cache,
        newContentPath = importPath + "/" + consts.allInOneDir,
        filesOfGame = consts.filesOfGame.map(name => `${name}.` ),
        workingFilesOfGame = _
            .extend([], filesOfGame)
            .map(name => `${importedPath}/${name}`),
        dates = [];
    // put them together
    const importShared = _.extend({}, require("./import/00.utils.js")(grunt, http, https, path, fs, fsExt), {
        grunt,
        _: _,
        fs: fs,
        fsExt: fsExt,
        encoding: encoding,
        http,
        https,
        flat,
        versionPath: importPath,
        versionPathRepo: importPath,
        cachePath,
        secretPath: importedPath,
        dataGet: consts.cloudPath.replace("${gameVersion}", gameVersion),
        hddPath,
        toolPath,
        gameVersion,
        gameVersionRaw,
        seasonID,
        newContentPath,
        i18nPath: newContentPath + "/gen/lang",
        confPath: newContentPath + "/conf",
        appPath: consts.appPath,
        appId: consts.appId,
        androidPath: consts.androidPath,
        androidScreenshots: consts.androidScreenshots,
        allInOneDir: consts.allInOneDir,
        filesOfGame,// !!!
        assetsOfGame: consts.assetsOfGame,
        appFiles: consts.appFiles,
        seasonInfo: consts.seasonInfo,
        workingFilesOfGame,
        defaultExt: consts.defaultExt,
        toExt: consts.toExt,
        // use this map for matching/renaming it to match the i18n
        renameTrack: consts.renameTrack,
        convertCostumStr: consts.convertCostumStr,
        pjMatcher: consts.pjMatcher,
        pjRenames: consts.pjRenames,
        idsOfSeasonPrizes: consts.idsOfSeasonPrizes,
        i18nMap: consts.i18nMap,
        pjAddons: consts.pjAddons,
    });

    for (var i in consts.importTasks) {
        var importTask = consts.importTasks[i];
        importShared.createTask(importTask, importShared, () => {
            dates.push(new Date());
        });
    }

    grunt.registerTask("importPrintDates", function () {
        console.log(dates);
    });
};