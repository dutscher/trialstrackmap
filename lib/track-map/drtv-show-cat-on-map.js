angular.module("trialsTrackmap")
    .directive("showCatOnMap", function ($rootScope, $timeout, $filter, trackData, canvas) {
        return {
            restrict: "A",
            scope: {
                cat: "=showCatOnMap"
            },
            template: '\
                {%::tracksOfCat.length%}\
            ',
            link: function (scope, element) {
                if (!canvas.exists()) {
                    return;
                }

                function showCatOnMap() {
                    canvas.clear();

                    scope.tracksOfCat.forEach(function (track) {
                        var catIds = track.cats.split(",");

                        if (!track.coords || catIds.indexOf("" + scope.cat.index) === -1 || track.world !== trackData.getWorld()) {
                            return false;
                        }

                        canvas.drawCategoryTrack(track.coords, scope.cat.color);
                    })
                }

                element.bind("click", function (event) {
                    showCatOnMap();
                    $rootScope.$emit("handleSidebars", event, "right", "close", true);
                });

                scope.tracksOfCat = trackData.getTracksOfCat(scope.cat.index);
            }
        }
    })