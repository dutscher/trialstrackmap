angular.module("trialsTrackmap")
    .service("trackStats", function () {
        return {
            get: function (tracks) {
                var types = {
                        leaked: "leaked",
                        bunker: "only_bunker",
                        youtube: "youtube",
                        coords: "coords",
                        event: "only_event"
                    },
                    counts = {
                        all: 0,
                        worlds: {},
                        coords: 0,
                        bunker: [],
                        leaked: [],
                        not_released: [],
                        event: [],
                        released: 0,
                        youtube: 0
                    };

                if (!tracks) {
                    return counts;
                }

                tracks.forEach(function (track) {
                    var isBunkerOnly = (types.bunker in track) && track[types.bunker],
                        isEventOnly = (types.event in track),
                        isLeaked = (types.leaked in track) && track[types.leaked],
                        withoutCoordinates = !(types.coords in track) || ((types.coords in track) && track.coords == ""),
                        worldId = track.world;

                    if (!(worldId in counts.worlds)) {
                        counts.worlds[worldId] = 0;
                    }

                    // all released
                    if (!isLeaked && !isEventOnly) {
                        counts.released++;
                    }
                    // all playable with map location
                    if (!isLeaked && !isBunkerOnly && !isEventOnly && !withoutCoordinates) {
                        counts.worlds[worldId]++;
                        counts.all++;
                    }
                    // without coords
                    if (withoutCoordinates) {
                        counts.coords++;
                    }
                    // not released
                    if (withoutCoordinates && !isBunkerOnly && !isLeaked && !isEventOnly) {
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
                    // leaked
                    if (isLeaked) {
                        counts.leaked.push(track);
                    }
                    // youtube
                    if ((types.youtube in track)) {
                        counts.youtube++;
                    }
                });

                return counts;
            }
        }
    })