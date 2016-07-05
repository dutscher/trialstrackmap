angular.module("trialsTrackmap")
    .filter("catAndTierTracks", function (items, categories) {
        return function (tracks, catId, tierId) {
            if (!tracks) {
                return [];
            }

            var additional = [],
                catName = categories.getName(catId);

            var array = tracks.filter(function (track) {
                var hasCatId = categories.hasTrackCategory(track, catId),
                    isTierIdGiven = tierId !== undefined && tierId !== "",
                    isTier = track.tier === parseInt(tierId, 10),
                    trackItems = track[catName] || [];

                // only count they have more than one item
                if (trackItems.length > 1) {
                    additional.push(track);
                }

                return hasCatId && !isTierIdGiven
                    || hasCatId
                    && isTierIdGiven
                    && isTier;
            });

            //console.log(catId, catName, array.length, additional.length)

            return array.concat(additional);
        }
    })