angular.module("trialsTrackmap")
    .service("trackStats", function () {

        var types = {
            leaked: "leaked",
            youtube: "youtube",
            coords: "coords",
            bunker: "only_bunker",
            event: "only_event"
        };

        return {
            getType: function (_wantedType_) {
                if (!(_wantedType_ in types)) {
                    return "unknown";
                }

                return types[_wantedType_];
            },
            get: function (_tracks_) {
                var counts = {
                    all: 0,
                    worlds: {},
                    coords: 0,
                    bunker: [],
                    not_released: [],
                    event: [],
                    released: 0,
                    youtube: 0,
                    youtubeMultiple: 0,
                    tierZeroTracks: {}
                };

                if (!_tracks_) {
                    return counts;
                }

                _tracks_.forEach(function (track) {
                    var isBunkerOnly = (types.bunker in track) && track[types.bunker],
                        isEventOnly = (types.event in track),
                        withoutCoordinates = !(types.coords in track) || ((types.coords in track) && track.coords == ""),
                        worldId = track.world,
                        isPlayable = !isBunkerOnly && !isEventOnly && !withoutCoordinates;
                    if (track.tier === 0) {
                        counts.tierZeroTracks[track.id] = track;
                    }
                    if (!(worldId in counts.worlds)) {
                        counts.worlds[worldId] = 0;
                    }
                    // all released
                    if (!isEventOnly) {
                        counts.released++;
                    }
                    // all playable with map location
                    if (isPlayable) {
                        counts.all++;
                        counts.worlds[worldId]++;
                    }
                    // without coords
                    if (withoutCoordinates) {
                        counts.coords++;
                    }
                    // not released
                    if (withoutCoordinates && !isBunkerOnly && !isEventOnly) {
                        counts.not_released.push(track);
                    }
                    // bunker
                    if (isBunkerOnly) {
                        counts.bunker.push(track);
                    }
                    // only event
                    if (isEventOnly) {
                        counts.event.push(track);
                    }
                });

                return counts;
            }
        }
    })