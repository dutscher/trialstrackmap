angular.module('trialsTrackmap')
.directive('preloadImages',function($rootScope, $filter, useLocalFiles, $document){
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element){
            var css = '',
                html = '';

            function preloadImages(){
                var preloadWrap = document.querySelector('.preload')
                Object.keys(scope.images).forEach(function(imageKey){
                    if(imageKey == 'trackmap')
                        return;
                    var image = scope.images[imageKey];
                    // preload
                    css += '.preload .'+imageKey+'{background: url(\''+$filter('imageHoster')(image[useLocalFiles?'lSrc':'src'],scope.imageHoster)+'\') no-repeat -9999px -9999px;}\n';
                    html+= '<div class="'+imageKey+'"></div>\n';
                    // regular selector
                    css += image.selector+'{background'+(image.sprite?'-image':'')+':url(\''+$filter('imageHoster')(image[useLocalFiles?'lSrc':'src'],scope.imageHoster)+'\') '+(image.bgPos||'')+';}\n';
                });

                preloadWrap.innerHTML = html;
                element.html(css);
            }

            angular.element($document.find('body')).append('<div class="preload"></div>');

            $rootScope.$on('data:loaded',function(event, data){
                scope.images = data.images;
                scope.imageHoster = data.imagehoster;

                preloadImages();
            });
        }
    }
})