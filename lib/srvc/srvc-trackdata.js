angular.module("trialsTrackmap")
    .service("trackData", function ($trackRadius, improveTimes, categories, trackStats,
                                    $filter, $document, canvas, items) {
        var data = {},
            worldId = 1,
            otherWorldId = 2;
        return {
            setData: function (_data_) {
                data = _data_;
                items.setTrackData(data);
            },

            getData: function (_key_) {
                if (_key_) {
                    return data[_key_];
                }
                return data;
            },

            setWorld: function (_worldId_) {
                worldId = _worldId_;
                if (worldId === 1) {
                    otherWorldId = 2;
                } else {
                    otherWorldId = 1;
                }
            },

            getWorld: function () {
                return worldId;
            },

            getOtherWorld: function () {
                return otherWorldId;
            },

            generateTracks: function (onlyI18n) {
                data.trackdata.ids.forEach(function (track) {
                    if (!onlyI18n) {
                        var trackId = track.id;

                        // times handling
                        if (!track.times) {
                            track.times = {};
                        }

                        if (trackId in data.trackdata.times) {
                            var times = data.trackdata.times[trackId],
                                silver = times[0].split("|"),
                                gold = times[1].split("|"),
                                platinum = times[2].split("|");

                            track.times = {
                                silver: {
                                    faults: silver[0] ? silver[0] : 0,
                                    time: silver[1]
                                },
                                gold: {
                                    faults: gold[0] ? gold[0] : 0,
                                    time: gold[1]
                                },
                                platinum: {
                                    faults: platinum[0] ? platinum[0] : 0,
                                    time: platinum[1]
                                }
                            };
                        }
                        // case for no medal times are there
                        track.times.worldRecord = improveTimes.WRTimes.getOne(trackId);

                        // tier
                        if (trackId in data.trackdata.tiers) {
                            track.tier = data.trackdata.tiers[trackId];
                        }

                        // parts
                        if (trackId in data.trackdata.parts) {
                            track.parts = data.trackdata.parts[trackId];
                            if ("g" in data.trackdata.parts[trackId]) {
                                track.gems = data.trackdata.parts[trackId].g;
                            }
                        }

                        // coords
                        if (trackId in data.trackdata.coords) {
                            track.coords = data.trackdata.coords[trackId] + "," + $trackRadius;
                        }

                        // cats are basicly in the game
                        if (trackId in data.trackdata.categories.ids) {
                            track.categories = data.trackdata.categories.ids[trackId];
                        } else {
                            track.categories = [];
                        }

                        // tags are community given types
                        if (trackId in data.tags.ids) {
                            track.tags = categories.getTrackTagConverted(data.tags.ids[trackId]);
                        }

                        items.addItemsToTrack(track);

                        // gem and fuel amount
                        switch (true) {
                            case track.tier === 1:
                                track.fuel = 5;
                                track.gems = "gems" in track ? track.gems : 5;
                                break;
                            case track.tier === 2:
                                track.fuel = 7;
                                track.gems = "gems" in track ? track.gems : 7;
                                break;
                            case track.tier === 3:
                                track.fuel = 10;
                                track.gems = "gems" in track ? track.gems : 10;
                                break;
                        }

                        // set default world
                        if (!("world" in track)) {
                            track.world = 1;
                        } else {
                            track.world = parseInt(track.world);
                        }

                        // improve time
                        track.improve = improveTimes.getOne(trackId, track);
                    }

                    var i18n = $filter("translate")("tracks." + track.id);

                    track.i18n = i18n;

                    track.uri = i18n.replace(/ /g, "-").toLowerCase() + "-" + track.id;
                });

                // save lost records
                //improveTimes.WRTimes.resaveData();

                return data.trackdata.ids;
            },

            getTracksInTiers: function (searchTrack, whoIs) {
                var notTrackCategory = items.getSpecialsCats(),
                    filteredArray = [],
                    tiersObject = {},
                    showSomeSearch = false,
                    isSearch = searchTrack && searchTrack !== "",
                    filterCatId = categories.getFilterCatId(),
                    defaultFilterCatId = categories.getDefaultFilterCatId(),
                    filterCat = filterCatId && filterCatId !== "" && filterCatId !== -1 && filterCatId !== defaultFilterCatId;

                canvas.clear("getTracksInTiers");

                data.listedTracks = 0;
                data.otherWorldTracks = 0;

                // walk through tracks
                data.trackdata.ids.forEach(function (track) {
                    if (isSearch
                        && track.i18n.toLowerCase().indexOf(searchTrack.toLowerCase()) === -1
                        || track.tier === 0
                        || track[trackStats.getType("event")]
                        || track[trackStats.getType("bunker")]
                        || filterCat && !categories.hasTrackCategory(track, filterCatId)) {
                        return;
                    }

                    if (track.world !== worldId) {
                        data.otherWorldTracks++;
                        if (!isSearch) {
                            return;
                        }
                    } else {
                        data.listedTracks++;
                    }

                    // feature show result on map
                    if (isSearch) {
                        showSomeSearch = true;
                        track.showOnMap = true;
                    } else {
                        track.showOnMap = false;
                    }

                    // create tier
                    if (!(track.tier in tiersObject)) {
                        tiersObject[track.tier] = {
                            number: track.tier,
                            cats: {}
                        };
                    }
                    // add category tracks
                    track.categories.forEach(function (catId) {
                        if (notTrackCategory.indexOf(catId) > -1) {
                            return;
                        }

                        var catObject = categories.findById(catId),
                            isNoneGameCategory = catObject && catObject.hasOwnProperty("noneGameCategory");
                        if (catObject && !isNoneGameCategory) {
                            if (!(catObject.class in tiersObject[track.tier].cats)) {
                                tiersObject[track.tier].cats[catObject.class] = [];
                            }

                            tiersObject[track.tier].cats[catObject.class].push(track);
                        }
                    });
                    // add all other without category
                    if (track.categories.length === 0 || track.categories.length === 1 && notTrackCategory.indexOf(track.categories[0])) {
                        if (!("other" in tiersObject[track.tier].cats)) {
                            tiersObject[track.tier].cats["other"] = [];
                        }

                        tiersObject[track.tier].cats["other"].push(track);
                    }
                });

                if (Object.keys(tiersObject).length > 0) {
                    Object.keys(tiersObject).forEach(function (tier) {
                        filteredArray.push(tiersObject[tier]);
                    });
                }

                return filteredArray;
            },

            getTracksOfCat: function (catId, countAll) {
                return $filter("catAndTierTracks")(data.trackdata.ids, catId, undefined, countAll);
            },

            getTrackByID: function (trackId) {
                return data.trackdata.ids.filter(function (track) {
                    return track.id === trackId;
                })[0];
            },

            getTrackByName: function (trackName) {
                return $filter("searchTrack")(data.trackdata.ids, trackName);
            }
        };
    });