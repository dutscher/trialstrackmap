angular.module('trialsTrackmap')
.directive('catsAsClass', function($rootScope, $parse, $filter){
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs){
            var params = $parse(attrs.catsAsClass)(scope);
            var cats = params.track.cats.split(',');

            function update(onlyI18n){
                cats.forEach(function(catId){
                    params.cats.forEach(function(cat){
                        if(cat.index == catId && !('notInTimes' in cat)) {
                            if(!onlyI18n)
                                element.addClass(cat.class + '-bg');
                            element.attr('title',$filter('translate')('cats.'+cat.index));
                        }
                    });
                });
            }

            update();

            $rootScope.$on('$translateChangeSuccess',function(){
                update(true);
            })

        }
    }
})