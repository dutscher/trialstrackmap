angular.module("trialsTrackmap")
    .filter("searchTrack", function () {
        return function (tracks, searchTrack) {
            if (!searchTrack) {
                return tracks;
            }

            var filteredTracks = [];

            tracks.forEach(function (track) {
                if (searchTrack && searchTrack != "" && track.i18n.toLowerCase()
                        .indexOf(searchTrack.toLowerCase()) == -1
                    || track.tier == 0) {
                    return;
                } else {
                    filteredTracks.push(track);
                }
            });

            return filteredTracks;
        }
    })