angular.module('trialsTrackmap')
.directive('editFaults', function(editTimes){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.on('click',function(){
                var id = scope.track.timesDB.id,
                    medal = attrs.editFaults,
                    times = scope.track.timesDB.times;

                function update(value){
                    times[medal].faults = value;
                    editTimes.update(scope.track.timesDB);
                    scope.$apply();
                }

                var value = prompt('new faults for '+medal+' on '+scope.track.i18n,times[medal].faults);
                if(value != null && value != ''){
                    update(value);
                }
            });
        }
    }
})