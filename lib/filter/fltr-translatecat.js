angular.module("trialsTrackmap")
    .filter("translateCat", function (categories, $filter) {
        return function (catNameOrIndicator) {
            if (catNameOrIndicator.indexOf("cats") === -1)
                return catNameOrIndicator;

            var catId = catNameOrIndicator.replace("cats\.", ""),
                catData = categories.findById(catId);

            return catData.name;
        }
    })