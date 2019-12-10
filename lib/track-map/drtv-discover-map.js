angular.module("trialsTrackmap")
    .directive("discoverMap", function (
        $rootScope, $parse, $filter, $compile, $trackRadius) {

        var tracksTpl = '\
            <ellipse \
                cx="{%x%}"\
                cy="{%y%}"\
                rx="{%discoverTrackRadius%}"\
                ry="{%discoverTrackRadius%}"\
                fill="white"\
                filter="url(#filter)"></ellipse>\
            ',
            tpl = '\
            <img class="trackmap trackmap--cloud"\
                src="{%cloudImageSrc%}" />\
            <svg class="trackmap trackmap--discovered" \
                xmlns="http://www.w3.org/2000/svg"\
                xmlns:xlink="http://www.w3.org/1999/xlink"\
                width="{%discoverWidth%}" height="{%discoverHeight%}">\
                <mask id="mask">\
                    <filter id="filter"><feGaussianBlur stdDeviation="10"/></filter>\
                    <defs>{%tracks%}</defs>\
                </mask>\
                <image xlink:href="{%worldImageSrc%}"\
                    width="{%discoverWidth%}" height="{%discoverHeight%}"\
                    mask="url(#mask)">\
                </image>\
            </svg>';

        return {
            restrict: "A",
            template: '\
                <div class="trackmap__wrapper"></div>',
            controller: function ($scope, $element, $attrs) {
                $scope.activeCategory = -1;
                $scope.discoverTrackRadius = $trackRadius * 2;
                $scope.discoverWidth = 0;
                $scope.discoverHeight = 0;
                $scope.worldImageDiscover = "";
                $scope.worldImageSrc = "";
                $scope.cloudImageSrc = "";

                var splitCoords = function (xOrY, _coords_) {
                    var coords = _coords_.split(',');
                    return coords[xOrY === 'x' ? 0 : 1];
                };

                function showMaps() {
                    $scope.worldImageDiscover = $scope.data.images.trackmaps[$scope.selectedWorld];
                    $scope.worldImageSrc = $filter("hoster")($scope.worldImageDiscover.src, $scope.data.hoster);
                    $scope.cloudImageSrc = $filter("hoster")($scope.worldImageDiscover.srcDiscover, $scope.data.hoster);

                    setDimensions();

                    var tracks = "";
                    $scope.data.tracks.forEach(function (track) {
                        if (track.coords && track.world === $scope.selectedWorld) {
                            tracks += tracksTpl
                                .replace(/{%x%}/g, splitCoords('x', track.coords))
                                .replace(/{%y%}/g, splitCoords('y', track.coords))
                                .replace(/{%discoverTrackRadius%}/g, $scope.discoverTrackRadius)
                        }
                    });

                    var svgHTML = tpl
                        .replace(/{%discoverWidth%}/g, $scope.discoverWidth)
                        .replace(/{%discoverHeight%}/g, $scope.discoverHeight)
                        .replace(/{%worldImageSrc%}/g, $scope.worldImageSrc)
                        .replace(/{%cloudImageSrc%}/g, $scope.cloudImageSrc)
                        .replace(/{%discoverTrackRadius%}/g, $scope.discoverTrackRadius)
                        .replace(/{%tracks%}/g, tracks);

                    $element[0].querySelector('.trackmap__wrapper').innerHTML = svgHTML;
                }

                function setDimensions() {
                    $scope.dim = $scope.worldImageDiscover.dim.split("x");
                    $scope.discoverWidth = $scope.dim[0] + "px";
                    $scope.discoverHeight = $scope.dim[1] + "px";
                }

                $rootScope.$on("data:loaded", function () {
                    showMaps();
                });

                $rootScope.$on("discover:clear", function () {
                    $scope.activeCategory = -1;
                });

                // lib/track-map/drtv-track-pointer.js
                $rootScope.$on("world:changeStart", function (event, newWorld) {

                });

                $rootScope.$on("world:ready", function () {
                    setDimensions();
                });
            }
        }
    })