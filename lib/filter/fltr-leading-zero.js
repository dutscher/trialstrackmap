angular.module("trialsTrackmap")
    .filter("leadingZero", function () {
        return function (num, size) {
            if (!angular.isNumber(num) && !angular.isString(num) || num === "") {
                return "";
            }

            var s = num + "",
                size = size || 2;
            // add zeros
            while (s.length < size) s = "0" + s;

            return s;
        }
    })