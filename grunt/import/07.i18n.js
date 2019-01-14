module.exports = function (shared) {
    const pathToI18NRaw = shared.secretPath + "/i18n";

    shared.grunt.registerTask("import-07-i18n-convert", () => {
        shared.copyToolTo(shared.toolPath.bin2Txt, shared.i18nPath);
        const scriptAll = "bin2txt.cmd",
            cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

        shared.grunt.config("exec.i18nBin2Txt.cmd", cmds.concat(["echo 'convert bin to txt'", scriptAll]).join(" & "));
        shared.grunt.task.run(["exec:i18nBin2Txt"]);
    });

    shared.grunt.registerTask("import-07-i18n-getHashes", () => {
        shared.copyToolTo(shared.toolPath.hashes, shared.i18nPath);
        const scriptAll = "hashtest.cmd",
            cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

        shared.grunt.config("exec.i18nHashes.cmd", cmds.concat(["echo 'get hashes'", scriptAll]).join(" & "));
        shared.grunt.task.run(["exec:i18nHashes"]);
    });

    const levels = {},
        hashes = {};

    shared.grunt.registerTask("import-07-i18n-getTrackNamesFromRaw", () => {
        const fileData = shared.fs.readFileSync(shared.i18nPath + "/hashes.txt", "utf8"),
            rowsFileData = fileData.split("\r\n"),
            fileDataWithIds = require("../../build/import/names-with-ids.json");

        // jsonfy hashes
        for (const i in rowsFileData) {
            const rowData = rowsFileData[i].split("\t");
            if (rowData[0]) {
                levels[rowData[0]] = {hash: rowData[1].toUpperCase(), id: fileDataWithIds[rowData[0]], i18n: {}};
                hashes[rowData[1].toUpperCase()] = rowData[0];
            }
        }

        // read strings from all *_strings.txt files
        const dirData = shared.fs.readdirSync(shared.i18nPath);

        for (const j in dirData) {
            const file = dirData[j].toLowerCase();
            if (shared._.endsWith(file, "_strings.txt")) {
                shared.ensureDirectoryExistence(`${pathToI18NRaw}/en.txt`);
                shared.fsExt.copySync(shared.i18nPath + "/" + file, pathToI18NRaw + "/" + file);
            }
        }
    });

    shared.grunt.registerTask("import-07-i18n-toJSON", () => {
        // read strings from all *_strings.txt files
        const dirData = shared.fs.readdirSync(pathToI18NRaw);

        for (const j in dirData) {
            const file = dirData[j].toLowerCase();
            if (shared._.endsWith(file, "_strings.txt")) {
                // iterate strings
                const fileDataJo = shared.fs.readFileSync(pathToI18NRaw + "/" + file, "utf8"),
                    fileLang = file.replace("_strings.txt", ""),
                    rowsJo = fileDataJo.split("\r\n");
                // convert them to lvl objects
                for (const k in rowsJo) {
                    // iterate the complete game i18n hashes
                    const rowDataJO = rowsJo[k].split("\t"),
                        hash = rowDataJO[0],
                        trackName = rowDataJO[1];
                    if (hashes.hasOwnProperty(hash)) {
                        const trackLVLtag = hashes[hash];
                        levels[trackLVLtag].i18n[shared.i18nMap[fileLang]] = trackName;
                    }
                }
            }
        }

        // console.log(levels)

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
        const i18nFiles = {};
        for (const trackLVLtag in levels) {
            const trackData = levels[trackLVLtag];
            for (const i18nLang in trackData.i18n) {
                const i18nName = trackData.i18n[i18nLang],
                    trackId = trackData.id;
                if (!i18nFiles.hasOwnProperty(i18nLang)) {
                    i18nFiles[i18nLang] = {tracks: {}, unreleased: []};
                }
                if (trackId === null) {
                    i18nFiles[i18nLang].unreleased.push(trackLVLtag + ": " + i18nName);
                } else {
                    i18nFiles[i18nLang].tracks[trackId] = i18nName;
                }
            }
        }

        // write i18n files
        for (const file in i18nFiles) {
            const fileData = i18nFiles[file],
                filePath = `database/i18n/${file}.json`;
            let fileContent = {};

            fileData.unreleased.sort();
            // read existing
            if (shared.fs.existsSync(filePath)) {
                fileContent = JSON.parse(shared.fs.readFileSync(filePath));
            }
            // override existing
            fileContent.tracks = fileData.tracks;
            fileContent.unreleased = fileData.unreleased;
            // write in existing
            shared.fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
            if (file === "en" && fileData.unreleased.length > 1) {
                console.warn(
                    "unreleased tracks or not matched in renameTrack in\n",
                    "'grunt/import/00.const.js:renameTrack:48'\n",
                    fileData.unreleased.join(", ") + "\n",
                    "restart: import06-gameDataViaJson",
                );
            }
        }

        console.log("all files are up to date in 'database/i18n/'");
    });

    // shared.grunt.task.run([
    //     "import-07-i18n-convert",
    //     "import-07-i18n-getHashes",
    //     "import-07-i18n-getTrackNames",
    //     "import-07-i18n-toJSON",
    // ]);

    shared.grunt.task.run([
        "import-07-i18n-getTrackNamesFromRaw",
        "import-07-i18n-toJSON",
    ]);
};