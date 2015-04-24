angular.module('trialsTrackmap')
.directive('tierwrap', function(){
    return {
        restrict: 'C',
        link: function(scope, element){
            element.bind('click',function(e){
                e.preventDefault();
                e.stopPropagation();
            });
        }
    };
})