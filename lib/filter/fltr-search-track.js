angular.module("trialsTrackmap")
    .filter("searchTrack", function () {
        return function (tracks, searchTrack) {
            if (!searchTrack || !tracks) {
                return tracks;
            }

            var filteredTracks = [];

            tracks.forEach(function (track) {
                if (searchTrack && searchTrack != ""
                    && track.i18n
                    && track.i18n.toLowerCase()
                        .indexOf(searchTrack.toLowerCase()) == -1
                    || track.tier == 0
                    || !track.i18n) {
                    return;
                } else {
                    filteredTracks.push(track);
                }
            });

            return filteredTracks;
        }
    })