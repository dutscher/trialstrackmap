angular.module("trialsTrackmap")
    .filter("localeDate", function () {
        return function (_date_) {
            if (!_date_) {
                return _date_;
            }
            var date = new Date(_date_);
            return date.toLocaleDateString();
        }
    })