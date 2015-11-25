angular.module("trialsTrackmap")
    .directive("editWorldrecord", function (improveTimes, $filter, $window, dialogEditWorldRecord) {
        return {
            restrict: "A",
            link: function (scope, element) {
                element.on("click", function () {
                    dialogEditWorldRecord
                        .open(scope.track);
                });
            }
        }
    })