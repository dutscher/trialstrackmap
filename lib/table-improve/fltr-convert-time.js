angular.module("trialsTrackmap")
    .filter("convertTime", function (improveTimes) {
        return function (time) {
            if (!time) {
                time = improveTimes.error;
            }
            time = improveTimes.convertTime(time);
            return time;
        }
    })