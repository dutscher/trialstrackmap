angular.module("trialsTrackmap")
    .directive("checkMin", function (improveTimes) {
        return {
            restrict: "A",
            scope: {
                data: "=checkMin"
            },
            link: function (scope, element, attrs) {
                var className = "over-min not-hover";

                function compareMin(minValue) {
                    if (minValue
                        && improveTimes.clearTime(minValue.typeValue) > 0
                        && minValue.value >= improveTimes.clearTime(minValue.typeValue)) {
                        element.addClass(className);
                    } else {
                        element.removeClass(className);
                    }
                }

                scope.$watch("data", function (minValue) {
                    compareMin(minValue);
                });
            }
        }
    })