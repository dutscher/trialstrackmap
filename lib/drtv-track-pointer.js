angular.module("trialsTrackmap")
    .directive("trackPointer", function ($rootScope, trackRadius) {
        return {
            restrict: "A",
            template: '\
            <area shape"circle" \
                ng-click="changeWorld(ferryLink)"\
                coords="{%ferryCoords%}"\
                title="{%\'page.ferryTo.\'+ferryLink|translate%}"\
                />\
            <area ng-repeat="track in data.tracks"\
                ng-if="!track.world && selectedWorld === 1 || track.world === selectedWorld"\
                shape="circle" alt="{%\'tracks.\'+track.id|translate%}"\
                title="{%\'tracks.\'+track.id|translate%}"\
                coords="{%track.coords||\'0,0,0\'%}"\
                href="#"\
                show-track-in-modal="startline" />\
            ',
            controller: function ($scope) {
                $scope.ferryCoords = "0,0,0";

                function showFerry() {
                    // add ferry to world
                    var activeFerry = $scope.data.media.ferries[$scope.selectedWorld];
                    $scope.ferryCoords = activeFerry.coords + "," + trackRadius;
                    $scope.ferryLink = activeFerry.linkTo;
                }

                $rootScope.$on("data:loaded", function () {
                    showFerry();
                });

                $rootScope.$on("world:changed", function (event, newWorld) {
                    if (newWorld) {
                        showFerry();
                    }
                });
            }
        }
    })