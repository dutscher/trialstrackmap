angular.module("trialsTrackmap")
    .filter("convertTime", function (improveTimes) {
        return function (time, showZero) {
            if (!time && !showZero) {
                time = improveTimes.error;
            }
            time = improveTimes.convertTime(time, showZero);
            return time;
        }
    })