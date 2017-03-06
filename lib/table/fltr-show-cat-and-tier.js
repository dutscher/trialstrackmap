angular.module("trialsTrackmap")
    .filter("showCatAndTier", function () {
        return function (array, selectedCat, selectedTier) {
            if(!array) {
                return array;
            }

            if (selectedCat || selectedTier) {
                array = array.filter(function (track) {
                    if (!selectedTier
                        && selectedCat
                        && track.categories.indexOf(parseInt(selectedCat, 10)) >= 0
                        ||
                        selectedTier
                        && selectedCat
                        && track.tier === parseInt(selectedTier, 10)
                        && track.categories.indexOf(parseInt(selectedCat, 10)) >= 0
                        ||
                        selectedTier
                        && !selectedCat
                        && track.tier === parseInt(selectedTier, 10)
                    ) {
                        return true;
                    }

                    return false;
                });
            }
            return array;
        }
    })