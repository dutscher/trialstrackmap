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
                ng-if="track.world === selectedWorld"\
                shape="circle" alt="{%\'tracks.\'+track.id|translate%}"\
                title="{%\'tracks.\'+track.id|translate%}"\
                coords="{%track.coords||\'0,0,0\'%}"\
                href="#"\
                show-track-in-modal="startline" />\
            ',
            controller: function ($scope) {
                var activeFerry;
                $scope.ferryCoords = "0,0,0";

                function showFerry() {
                    // add ferry to world
                    activeFerry = $scope.data.media.ferries[$rootScope.selectedWorld];
                    $scope.ferryCoords = activeFerry.coords + "," + trackRadius;
                    $scope.ferryLink = activeFerry.linkTo;
                }

                $rootScope.$on("ferry.panTo", function(){
                    var coords = activeFerry.coords.split(",");
                    $rootScope.$emit("map.panTo", coords[0], coords[1]);
                });

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