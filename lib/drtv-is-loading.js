angular.module("trialsTrackmap")
    .directive("isLoading", function ($rootScope, $timeout) {
        return {
            restrict: "C",
            link: function (scope, element, attrs) {
                var event = attrs.event || "tracks:ready";
                $rootScope.$on(event, function (event) {
                    if (!event) {
                        return false;
                    }

                    $timeout(function () {
                        angular.element(element).addClass("is-ready");
                        scope[attrs.finished] = true;
                    }, 1000);
                });
            }
        }
    })