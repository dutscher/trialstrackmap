module.exports = function (shared) {
    shared.grunt.registerTask("import-07-i18n-convert", () => {
        shared.copyToolTo(shared.toolPath.bin2Txt, shared.i18nPath);
        var scriptAll = "bin2txt.cmd",
            cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

        shared.grunt.config("exec.i18nBin2Txt.cmd", cmds.concat(["echo 'convert bin to txt'", scriptAll]).join(" & "));

        shared.grunt.task.run(["exec:i18nBin2Txt"]);
    });

    shared.grunt.registerTask("import-07-i18n-getHashes", () => {
        shared.copyToolTo(shared.toolPath.hashes, shared.i18nPath);
        var scriptAll = "hashtest.cmd",
            cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

        shared.grunt.config("exec.i18nHashes.cmd", cmds.concat(["echo 'get hashes'", scriptAll]).join(" & "));

        shared.grunt.task.run(["exec:i18nHashes"]);
    });

    shared.grunt.registerTask("import-07-i18n-getTrackNames", () => {
        var fileData = shared.fs.readFileSync(shared.i18nPath + "/hashes.txt", "utf8"),
            rowsFileData = fileData.split("\r\n"),
            fileDataWithIds = require("../../build/import/names-with-ids.json"),
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
        var dirData = shared.fs.readdirSync(shared.i18nPath),
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
            if (shared._.endsWith(file, "_strings.txt")) {
                // iterate strings
                var fileDataJo = shared.fs.readFileSync(shared.i18nPath + "/" + file, "utf8"),
                    fileLang = file.replace("_strings.txt", ""),
                    rowsJo = fileDataJo.split("\r\n");
                // convert them to lvl objects
                for (var k in rowsJo) {
                    // iterate the complete game i18n hashes
                    var rowDataJO = rowsJo[k].split("\t"),
                        hash = rowDataJO[0],
                        trackName = rowDataJO[1];
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
        shared.ensureDirectoryExistence("build/import/i18n/de.json");
        for (var file in i18nFiles) {
            var fileData = i18nFiles[file];

            fileData.unreleased.sort();

            shared.fs.writeFileSync("build/import/i18n/" + file + ".json", JSON.stringify(fileData, null, 2));
            if (file === "en" && fileData.unreleased.length > 1) {
                console.warn("unreleased tracks or not matched in 'import6GameDataViaJson':renameTrack\n", fileData.unreleased.join(", "));
            }
        }

        console.log("all files are written in", "'" + "build/import/i18n/" + "'");

    });

    shared.grunt.task.run([
        "import-07-i18n-convert",
        "import-07-i18n-getHashes",
        "import-07-i18n-getTrackNames",
    ]);
};