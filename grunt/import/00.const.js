/*
    gameVersion is in:
     /database/map.json
     */
module.exports = {
    importTasks: [
        {t: "import-00-checkImport", p: "./00.checkImport"},
        {t: "import-01-gameDataPhone", p: "./01.gameDataPhone"},
        {t: "import-02-gameDataS3", p: "./02.gameDataS3"},
        {t: "import-03-doUnpacking", p: "./03.doUnpacking"},
        {t: "import-04-doPackagesToOneDir", p: "./04.doPackagesToOneDir"},
        {t: "import-05-convertOri2Json", p: "./05.convertOri2Json"},
        {t: "import-06-gameDataViaJson", p: "./06.gameDataViaJson", json5: true},
        {t: "import-07-i18n", p: "./07.i18n"},
        {t: "import-08-seasons", p: "./08.seasons"},
        {t: "import-09-bikes", p: "./09.bikes"},
        {t: "import-10-screenshots", p: "./10.screenshots"},
        {t: "import-11-hunting", p: "./11.hunting"},
        {t: "import-12-countries", p: "./12.countries"},
        {t: "import-00-danteam", p: "../danteam/00.index", a: true},
        {t: "import-00-leaderboard", p: "../leaderboard/00.index", a: true},
    ],
    drives: [
        // console.log(shared.toolPath)
        "C:/", // global one
        "C:/www/", // hp lappy / WIN7
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
    androidScreenshots: "sdcard/Pictures/Screenshots/",
    cloudPath: "http://s3.amazonaws.com/dlcontent_frontier_android/${gameVersion}/info.json",
    importPath: "build/import/raw/${gameVersion}",
    importedPath: "build/import/game/${gameVersion}",
    defaultExt: "txt",
    toExt: "json5",
    tools: [
        // with suffix #
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
        "pvp_chip_store",
        "levelpacks",
        "store_5_missions",
        "missiondb",
    ],
    seasonInfo: [
        "TrialsContentDL.dat"
    ],
    assetsOfGame: [
        {src: "/MENUZ/HOMESHACK", matcher: "_ON"}, // customization _ON small _BIG maximal
        {src: "/MENUZ/ITEM", matcher: "PAINT_"}, // paintjob icons
        {src: "/MENUZ/WIDGETS", matcher: "BIKES"}, // paintjobs
        {src: "/MENUZ/MAP/LAYER_0", matcher: "MAP_BG_"}, // world 1
        {src: "/MENUZ/MAP/LAYER_1", matcher: "MAP_BG_"}, // world 2
        {src: "/gen/atlas", matcher: "bikes"}, // world 2
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
        "LVL_SMURFIN_LEDGES": "smurfin' ledges"
    },
    // season
    convertCostumStr: (str) => {
        return str.replace(/\./g, "")
            .replace("Top", "Head")
            .replace("Middle", "Torso")
            .replace("middle", "Torso")
            .replace("Pant", "Pants")
            .replace("Leg", "Pants")
            .replace("Lower", "Pants")
            .replace("Bottom", "Pants")
            .replace("bottom", "Pants")
            .replace("SUTE", "Suite")
    },
    pjMatcher: [
        {
            reqExp: /Custom skin '(.*) - PJ' for (.*)\. .*/g,
            matchLength: 2,
            matchGroup: 1
        },
        {
            reqExp: /Custom skin '(.*)' for the (.*)\. .*/g,
            matchLength: 2,
            matchGroup: 1
        },
        {
            reqExp: /Custom skin '(.*)' for (.*)\. .*/g,
            matchLength: 2,
            matchGroup: 1
        },
        {
            reqExp: /(.*) (.*) Paintjob$.*/g,
            matchLength: 2,
            matchGroup: 2
        },
        // Custom skin 'Stitch'. (NOTE: ItemId for bike skins points to bikeskin.txt skin ids!)
        {
            reqExp: /Custom skin '(.*)'\. \(NOTE.*bikeskin\.txt.*/g,
            matchLength: 1,
            matchGroup: 1
        },
        // Union Fanny Pack for the Mantis. (NOTE: ItemId for bike skins points to bikeskin.txt skin ids!)
        {
            reqExp: /Union (.*) for the (.*)\. \(NOTE.*bikeskin\.txt.*/g,
            matchLength: 2,
            matchGroup: 2
        },
        // SandStorm PJ for Mantis. (NOTE: ItemId for bike skins points to bikeskin.txt skin ids!)
        {
            reqExp: /(.*) PJ for (.*)\. \(NOTE.*bikeskin\.txt.*/g,
            matchLength: 2,
            matchGroup: 2
        },
        {
            reqExp: /(.*) \(NOTE.*bikeskin\.txt.*/g,
            matchLength: 1,
            matchGroup: 1
        },
    ],
    pjRenames: {
        "Winter 3": "Winter Wolf",
    },
    pjAddons: {
        bikes: {
            "paintjob-8-leaked-0.png": "../trialstrackmap-gfx/garage/08-berserker/00-cassidy.png",
            "paintjob-6-leaked-0.png": "../trialstrackmap-gfx/garage/06-marauder/00-leroy.png",
        },
        cans: {
            "paintjob-8-leaked-0-icon.png": "../trialstrackmap-gfx/garage/08-berserker/00-cassidy-icon.png",
            "paintjob-6-leaked-0-icon.png": "../trialstrackmap-gfx/garage/06-marauder/00-leroy-icon.png",
            "paintjob-19-leaked-0-icon.png": "../trialstrackmap-gfx/garage/10-donkey/00-swamp-icon.png",
        }
    },
    idsOfSeasonPrizes: [
        222, // agent blueprint
        260, // stallion
        279, // ktm blueprint
        299, // ktm blueprint
        285, // bandito blueprint
    ],
    i18nMap: {
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
    }
};