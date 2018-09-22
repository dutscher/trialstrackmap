/*
    gameVersion is in:
     /database/map.json
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
    s3Cache: "#cache",
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
    appFiles: [
        "contentSFX",
        "content",
        "textures_android"
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
    assetsOfGame: [
        {src: "/MENUZ/HOMESHACK", matcher: "_ON"}, // customization _ON small _BIG maximal
        {src: "/MENUZ/ITEM", matcher: "PAINT_"}, // paintjob icons
        {src: "/MENUZ/WIDGETS", matcher: "BIKES"}, // paintjobs
        {src: "/MENUZ/MAP/LAYER_0", matcher: "MAP_BG_"}, // world 1
        {src: "/MENUZ/MAP/LAYER_1", matcher: "MAP_BG_"}, // world 2
    ],
    renameTrack: {
        "LVL_SPINNERS_ALLEY": "spinner's alley",
        "LVL_HILLTOP_CHETTO": "hilltop ghetto",
        "LVL_STILTED_PATHWAY": "stilted path",
        "LVL_CRANE_PEEK": "crane peak",
        "LVL_X_FACTOR": "x-factor",
        "LVL_X_TERMINATE": "x-terminate",
        "LVL_CLIFF_HANGER": "cliff-hanger",
        "LVL_MT_WHIPLASH": "mt. whiplash",
    },
    importTasks: [
        {t: "import-00-checkImport", p: "./00.checkImport"},
        {t: "import-01-gameDataPhone", p: "./01.gameDataPhone"},
        {t: "import-02-gameDataS3", p: "./02.gameDataS3", a: true},
        {t: "import-03-doUnpacking", p: "./03.doUnpacking"},
        {t: "import-04-doPackagesToOneDir", p: "./04.doPackagesToOneDir"},
        {t: "import-05-convertOri2Json", p: "./05.convertOri2Json"},
        {t: "import-06-gameDataViaJson", p: "./06.gameDataViaJson", json5: true},
        {t: "import-07-i18n", p: "./07.i18n"},
        {t: "import-08-seasons", p: "./08.seasons", a: true},
        {t: "import-09-danteam", p: "./09.danTeam", a: true},
    ]
};