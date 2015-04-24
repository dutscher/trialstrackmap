angular.module('trialsTrackmap')
.directive('pageTitle', function($rootScope, $filter){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var title = 'loading',
                preTitle;

            function handleTitle(){
                element.html((preTitle ? preTitle+' - ' : '')+title);
            }

            $rootScope.$on('$translateChangeSuccess', function(){
                title = $filter('translate')('page.title');
                handleTitle();
            });

            $rootScope.$on('pageTitle:change', function(event, _preTitle_){
                preTitle = _preTitle_;
                handleTitle();
            });

            handleTitle();
        }
    };
})