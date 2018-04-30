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
https://s3.amazonaws.com/dlcontent_frontier_android/590/TrialsContentDL.dat

https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/pvp_config
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/season/47?lang=%25s
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/matches


Authorization: Ubi_v1 t=%ticket%

%ticket%=ew0KICAidmVyIjogIjEiLA0KICAiYWlkIjogIjZhZDE2YWJlLThmMzItNDA2Yi05OTFiLTQ1MGZlYmU5NTgyMyIsDQogICJlbnYiOiAiUHJvZCIsDQogICJzaWQiOiAiN2NkZDk5NjYtNGQ0MS00YTlhLWE4YTMtY2M1Y2E4MzU4ZjIwIiwNCiAgInR5cCI6ICJKV0UiLA0KICAiZW5jIjogIkExMjhDQkMiLA0KICAiaXYiOiAiMmpoX1FkRmxMQkdteVVIM0ZialVtdyIsDQogICJpbnQiOiAiSFMyNTYiDQp9.IGpM73WVCTMf3kTTEEgX8FYp6tEApwN5b-IYxOYA6RCPsF1MbGVPl3y-R4alLWwmUuoK0Usq4c8TqtR0wPMOUSiPP5scUUN7I4zVbu0khIgth-Ed-lmv22DaowYAWOTykxCrvMGe9-OzaQW4cgGc-lL5wcgdJydhpc0cAUk5FjhOB5o9dUdg1kZTRdCyJ5VclcGszRcFCjJECazg7jh3CXQqHCGmanatMd-_kuF7sD86OIqEAOhHnL8WLBjTc9NpX8MehHxE8zI-wzd8DWkfJNLTonRcqUthd0ZhhakXc2_23bBKfuoBirfYqRSrZOeguE69XqAzRmbv8S30Y04M4Q8F58rZKrbb8cwMx-qkEI-RAzjOUV7wjtjnegQ89usxYjhkj1ra1y0KaK82kuO7gX66nDEfwZpeFsPq5r_RRZGwDQryBjNZ9pzfZ1P0PK9PNv9VKDNRNmlYR1AYcq-X9-EZNKlq-7kIyINKwY1qHEEZ-YIK-lGBynzPFA6TAvN7cSer45NdfN9AZZi2kGiCfatMb-hu8IWjnS-d1QTz-Hc0isycPZ2cl4Gr2PFR4x1bflPhIIBB5jySbEUxd7VcH1ualhaa7N7clsrQfldyD0FYmwt2tX4subHRHazMPK5L5x0Yr2dJyPbvJGkRo6H2lq4JRwakdp_wjnQRhkSQlxolnOPv4RXXtxt6exArnINyeV9dfrzxTU40RTa32gbdPdEnWBTUut0PLPucRqsKAQaejREDkdpMY5hNUMYk24lMZQWed40BRLgmHWt_8DuZVxExiOQhgp_YG42NI9hhs3lBtBCbQUKmlE44Z7-zVIMUQGkboV1X-dGANoEbjgE8p4QW9zY0CK5RSQUiJGIjjtSkFE3FWKXCvNYo5PvoCw2sg0dCnuiUboZaQPgg2LIh3p3B3cqz9YWnSMcF6L69teyqHfnt_Y9Lpzyqf153TcELms8tPi7TPpxp22ZbClB1r7-gEGpaH7WfENxJQtKYzR3tR59nvRhnS5YtvQQPLFQSf5XbQE_SkuEHKji27EWmeL_x3Wi5CNfDiQcdz-hSmUmQ25xTpkliuVZsCDSpnOC3AaG6A65I8Hpn1B0dVRzGvfnKYIHtupcuzncPOWSizi3KabyNSbOKMkcCrg2fQ21JcUdqRuCc-q8juBnUAfLImPmrw5dZsbBHIZEAWdtk3XjeyacFcfIBgAK0BWK0Xz_S5IhIyNI2yXIq4Byh8XEnCG6-WUjKdzbPZiQZiaOhh4b6gT13qilc9yrOJCgKrufl7WQDBRgxo2jczOPJ6XEBOGbNbQOE467hUDYAy-MBHs647t3FhqTfhMxGNMyfc7qSaLgrXRxAqcp6z5-r2dwh3y3ns_zNg0b5do0JsBaOYZqeUmeqW4EKxupFuOOWRfYqNKWJAEPGtg_Ua2YJndt_lq-iI1qx75vWQbHU-43hryI.ffcPfembBCWdTXE2P3IvJy0FBvPz-k4RIPOV81oql_M

Ubi-AppId: 1c91448e-c62e-45ec-b97b-898dc967f2c1

*/
module.exports = function (shared) {
    console.log("# START SEASON IMPORT");
    var importDir = "build/import/seasons/",
        databaseDir = "database/events/seasons",
        year = new Date().getFullYear(),
        rewardsFile = shared.workingFilesOfGame.filter(function (file) {
            return file.indexOf("pvp_match") !== -1;
        })[0],
        rewardsJSON = require("../../" + rewardsFile + shared.toExt),
        prizesJSON = require("../../database/events/seasons/prizes.json");

    function findPrize(type, value) {
        var returnData,
            foundPrize;
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
                    extra: findPrize("track", matches[1])
                };
            }
            // paintjob
            matches = /Custom skin '(.*)' for the (.*)\. .*/g.exec(foundReward[0].Comment);
            if (matches && matches.length > 2) {
                returnData = {
                    extra_type: "paintjob",
                    extra: findPrize("paintjob", matches[1])
                };
            }
            // costum
            if (shared._.startsWith(foundReward[0].NameId, "OUTFIT")) {
                returnData = {
                    extra_type: "costum",
                    extra: findPrize("costum", foundReward[0].Comment)
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
                .toLowerCase().replace("season", "")),
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
        shared.fs.writeFileSync(pathToFile, JSON.stringify(jsonData, null, 2));
        console.log("* " + pathToFile + " created");
    }
    console.log("# FINISHED");
};