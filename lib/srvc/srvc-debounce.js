angular.module("trialsTrackmap")
    .service("debounce", ["$timeout", function ($timeout) {
        return function (func, wait, immediate, invokeApply) {
            var timeout, args, context, result;

            function debounce() {
                /* jshint validthis:true */
                context = this;
                args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(later, wait, invokeApply);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            }

            debounce.cancel = function () {
                $timeout.cancel(timeout);
                timeout = null;
            };

            return debounce;
        };
    }]);