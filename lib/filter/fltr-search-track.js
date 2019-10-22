angular.module("trialsTrackmap")
    .filter("searchTrack", function () {
        return function (tracks, trackName) {
            if (!tracks || !trackName || trackName === "") {
                return tracks;
            }

            var filteredTracks = [],
                clearTrackName = trackName
                    .toLowerCase()
                    .replace(/\+/g, " ");

            tracks.forEach(function (track) {
                if (!track.i18n
                    || track.i18n
                        && track.i18n.toLowerCase()
                            .indexOf(clearTrackName.toLowerCase()) === -1) {
                    return;
                } else {
                    filteredTracks.push(track);
                }
            });

            return filteredTracks;
        }
    });