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
                    withoutCoords: 0,
                    bunker: [],
                    notReleased: [],
                    event: [],
                    onMap: 0,
                    youtube: 0,
                    youtubeMultiple: 0,
                    tierZeroTracks: []
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
                    if (!(worldId in counts.worlds)) {
                        counts.worlds[worldId] = 0;
                    }
                    // all released
                    if (!withoutCoordinates) {
                        counts.onMap++;
                        counts.worlds[worldId]++;
                    }
                    // without coords
                    if (withoutCoordinates) {
                        counts.withoutCoords++;
                    }
                    // not released
                    if (withoutCoordinates && !isBunkerOnly && !isEventOnly) {
                        counts.notReleased.push(track);
                    }
                    // bunker
                    if (isBunkerOnly) {
                        counts.bunker.push(track);
                    }
                    // only event
                    if (isEventOnly) {
                        counts.event.push(track);
                    }
                    // no tier show to see before release
                    if (track.tier === 0 && !withoutCoordinates) {
                        counts.tierZeroTracks.push(track);
                    }

                    counts.all++;
                });

                return counts;
            }
        }
    })