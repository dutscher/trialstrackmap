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
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/matches

*/
module.exports = function (shared, done) {
    const importSeasonID = 49,
        useBetaServer = false,
        importDir = "build/import/seasons/",
        databaseDir = "database/events/seasons",
        year = new Date().getFullYear(),
        rewardsFile = shared.workingFilesOfGame.filter(function (file) {
            return file.indexOf("pvp_match") !== -1;
        })[0],
        rewardsJSON = require("../../" + rewardsFile + shared.toExt),
        prizesJSON = require("../../database/events/seasons/prizes.json");
    console.log("# START SEASON IMPORT gameVersion:", shared.gameVersion, "importSeasonID:", importSeasonID);

    function findPrize(type, value) {
        var returnData,
            foundPrize;
        //console.log("findPrize", arguments)
        switch (type) {
            case "track":
                foundPrize = Object.keys(prizesJSON.tracks).filter(function (id) {
                    var track = prizesJSON.tracks[id];
                    return track.toLowerCase() === value.toLowerCase();
                });
                returnData = parseInt(foundPrize[0]);
                break;
            case "costum":
                foundPrize = Object.keys(prizesJSON.costums).filter(function (id) {
                    var costum = prizesJSON.costums[id];
                    return costum.title === value;
                });
                returnData = parseInt(foundPrize[0]);
                break;
            case "paintjob":
                foundPrize = Object.keys(prizesJSON.paintjobs).filter(function (id) {
                    var paintjob = prizesJSON.paintjobs[id];
                    return paintjob.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                });
                returnData = parseInt(foundPrize[0]);
                break;
        }

        if (!foundPrize || foundPrize.length === 0) {
            console.warn("NO PRIZE FOUND FOR", type, value);
        }

        return returnData;
    }

    function findSpecial(specialID) {
        var rewards = rewardsJSON.PVPMatchRewardTypes,
            foundReward = rewards.filter(function (reward) {
                return reward.ID === specialID;
            }),
            returnData;
        if (specialID && foundReward[0]) {
            // part
            var matches = /(\d) (\w*)/g.exec(foundReward[0].Comment);
            if (matches && matches.length > 2) {
                var type = matches[2].toLowerCase();
                returnData = (
                    (type === "metal" ? "sheet" : type)
                    + "-"
                    + (parseInt(matches[1]) + 1)
                );
            }
            // track
            matches = /Track Reward - (.*)/g.exec(foundReward[0].Comment);
            if (matches && matches.length > 1) {
                returnData = {
                    extra_type: "track",
                    extra: findPrize("track", matches[1], foundReward[0].Comment)
                };
            }
            // paintjob
            matches = /Custom skin '(.*)' for the (.*)\. .*/g.exec(foundReward[0].Comment);
            if (matches && matches.length > 2) {
                returnData = {
                    extra_type: "paintjob",
                    extra: findPrize("paintjob", matches[1], foundReward[0].Comment)
                };
            }
            matches = /(.*) (.*) Paintjob$.*/g.exec(foundReward[0].Comment);
            if (matches && matches.length > 2) {
                returnData = {
                    extra_type: "paintjob",
                    extra: findPrize("paintjob", matches[2], foundReward[0].Comment)
                };
            }
            // costum
            if (shared._.startsWith(foundReward[0].NameId, "OUTFIT")) {
                returnData = {
                    extra_type: "costum",
                    extra: findPrize("costum", foundReward[0].Comment
                        .replace(/\./g, "")
                        .replace("Leg", "Pant")
                        .replace("Top", "Head")
                        .replace("Middle", "Torso")
                        .replace("middle", "Torso")
                        .replace("Bottom", "Pant")
                        .replace("bottom", "Pant")
                        , foundReward[0].Comment)
                };
            }
        }

        return returnData;
    }

    function handleSpecial(data, special) {
        if (special) {
            var specialID = special.amount,
                arrDoughnut = [
                    222, // agent blueprint
                    260, // stallion
                    279, // ktm blueprint
                    299, // ktm blueprint
                    285, // bandito blueprint
                ];
            if (specialID >= 20000) {
                data.extra_type = "part";
                data.extra = findSpecial(specialID);
            } else if (specialID === 254) {
                data.extra_type = "unlimited-fuel";
            } else if (arrDoughnut.indexOf(specialID) !== -1) {
                data.extra_type = "doughnut";
            } else {
                var specialData = findSpecial(specialID);
                if (specialData && Object.keys(specialData).length > 0) {
                    data = shared._.extend({}, data, specialData);
                }
            }
        }

        return data;
    }

    function readSeasonFiles() {
        var dirData = shared.fs.readdirSync(importDir);
        // loop import files
        for (var i in dirData) {
            var file = dirData[i],
                json = require("../../" + importDir + file),
                settings = json.pvp_season_settings,
                rewards = json.pvp_season_rewards,
                match = json.pvp_match_settings,
                id = settings.season_index,
                title = shared._.capitalize(shared._.trim(settings.season_title
                    .toLowerCase().replace("season", ""))),
                titleShort = shared._.trim(settings.season_title
                    .toLowerCase().replace("season", "")).replace(/ /g, "-"),
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
                    duration: match.ranked_match_duration_hours + "h",
                    free_showdowns: match.free_tickets_max,
                    ticket_regain: match.free_tickets_interval_minutes + "m",
                    stats: "http://trials.bonxy.net/the-bunker/",
                    total_legends: 0,
                    prizes: []
                };
            // going through rewards
            rewards.forEach(function (rank) {
                var coins = rank.rewards.filter(function (reward) {
                        return reward.item_id === 1;
                    }),
                    gems = rank.rewards.filter(function (reward) {
                        return reward.item_id === 2;
                    }),
                    special = rank.rewards.filter(function (reward) {
                        return reward.item_id === 145;
                    }),
                    data = {
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
                shared.fs.writeFileSync(pathToFile + ".compare", JSON.stringify(jsonData, null, 2));
            }
        }
        console.log("# FINISHED");
    }

    function readSeasonsFromServer(callback) {
        var options = shared.getRequestOpts(
            // "/TRIAG_AN_LNCH_A/public/pvp_matches/v1/pvp_config",
            "/TRIAG_"
            + (useBetaServer ? "AN_LNCH_A" : "IP_BETA_B")
            + "/public/pvp_matches/v1/season/" + importSeasonID + "?lang=en"
        );

        var req = shared.https.request(options, function (res) {
            res.on("data", function (json) {
                var json = JSON.parse(json);
                shared.ensureDirectoryExistence(importDir);
                shared.fs.writeFileSync(importDir + importSeasonID + ".json", JSON.stringify(json, null, 2));
                callback();
            });
        });

        req.on("error", function (e) {
            console.error(e);
            done();
        });

        req.end();
    }

    shared.getUbisoftTicket(function () {
        readSeasonsFromServer(function () {
            readSeasonFiles();
            done();
        });
    });
};