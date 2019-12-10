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

                var drawedTracks = [];
                
                function showCatOnMap() {
                    canvas.clear("showCatOnMap");
                    drawedTracks = [];
                    
                    scope.tracksOfCat.forEach(function (track) {
                        if (!track.coords
                            || track.categories.indexOf(scope.cat.index) === -1
                            || track.world !== trackData.getWorld()
                            || drawedTracks.indexOf(track.coords) !== -1) {
                            return;
                        }

                        canvas.drawCategoryTrack(track.coords, scope.cat.color);
                        drawedTracks.push(track.coords);
                    })
                }
                
                // scope data
                scope.tracksOfCat = trackData.getTracksOfCat(scope.cat.index, true);
                
                // event binding
                element.bind("click", function () {
                    scope.$apply(function () {
                        $rootScope.$emit("filter:tracks", scope.cat.index);
                    });
                });
    
                $rootScope.$on("canvas:ready", function () {
                    if ($rootScope.filterCatId === scope.cat.index) {
                        showCatOnMap();
                    }
                });
    
                $rootScope.$on("filter:tracks", function (event, catId) {
                    if (scope.cat && scope.cat.index === catId) {
                        showCatOnMap();
                    }
                });
    
                $rootScope.$on("show:tracks", function (event, catId) {
                    if (scope.cat.index === catId) {
                        showCatOnMap();
                    }
                });
            }
        }
    })