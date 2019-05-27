angular.module("trialsTrackmap")
    .directive("ngLoad", function ($parse, $timeout) {
        return {
            restrict: "A",
            compile: function ($element, attr) {
                var fn = $parse(attr["ngLoad"]),
                    timeoutSecs = attr["ngLoadTimeoutSec"];

                return function (scope, element) {
                    var isLoaded = false;

                    function loaded() {
                        element.addClass("loaded");
                        element.removeClass("loading");
                        scope.$apply(function () {
                            fn(scope, {isLoaded: isLoaded});
                        });
                    }

                    element.addClass("loading");
                    element.on("load", function () {
                        isLoaded = true;
                        loaded();
                    });

                    if (timeoutSecs) {
                        $timeout(function () {
                            if (!isLoaded) {
                                loaded();
                            }
                        }, parseInt(timeoutSecs) * 1000);
                    }
                };
            }
        };
    })