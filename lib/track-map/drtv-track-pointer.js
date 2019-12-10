angular.module("trialsTrackmap")
    .directive("trackPointer", function (
        $rootScope, $parse, $trackRadius) {
        return {
            restrict: "A",
            template: '\
                <area ng-click="changeWorld(ferryLink)"\
                    shape="circle"\
                    title="Ferry to: {%\'page.ferryTo.\'+ferryLink|translate%}"\
                    coords="{%ferryCoords%}"\
                    href="javascript:void(0);"\
                    />\
                <area ng-repeat="track in data.tracks"\
                    ng-if="track.world === selectedWorld && !onlyFerry"\
                    shape="circle"\
                    title="{%track.i18n%}"\
                    coords="{%track.coords||\'0,0,0\'%}"\
                    href="javascript:void(0);"\
                    show-track-in-modal="look-on-filter" />\
            ',
            controller: function ($scope, $element, $attrs) {
                var activeFerry,
                    worldChanged,
                    onlyFerry = $parse($attrs.onlyFerry)($scope);
                
                $scope.ferryCoords = "0,0,0";
                
                if (onlyFerry) {
                    $scope.onlyFerry = onlyFerry;
                }
                
                function showFerry() {
                    // add ferry to world
                    activeFerry = $scope.data.ferries[$rootScope.selectedWorld];
                    $scope.ferryCoords = activeFerry.coords + "," + ($trackRadius * 2);
                    $scope.ferryLink = activeFerry.linkTo;
                }
                
                function panToFerry() {
                    var coords = activeFerry.coords.split(",");
                    $rootScope.$emit("map.panTo", coords[0], coords[1]);
                }
                
                $rootScope.$on("ferry.panTo", function () {
                    panToFerry();
                });
                
                $rootScope.$on("data:loaded", function () {
                    showFerry();
                });
                
                $rootScope.$on("world:changeStart", function (event, newWorld) {
                    if (newWorld) {
                        showFerry();
                        worldChanged = true;
                    }
                });
                
                $rootScope.$on("world:ready", function () {
                    if (worldChanged === true) {
                        panToFerry();
                    }
                });
            }
        }
    })