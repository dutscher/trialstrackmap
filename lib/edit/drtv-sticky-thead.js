angular.module('trialsTrackmap')
.directive('stickyThead', function($window){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            var mirror = null;

            function handleMirrorHead(remove){
                if(!remove && mirror == null) {
                    var thead = element.find('thead').clone();
                    mirror = angular.element('<div class="flying-header"><table class="w100"></table></div>')
                    mirror.find('table').append(thead);
                    element.append(mirror);
                } else {
                    mirror.remove();
                    mirror = null;
                }
            }

            var className = 'is-sticky';
            angular.element($window).on('scroll', function(){
                if( $window.scrollY > element[0].offsetTop && !(element.hasClass(className))){
                    element.addClass(className);
                    handleMirrorHead();
                } else if ($window.scrollY == 0){
                    element.removeClass(className);
                    handleMirrorHead(true);
                }
            });
        }
    }
})