angular.module('trialsTrackmap')
.directive('editTime', function(editTimes){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.on('click',function(){
                var id = scope.track.timesDB.id,
                    medal = attrs.editTime,
                    times = scope.track.timesDB.times;

                function update(value){
                    times[medal].time = value;
                    editTimes.update(scope.track.timesDB);
                    scope.$apply();
                }

                var value = prompt('new time for '+medal+' on '+scope.track.i18n,times[medal].time);
                if(value != null && value != ''){
                    update(value);
                }
            });
        }
    }
})