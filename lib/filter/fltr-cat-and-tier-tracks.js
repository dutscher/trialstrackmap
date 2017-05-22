angular.module("trialsTrackmap")
    .filter("catAndTierTracks", function (items, categories) {
        return function (tracks, catId, tierId, countAll) {
            if (!tracks) {
                return [];
            }

            var array,
                additional = [],
                catData = categories.findById(catId),
                countAllItems = catData.hasOwnProperty("countAll");

            array = tracks.filter(function (track) {
                var hasCatId = categories.hasTrackCategory(track, catId),
                    isTierIdGiven = tierId !== undefined && tierId !== "",
                    isTier = track.tier === parseInt(tierId, 10),
                    trackItems = track[catData.dataKey] || [];

                // only count them, they have more than one item
                if (hasCatId && trackItems.length > 1 && !countAllItems && !countAll) {
                    additional.push(track);
                }

                if (countAll && countAllItems && trackItems.length > 1) {
                    trackItems.forEach(function () {
                        additional.push(track);
                    })
                }

                return hasCatId && !isTierIdGiven
                    || hasCatId
                    && isTierIdGiven
                    && isTier;
            });

            return array.concat(additional);
        }
    })