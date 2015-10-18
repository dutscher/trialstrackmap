angular.module('trialsTrackmap')
.service('trackStats', function () {
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
                coords: 0,
                bunker: [],
                leaked: [],
                event: [],
                not_released: 0,
                youtube: 0
            };

            if (!tracks) {
                return counts;
            }

            tracks.forEach(function (track) {
                var isBunkerOnly = (types.bunker in track) && track[types.bunker],
                    isEventOnly = (types.event in track),
                    isLeaked = (types.leaked in track) && track[types.leaked],
                    withoutCoordinates = !(types.coords in track) || ((types.coords in track) && track.coords == "");
                // all playable with map location
                if (!isLeaked && !isBunkerOnly && !isEventOnly && !withoutCoordinates) {
                    counts.all++;
                }
                // without coords
                if (withoutCoordinates) {
                    counts.coords++;
                }
                // not released
                if (withoutCoordinates && !isBunkerOnly && !isLeaked && !isEventOnly) {
                    counts.not_released++;
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