/*
extra_type: track - extra: 18,
extra_type: doughnut
extra_type: costum - extra: 16,
extra_type: paintjob - sprite_pointer: "bronco-medic",
extra_type: unlimited-fuel
extra_type: part - extra: "spring-1",

database/media/bikes.json
build/import/game/590/pvp_match_rewards.json5

right rewards file in:
https://s3.amazonaws.com/dlcontent_frontier_android/!!!GAMEVERSION!!!/TrialsContentDL.dat

https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/pvp_config
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/season/47?lang=en
https://lb-rdv-http.ubi.com/TRIAG_IP_BETA_B/public/pvp_matches/v1/season/%1

*/
module.exports = function (shared) {

    shared.grunt.task.run([
        //"import-08-get-actual-season-data",
        "import-08-crop-season-banner",
        //"import-08-read-matches",
    ]);

    shared.grunt.registerTask("import-08-get-actual-season-data", function () {
        const done = this.async();

        const importSeasonID = shared.seasonID, // run import-02-gameDataS3 before to import-08-seasons
            useBetaServer = false,
            importDir = "build/import/seasons/",
            databaseDir = "database/events/seasons",
            year = new Date().getFullYear(),
            rewardsFile = shared.workingFilesOfGame.filter(file => file.indexOf("pvp_match") !== -1)[0],
            rewardsJSON = require("../../" + rewardsFile + shared.toExt),
            prizesJSON = require("../../database/events/seasons/prizes.json");

        shared.ensureDirectoryExistence(importDir + "/jojo");
        console.log("# START SEASON IMPORT gameVersion:", shared.gameVersion, "importSeasonID:", importSeasonID);

        function findSpecial(specialID) {
            if (specialID === 200021) {
                specialID = 20001;
            }

            const rewards = rewardsJSON.PVPMatchRewardTypes,
                foundReward = rewards.filter(reward => reward.ID === specialID);

            let returnData;
            let matches;

            const isCostum = false; // Type: 0, TextureScale: 1.5,
            const isCraftingItem = false; // Type: 0, TextureAtlasId: 1,
            const isBlueprint = false; //  Type: 0, TextureScale: 0.85,
            const isTrack = false; // Type: 1,
            const isPaintjob = false; // Type: 2,
            const isCoinMagnet = false; // Type: 0, TextureScale: 1.42,

            if (foundReward.length === 0) {
                console.error("cant findSpecial");
                console.error("specialID:", specialID, rewardsFile + shared.toExt, "PVPMatchRewardTypes")
            } else {
                const commentOfReward = foundReward[0].Comment;
                const nameIdOfReward = foundReward[0].NameId;

                // console.log("findSpecial", specialID, foundReward)
                if (specialID && foundReward[0]) {
                    // coin magnet
                    if (commentOfReward === "Coin Magnet") {
                        returnData = {
                            extra_type: "coin-magnet"
                        };
                    }

                    // blueprint
                    if (commentOfReward.indexOf("blueprint") !== -1) {
                        // Comment: 'Harley blueprint part. As a fallback reward, Doughnut is used.',
                        const blueprintRenames = shared.blueprintRenames;
                        const bikeNameRaw = /(.*) blueprint part. As a fallback reward, Doughnut is used.*/g.exec(commentOfReward);
                        const foundRename = Object.entries(blueprintRenames).filter(bike => bike[0] === bikeNameRaw[1]);
                        returnData = {
                            extra: foundRename.length > 0 ? foundRename[0][1] : bikeNameRaw[1],
                            extra_type: "blueprint"
                        };
                    }

                    // part
                    if (!returnData) {
                        matches = /(\d) (\w*)/g.exec(commentOfReward);
                        if (matches && matches.length > 2) {
                            const type = matches[2].toLowerCase();
                            returnData = (
                                (type === "metal" ? "sheet" : type)
                                + "-"
                                + (parseInt(matches[1]) + 1)
                            );
                        }
                    }
                    // track
                    if (!returnData) {
                        matches = /Track Reward - (.*)/g.exec(commentOfReward);
                        if (matches && matches.length > 1) {
                            returnData = {
                                extra_type: "track",
                                extra: findPrize(
                                    "track",
                                    nameIdOfReward
                                        .replace(/LVL_/g, "")
                                        .replace(/_/g, " "),
                                    commentOfReward
                                )
                            };
                        }
                    }

                    // paintjobs
                    if (!returnData) {
                        const allPJMatcher = shared.pjMatcher;
                        // find with matcher
                        let pjMatch = null;
                        allPJMatcher.map(matcher => {
                            const localMatches = matcher.reqExp.exec(commentOfReward);
                            if (localMatches && localMatches.length > matcher.matchLength && pjMatch === null) {
                                pjMatch = localMatches[matcher.matchGroup];
                            }
                        });
                        if (pjMatch !== null) {
                            // check renames
                            if (pjMatch in shared.pjRenames) {
                                pjMatch = shared.pjRenames[pjMatch];
                            }
                            // try to find prize
                            returnData = {
                                extra_type: "paintjob",
                                extra: findPrize("paintjob", pjMatch, commentOfReward)
                            };
                        }
                    }

                    // costum
                    if (!returnData) {
                        if (shared._.startsWith(foundReward[0].NameId, "OUTFIT")) {
                            returnData = {
                                extra: findPrize(
                                    "costum",
                                    shared.convertCostumStr(commentOfReward),
                                    commentOfReward),
                                extra_type: "costum"
                            };
                        }
                    }

                    if (!returnData) {
                        console.error("cant findSpecial in prizes.json");
                        console.error("specialID:", specialID, rewardsFile + shared.toExt, "PVPMatchRewardTypes");
                        console.error(foundReward);
                    }
                }
            }

            return returnData;
        }

        function findPrize(type, value, seasonComment) {
            let returnData,
                foundPrize;
            const prizeNeedle = value.toLowerCase().replace(/_/g, ' ');
            // console.log("findPrize", arguments)
            switch (type) {
                case "track":
                    foundPrize = Object.keys(prizesJSON.tracks).filter(function (id) {
                        const track = prizesJSON.tracks[id];
                        return track.toLowerCase() === prizeNeedle;
                    });
                    returnData = parseInt(foundPrize[0]);
                    break;
                case "costum":
                    foundPrize = Object.keys(prizesJSON.costums).filter(function (id) {
                        const costum = prizesJSON.costums[id];
                        return costum.title.toLowerCase() === prizeNeedle;
                    });
                    returnData = parseInt(foundPrize[0]);
                    break;
                case "paintjob":
                case "skin":
                    foundPrize = Object.keys(prizesJSON.paintjobs).filter(function (id) {
                        const paintjob = prizesJSON.paintjobs[id];
                        return paintjob.title.toLowerCase().indexOf(prizeNeedle) !== -1;
                    });
                    returnData = parseInt(foundPrize[0]);
                    break;
            }

            if (!foundPrize || foundPrize.length === 0 || !returnData) {
                console.warn(
                    "NO PRIZE FOUND FOR",
                    `type: '${type}'`,
                    `prizeNeedle: '${prizeNeedle}'`,
                    `comment: '${seasonComment}'`);
            }

            return returnData;
        }

        function handleSpecial(data, special) {
            if (special) {
                const specialID = special.amount,
                    arrDoughnut = shared.idsOfSeasonPrizes;
                if (specialID >= 20000) {
                    data.extra_type = "part";
                    data.extra = findSpecial(specialID);
                } else if (specialID === 254) {
                    data.extra_type = "unlimited-fuel";
                } else if (arrDoughnut.indexOf(specialID) !== -1) {
                    data.extra_type = "doughnut";
                } else {
                    const specialData = findSpecial(specialID);
                    if (specialData && Object.keys(specialData).length > 0) {
                        data = shared._.extend({}, data, specialData);
                    }
                }
            }

            return data;
        }

        function readSeasonFiles() {
            const allSeasonFiles = shared.fs.readdirSync(importDir);
            // loop import files
            const seasonFile = allSeasonFiles.filter(file => file.indexOf(importSeasonID) !== -1);

            for (const i in seasonFile) {
                const file = seasonFile[i],
                    json = require("../../" + importDir + file);

                if("httpCode" in json && json.httpCode === 404){
                    console.error(`season ${file} and their settings  not exists`);
                    return;
                }

                const settings = json.pvp_season_settings,
                    rewards = json.pvp_season_rewards,
                    match = json.pvp_match_settings,
                    id = settings.season_index,
                    title = shared._.capitalize(shared._.trim(settings.season_title
                        .toLowerCase().replace("season", ""))),
                    titleShort = shared._.trim(settings.season_title
                        .toLowerCase().replace("season", "")).replace(/ /g, "-"),
                    titleBonxy = shared.toTitleCase(settings.season_title).replace(/ /g, "+"),
                    date = new Date(settings.season_start * 1000),
                    dateEnd = new Date(settings.season_end * 1000),
                    fileJson = id + "." + titleShort + ".json",
                    pathToFile = databaseDir + "/" + year + "/" + fileJson,
                    jsonData = {
                        header: {
                            src: ""
                        },
                        title: title,
                        date: shared.pad(date.getDate()) + "." + shared.pad(date.getMonth() + 1) + "." + date.getFullYear(),
                        date_end: shared.pad(dateEnd.getDate()) + "." + shared.pad(dateEnd.getMonth() + 1) + "." + dateEnd.getFullYear(),
                        duration: match.friendly_match_duration_hours + "h",
                        free_showdowns: match.free_tickets_max + 1,
                        ticket_regain: match.free_tickets_interval_minutes + "m",
                        stats: "http://trials.bonxy.net/the-bunker/" + titleBonxy,
                        total_legends: 0,
                        prizes: []
                    };
                // going through rewards
                rewards.forEach(function (rank) {
                    const coins = rank.rewards.filter(function (reward) {
                            return reward.item_id === 1;
                        }),
                        gems = rank.rewards.filter(function (reward) {
                            return reward.item_id === 2;
                        }),
                        special = rank.rewards.filter(function (reward) {
                            return reward.item_id === 145;
                        });
                    let data = {
                        level: rank.rank,
                        coins: coins[0].amount,
                        gems: gems[0] ? gems[0].amount : 0
                    };
                    // handle all the other prizes
                    data = handleSpecial(data, special[0]);
                    // remove gems if empty
                    if (data.gems === 0) {
                        delete data.gems;
                    }
                    if (data.extra === "") {
                        delete data.extra;
                    }
                    // push all
                    jsonData.prizes.push(data);
                });

                //console.log(fileJson);
                //console.log(jsonData);
                shared.ensureDirectoryExistence(pathToFile);
                if (!shared.fs.existsSync(pathToFile)) {
                    shared.fs.writeFileSync(pathToFile, JSON.stringify(jsonData, null, 2));
                    console.log("* " + pathToFile + " created");
                } else {
                    console.log("* " + pathToFile + " already exists");
                    shared.fs.writeFileSync(pathToFile.replace(".json", "") + ".compare", JSON.stringify(jsonData, null, 2));
                }
            }
            console.log("# FINISHED");
        }

        function readSeasonConfig(type) {
            const options = shared.getRequestOpts(
                `/TRIAG_${useBetaServer ? "AN_LNCH_A" : "IP_BETA_B"}/public/pvp_matches/v1/${type}`
            );
            const importDirConfig = importDir + "config/";
            shared.ensureDirectoryExistence(importDirConfig + "test.json");
            const fileName = importDirConfig + importSeasonID + `.${type}.json`;

            const req = shared.https.request(options, function (res) {
                res.on("data", function (data) {
                    const json = JSON.parse(data);
                    shared.fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
                });
            });

            req.on("error", e => {
                console.error(e);
                done();
            });

            req.end();
        }

        function readSeasonsFromServer(callback) {
            const options = shared.getRequestOpts(
                // "/TRIAG_AN_LNCH_A/public/pvp_matches/v1/pvp_config",
                "/TRIAG_"
                + (useBetaServer ? "AN_LNCH_A" : "IP_BETA_B")
                + "/public/pvp_matches/v1/season/" + importSeasonID + "?lang=en"
            );

            const req = shared.https.request(options, function (res) {
                res.on("data", function (data) {
                    const json = JSON.parse(data);
                    shared.ensureDirectoryExistence(importDir);
                    shared.fs.writeFileSync(importDir + importSeasonID + ".json", JSON.stringify(json, null, 2));
                    callback();
                });
            });

            req.on("error", e => {
                console.error(e);
                done();
            });

            req.end();
        }

        shared.getUbisoftTicket(function () {
            readSeasonConfig('pvp_config');
            readSeasonConfig('matches');

            readSeasonsFromServer(function () {
                readSeasonFiles();
                //done();
            });
        });
    });

    shared.grunt.registerTask("import-08-crop-season-banner", function () {
        const done = this.async();
        const sharp = require("sharp");
        const sizeOf = require('image-size');
        // src: build/season-images
        // motog5 image: 1920x1080 -> 1280x720 | x:370 y:205 | 540x74
        // motog8 image: 2280x1080 -> 1280x606 |
        // dest: ../trialstrackmap-gfx/seasons
        const srcPath = "build/season-images";
        let destPath = "../trialstrackmap-gfx/seasons";

        if (!shared.fs.existsSync(destPath)) {
            console.error('no gfx repo found new season image goes into', srcPath);
            destPath = srcPath;
        }

        const files = [];
        shared.fs.readdirSync(srcPath).forEach((file, index) => {
            files.push({
                srcFile: srcPath + "/" + file,
                destFile: `${destPath}/#0${index}.${file.replace(".png", ".jpg")}`,
            });
        });

        files.forEach(file => {
            const dimensions = sizeOf(file.srcFile);
            console.log("sharp file", file.srcFile, `${dimensions.width}x${dimensions.height}`);
            sharp(file.srcFile)
                .resize(1280, undefined)
                .extract({
                    left: 370,
                    top: dimensions.width === 1920 ? 205 : 147,
                    width: 540,
                    height: 74
                })
                .jpeg()
                .toFile(file.destFile);
        });
    });

    shared.grunt.registerTask("import-08-read-matches", function () {
        const done = this.async();
        const useBetaServer = false;
        const importDir = "build/import/matches/";
        shared.ensureDirectoryExistence(importDir + "file.json");
        const date = new Date();
        // 19.04.25 -> YY-MM-DD
        const today = [
            ("00" + date.getYear()).slice(-2),
            ("00" + (date.getMonth() + 1)).slice(-2),
            ("00" + date.getDate()).slice(-2),
        ].join("-");

        function readMatches(callback) {
            const options = shared.getRequestOpts(
                "/TRIAG_AN_LNCH_A/public/pvp_matches/v1/matches"
            );

            const req = shared.https.request(options, function (res) {
                res.on("data", function (data) {
                    const json = JSON.parse(data);
                    shared.fs.writeFileSync(importDir + today + ".json", JSON.stringify(json, null, 2));
                    callback();
                });
            });

            req.on("error", e => {
                console.error(e);
                done();
            });

            req.end();
        }

        shared.getUbisoftTicket(function () {
            readMatches(() => {
                console.log("matches read done")
            })
        });
    });
};