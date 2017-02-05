angular.module("trialsTrackmap")
    .filter("catAndTierTracks", function (items, categories) {
        return function (tracks, catId, tierId) {
            if (!tracks) {
                return [];
            }

            var array = [],
                additional = [],
                catName = categories.getName(catId);

            array = tracks.filter(function (track) {
                var hasCatId = categories.hasTrackCategory(track, catId),
                    isTierIdGiven = tierId !== undefined && tierId !== "",
                    isTier = track.tier === parseInt(tierId, 10),
                    trackItems = track[catName] || [];

                // only count they have more than one item
                if (hasCatId && trackItems.length > 1) {
                    additional.push(track);
                }

                return hasCatId && !isTierIdGiven
                    || hasCatId
                    && isTierIdGiven
                    && isTier;
            });

            return array.concat(additional);
        }
    })