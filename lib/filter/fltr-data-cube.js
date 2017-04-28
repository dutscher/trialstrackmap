angular.module("trialsTrackmap")
    .filter("dataCube", function () {
        return function (array) {
            if (!array)
                return [];
            return array.filter(function (item) {
                return item.categories.indexOf("6") >= 0;
            })
        }
    })