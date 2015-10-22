angular.module('trialsTrackmap')
.directive('galleryModal', function($rootScope, $window, $timeout, $filter){
    return {
        restrict: 'C',
        template: '<div class="backdrop"></div>'+
        '<div class="body" ng-click="close($event)">'+
            '<div class="gallery" ng-class="{\'ready\':galleryReady}">'+
                '<h2>{{track.i18n}}</h2>'+
                '<h3 class="stats">' +
                    '<span track-medals="track"></span>' +
                    '<span ng-if="track.chips" title="{{\'page.trackDetail.chipsAmount\'|translate}}"><i class="chips"></i> {{track.chips}}</span>' +
                '</h3>'+
                '<h3 class="caption">{{title}}</h3>'+
                '<div ng-hide="imageReady" class="loader spin"></div>'+
                '<div class="wrap">'+
                    '<img ng-hide="showVideo" ng-load="imageReady = true" ng-class="{\'loading\':!imageReady,\'loaded\':imageReady}" width="100%" height="100%" />'+
                    '<iframe ng-show="showVideo" src="about:blank" frameborder="0" allowfullscreen width="100%" height="100%"></iframe>'+
                '</div>'+
                '<div class="media-chooser">' +
                    '<i class="startline" show-track-in-modal="startline" ng-model="track"></i>' +
                    '<i class="data-cube" ng-if="track.datacube" show-track-in-modal="datacube"></i>'+
                    '<span candy-list="track"></span>' +
                    '<i class="youtube" ng-if="track.youtube" show-track-in-modal="youtube"></i>'+
                '</div>'+
                '<div part-list="track" part-scale="0.8" index="0" ng-hide="showVideo"></div>'+
            '</div>'+
        '</div>',
        scope: true,
        controller: function ($scope, $element) {
            var imageHoster = {},
                maxWidth = 960;

            function reset(){
                $scope.showVideo = false;
                $scope.track = {};
                $scope.title = '';
                $scope.image = '';
                $scope.type = '';
                $scope.galleryReady = false;
                $scope.imageReady = false;
                $element.find('img').attr('src','').attr('ng-src','');
                $element.find('iframe').attr('src','');
                $element.removeClass('open');

                $rootScope.$emit('pageTitle:change');
            }

            function calcDim(dim){
                var windowDim = {w:$window.innerWidth,h:$window.innerHeight};

                var newDim = {w:320,h:180};

                var defaultDim = {
                    w: dim.w,
                    h: dim.h,
                    ratio: dim.w / dim.h,
                    percent: {
                        w: Math.floor((dim.w * 100 ) / windowDim.w),
                        h: Math.floor((dim.h * 100 ) / windowDim.h)
                    }
                };

                if (defaultDim.percent.w >= 75 || defaultDim.percent.h >= 75) {
                    newDim.w = defaultDim.w - (defaultDim.w * 0.25);
                    newDim.h = defaultDim.h - (defaultDim.h * 0.25);

                    if (newDim.w >= windowDim.w) {
                        newDim.w = windowDim.w - 50;
                        newDim.h = newDim.w / defaultDim.ratio;
                    } else if (newDim.h >= windowDim.h) {
                        newDim.h = windowDim.h - 100;
                        newDim.w = newDim.h * defaultDim.ratio;
                    }

                } else {
                    newDim.w = defaultDim.w;
                    newDim.h = defaultDim.h;
                }

                return newDim;
            }

            function setSize(){
                var newDim = {};

                if(!$scope.showVideo){
                    $element
                        .find('img')
                        .attr('src','');

                    var image = new Image();
                    image.src = $scope.src;
                    image.onload = function () {
                        newDim = calcDim({w:image.width,h:image.height});

                        angular.element($element[0].querySelector('.wrap'))
                            .css('width', newDim.w + 'px')
                            .css('height', newDim.h + 'px');

                        $timeout(function () {
                            $element
                                .find('img')
                                .attr('src', $scope.src);
                        }, 250);
                    };
                } else {
                    $scope.imageReady = true;
                    newDim = calcDim({w:1280,h:720});

                    $element
                        .find('iframe')
                        .attr('src','about:blank');

                    $timeout(function () {

                        angular.element($element[0].querySelector('.wrap'))
                            .css('width', newDim.w + 'px')
                            .css('height', newDim.h + 'px');

                        $element
                            .find('iframe')
                            .attr('src', $scope.src);
                    }, 250);
                }
            }

            reset();

            angular.element($window).on('resize', function(){
                setSize();
            });

            $scope.close = function($event){
                $event.stopPropagation();
                $event.preventDefault();
                reset();
            };

            $rootScope.$on('showModal', function(event, track, type, title){
                if(track == $scope.track && type == $scope.type)
                    return false;

                $scope.track = track;
                $scope.title = title;
                $scope.type = type;
                $scope.imageReady = false;
                $scope.showVideo = false;

                $rootScope.$emit('pageTitle:change',track.i18n);

                var src = '';

                switch(true){
                    case 'startline' == type:
                        src = $scope.track.startline;
                        break;
                    case type.indexOf('datacube') >= 0:
                        src = $scope.track.datacube;
                        break;
                    case type.indexOf('candy') >= 0:
                        var index = type.split(':')[1];
                        src = $scope.track.candys[index].src;
                        break;
                    case type.indexOf('youtube') >= 0:
                        src = $scope.track.youtube;
                        $scope.showVideo = true;
                        break;
                }

                $scope.src = $filter('imageHoster')(src,imageHoster);

                setSize();

                $scope.$apply();
                $element.addClass('open');
            });

            $rootScope.$on('data:loaded',function(event, data){
                imageHoster = data.imagehoster;
            });

            $scope.$watch('imageReady', function(imageReady){
                if(imageReady){
                    $scope.galleryReady = true;
                }
            });
        }
    }
})