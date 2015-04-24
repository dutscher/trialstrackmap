angular.module('trialsTrackmap')
.directive('map', function ($rootScope, $window) {
    return {
        restrict: 'E',
        scope: true,
        controller: function ($scope, $element) {
            $scope.tracks = [];

            function calcCoords(where) {
                if(!$scope.tracks)
                    return false;

                var map = document.querySelector('.trackmap'),
                    dim = $scope.dim;

                var w = dim[0],
                    h = dim[1],
                    r = w / h,
                    newWidth = map.offsetWidth,
                    newHeight = Math.ceil(newWidth / r);

                // set width and height to imagemap
                var pointerMaps = document.querySelectorAll('.track-pointer, canvas[track-pointer], .trackmap');
                [].forEach.call(pointerMaps,function(pointer){
                    pointer.setAttribute('width', newWidth + 'px')
                    pointer.setAttribute('height', newHeight + 'px')
                });

                var wPercent = map.offsetWidth / 100,
                    hPercent = map.offsetHeight / 100;

                $scope.tracks.forEach(function (track, index) {
                    if (track.coords == '') {
                        return false;
                    }
                    var coords = track.coords.split(','),
                        coordsPercent = track.coords.split(',');

                    for (var i = 0; i < coordsPercent.length; ++i) {
                        if (i % 2 === 0)
                            coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                        else
                            coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                    }

                    track.genCoords = coordsPercent.toString();
                });

                $scope.$apply();
            }

            $rootScope.$on('data:loaded',function(event, data){
                // set to scope
                $scope.tracks = data.tracks;
                $scope.dim = data.images.trackmap.dim.split('x');
                $rootScope.$on('image:loaded', function(event, image){
                    if(image.attr('class').indexOf('trackmap') >= 0 ) {
                        calcCoords('onload');
                    }
                });
            });

            angular.element($window).on('resize', function(){
                calcCoords('resize');
            });
        }
    }
})