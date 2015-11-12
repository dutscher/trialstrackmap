angular.module("trialsTrackmap")
    .filter("catAndTierTracks", function () {
        return function (tracks, catId, tierId) {
            if (!tracks) {
                return [];
            }

            var array = tracks.filter(function (track) {
                var catIds = track.cats.split(",").map(Number),
                    hasCatId = catIds.indexOf(catId) >= 0,
                    isTierIdGiven = tierId !== undefined && tierId !== "",
                    isTier = track.tier === parseInt(tierId, 10);

                return hasCatId && !isTierIdGiven
                    || hasCatId
                    && isTierIdGiven
                    && isTier;
            });

            //console.log(array, catId, tierId);

            return array;
        }
    })