angular.module("trialsTrackmap")
    .directive("bikeDriven", function (garage) {
        return {
            restrict: "A",
            scope: {
                timeData: "=bikeDriven"
            },
            template: '\
                <i ng-if="timeData.bikeId" \
                    class="paintjob paintjob-{%timeData.bikeId%}-{%timeData.paintjobId || 0%}"\
                    title="{%::drivenBike%}"></i>\
            ',
            link: function (scope, element) {
                scope.drivenBike = "";
                scope.$watch("timeData", function (newData) {
                    if (newData) {

                        scope.drivenBike = garage.getBikeName(newData.bikeId)
                            + " - " + garage.getPaintjobName(newData.bikeId, newData.paintjobId);

                        angular.element(element).css("display", null);
                    } else {
                        angular.element(element).css("display", "none");
                    }
                });
            }
        }
    })