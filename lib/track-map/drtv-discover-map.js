angular.module("trialsTrackmap")
    .directive("discoverMap", function (
        $rootScope, $parse, $filter, $compile, $trackRadius, categories) {

        var tracksTpl = '\
            <ellipse \
                cx="{%x%}"\
                cy="{%y%}"\
                rx="{%discoverTrackRadius%}"\
                ry="{%discoverTrackRadius%}"\
                track="{%trackname%}"\
                fill="white"\
                filter="url(#filter)"></ellipse>\
            ',
            tpl = '\
            <img class="trackmap--cloud"\
                src="{%cloudImageSrc%}" />\
            <svg class="trackmap--discovered" \
                xmlns="http://www.w3.org/2000/svg"\
                xmlns:xlink="http://www.w3.org/1999/xlink"\
                width="{%discoverWidth%}" height="{%discoverHeight%}">\
                <defs>\
                    <filter id="filter"><feGaussianBlur stdDeviation="10"/></filter>\
                    <mask id="mask">\
                        {%tracks%}\
                    </mask>\
                </defs>\
                <image xlink:href="{%worldImageSrc%}"\
                    height="{%discoverHeight%}"\
                    width="{%discoverWidth%}"\
                    mask="url(#mask)"></image>\
            </svg>';

        return {
            restrict: "A",
            template: '<div class="trackmap__wrapper"></div>',
            controller: function ($scope, $element) {
                $scope.filteredTracks = [];
                $scope.discoverTrackRadius = $trackRadius * 2;
                $scope.discoverWidth = 0;
                $scope.discoverHeight = 0;
                $scope.worldImageDiscover = "";
                $scope.worldImageSrc = "";
                $scope.cloudImageSrc = "";

                var classShowDiscovery = "show-discovery";

                var splitCoords = function (xOrY, _coords_) {
                    var coords = _coords_.split(',');
                    return parseInt(coords[xOrY === 'x' ? 0 : 1]);
                };

                var defaultFilterCatId = categories.getDefaultFilterCatId();

                $scope.resetFilter = function () {
                    $rootScope.$emit("filter:tracks", defaultFilterCatId);
                    $rootScope.$emit("discover:clear");
                };

                function showMaps() {
                    $scope.worldImageDiscover = $scope.data.images.trackmaps[$scope.selectedWorld];
                    $scope.worldImageSrc = $filter("hoster")($scope.worldImageDiscover.src, $scope.data.hoster);
                    $scope.cloudImageSrc = $filter("hoster")($scope.worldImageDiscover.srcDiscover, $scope.data.hoster);

                    setDimensions();

                    var tracks = "";

                    $scope.filteredTracks
                        .forEach(function (track) {
                            if (track.coords && track.world === $scope.selectedWorld) {
                                tracks += tracksTpl
                                    .replace(/{%trackname%}/g, track.i18n)
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

                    if($scope.filteredTracks.length === 0) {
                        $element[0].classList.remove(classShowDiscovery);
                    } else {
                        $element[0].classList.add(classShowDiscovery);
                    }
                }

                function setDimensions() {
                    $scope.dim = $scope.worldImageDiscover.dim.split("x");
                    $scope.discoverWidth = $scope.dim[0] + "px";
                    $scope.discoverHeight = $scope.dim[1] + "px";
                }

                $rootScope.$on("discover:clear", function () {
                    $scope.filteredTracks = [];
                    showMaps();
                });

                $rootScope.$on("discover:show", function (event, tracks) {
                    $scope.filteredTracks = tracks;
                    showMaps();
                });

                $rootScope.$on("data:loaded", function () {
                    showMaps();
                });

                $rootScope.$on("world:ready", function () {
                    setDimensions();
                });
            }
        }
    })