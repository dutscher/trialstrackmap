/*
    gameVersion is in:
     /database/map.json

    pathes in /#content:
     /MENUZ/HOMESHACK // customization _ON small _BIG maximal
     /MENUZ/ITEM // paintjob icons,
     /MENUZ/WIDGETS/BIKES.png // 14 paintjobs
     /MENUZ/WIDGETS/BIKES2.png // 31
     /MENUZ/WIDGETS/BIKES3.png // 33
     /MENUZ/WIDGETS/BIKES4.png // 14
     /MENUZ/MAP/LAYER_0 // world 1
     /MENUZ/MAP/LAYER_1 // world 2
     */
module.exports = {
    drives: [
        "C:/", // global one
        //"C:/www/", // hp lappy / WIN7
        "F:/#trails/", // hp lappy / cameo hdd / WIN7
        "E:/#trails/", // neofonie pc / cameo hdd / WIN10
        "C:/www/software/", // thinkpad neo / WIN10
    ],
    trialsUtilsDir: "#TFunpacker",
    allInOneDir: "#content",
    appPath: "com.ubisoft.redlynx.trialsfrontier.ggp",
    appId: "1c91448e-c62e-45ec-b97b-898dc967f2c1",
    androidPath: "sdcard/Android/data/",
    cloudPath: "http://s3.amazonaws.com/dlcontent_frontier_android/${gameVersion}/info.json",
    importPath: "build/import/raw/${gameVersion}",
    importedPath: "build/import/game/${gameVersion}",
    defaultExt: "txt",
    toExt: "json5",
    tools: [
        "hashes", "bin2Txt", "unpacker", "adb"
    ],
    filesOfGame: [
        "bikes",
        "customization",
        "upgrades",
        "level_rewards",
        "levels",
        "pvp_match_rewards",
        "pvp_chip_store"
    ],
    renameTrack: {
        "LVL_SPINNERS_ALLEY": "spinner's alley",
        "LVL_HILLTOP_CHETTO": "hilltop ghetto",
        "LVL_STILTED_PATHWAY": "stilted path",
        "LVL_CRANE_PEEK": "crane peak",
        "LVL_X_FACTOR": "x-factor",
        "LVL_X_TERMINATE": "x-terminate",
        "LVL_CLIFF_HANGER": "cliff-hanger"
    },
    importTasks: [
        {t: "import-00-checkImport", p: "./00.checkImport"},
        {t: "import-01-gameDataPhone", p: "./01.gameDataPhone"},
        {t: "import-02-gameDataS3", p: "./02.gameDataS3", a: true},
        {t: "import-03-doUnpacking", p: "./03.doUnpacking"},
        {t: "import-04-doPackagesToOneDir", p: "./04.doPackagesToOneDir"},
        {t: "import-05-convertOri2Json", p: "./05.convertOri2Json"},
        {t: "import-06-gameDataViaJson", p: "./06.gameDataViaJson", json5: true},
        {t: "import-07-convertLanguages", p: "./07.convertLanguages"},
        {t: "import-08-getLanguageHashes", p: "./08.getLanguageHashes"},
        {t: "import-09-getTrackNamesViaHashes", p: "./09.getTrackNamesViaHashes"},
        {t: "import-10-seasons", p: "./10.seasons", a: true},
        {t: "import-11-danteam", p: "./11.danTeam", a: true},
    ]
};