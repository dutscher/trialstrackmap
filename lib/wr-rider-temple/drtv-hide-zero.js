angular.module("trialsTrackmap")
    .directive("hideZero", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var className = "hide-zero";
                if(attrs.hideZero === "0") {
                    element.addClass(className);
                } else {
                    element.removeClass(className);
                }
            }
        }
    })