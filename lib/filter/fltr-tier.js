angular.module('trialsTrackmap')
.filter('tier', function(){
    return function(array, level) {
        if (!array)
            return [];
        return array.filter(function (item) {
            return item.tier == level;
        })
    }
})