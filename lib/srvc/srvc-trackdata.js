angular.module("trialsTrackmap")
    .service("trackData", function (
        $trackRadius, improveTimes, categories,
        $filter
    ) {
        var data = {},
            worldId = 1;

        function convertYoutube(videoRaw) {
            // only id
            // d9dcQwzfoAE
            // with host
            // 1|d9dcQwzfoAE
            // with host and video type
            // 1|d9dcQwzfoAE|2
            var types = data.media.youtube.types,
                tutorialGuys = data.media.youtube.hosts,
                hasHost = videoRaw.indexOf("|") >= 0,
                videoArr = videoRaw.split("|");

            return {
                host: (hasHost ? tutorialGuys[videoArr[0]].name : ""),
                hostUrl: (hasHost ? tutorialGuys[videoArr[0]].url : ""),
                url: "#3/" + videoArr[hasHost ? 1 : 0],
                type: videoArr.length === 3 ? (types[videoArr[2]] != "" ? "-" : "") + types[videoArr[2]] : "-" + types["1"]
            }
        }

        return {
            setData: function (_data_) {
                data = _data_;
            },

            setWorld: function(_worldId_){
                worldId = _worldId_;
            },

            getWorld: function(){
                return worldId;
            },

            getTracksInCats: function (searchTrack) {
                var dataCubeCat = 6,
                    filteredArray = [],
                    tiersObject = {};
                // walk through tracks
                data.tracks.forEach(function (track) {
                    if (searchTrack && searchTrack != "" && track.i18n.toLowerCase()
                            .indexOf(searchTrack.toLowerCase()) == -1
                        || track.tier == 0) {
                        return;
                    }

                    var trackCats = track.cats.split(",").map(Number);
                    // create tier
                    if (!(track.tier in tiersObject)) {
                        tiersObject[track.tier] = {
                            number: track.tier,
                            cats: {}
                        };
                    }
                    // create cats
                    trackCats.forEach(function (catId) {
                        if (catId === dataCubeCat) {
                            return;
                        }

                        var catObject = categories.findById(catId);

                        if (!(catObject.class in tiersObject[track.tier].cats)) {
                            tiersObject[track.tier].cats[catObject.class] = [];
                        }

                        tiersObject[track.tier].cats[catObject.class].push(track);
                    });
                });

                if (Object.keys(tiersObject).length > 0) {
                    Object.keys(tiersObject).forEach(function (tier) {
                        filteredArray.push(tiersObject[tier]);
                    });
                }

                return filteredArray;
            },

            generateTracks: function (onlyI18n) {
                data.tracks.forEach(function (track, index) {
                    if (!onlyI18n) {
                        var trackId = track.id;

                        // times handling
                        if (!track.times) {
                            track.times = {};
                        }

                        if (trackId in data.times) {
                            var times = data.times[trackId],
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

                        // parts
                        if (trackId in data.parts) {
                            track.parts = data.parts[trackId];
                            if ("g" in data.parts[trackId]) {
                                track.gems = data.parts[trackId].g;
                            }
                        }

                        // coords
                        if (trackId in data.media.coords) {
                            track.coords = data.media.coords[trackId] + "," + $trackRadius;
                        }

                        // startline
                        if (trackId in data.media.startlines) {
                            track.startline = "#1/" + data.media.startlines[trackId];
                        }

                        // datacube
                        if (trackId in data.media.datacubes) {
                            track.datacube = "#1/" + data.media.datacubes[trackId];
                        }

                        // candys
                        if (trackId in data.media.candies) {
                            track.candies = data.media.candies[trackId];
                        }

                        // youtube
                        if (trackId in data.media.youtube.videos) {
                            var videos = data.media.youtube.videos[trackId];
                            track.youtube = [];
                            if (typeof videos == "string") {
                                track.youtube.push(convertYoutube(data.media.youtube.videos[trackId]));
                            } else {
                                videos.forEach(function (video) {
                                    track.youtube.push(convertYoutube(video));
                                });
                            }
                        }

                        // gem and fuel amount
                        switch (true) {
                            case track.tier == 1:
                                track.fuel = 5;
                                track.gems = "gems" in track ? track.gems : 5;
                                break;
                            case track.tier == 2:
                                track.fuel = 7;
                                track.gems = "gems" in track ? track.gems : 7;
                                break;
                            case track.tier == 3:
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

                    track.i18n = $filter("translate")("tracks." + track.id) +
                        (track.level ? " (LVL " + track.level + ")" : "");
                });

                // save lost records
                //improveTimes.WRTimes.resaveData();

                return data.tracks;
            }
        }
    })