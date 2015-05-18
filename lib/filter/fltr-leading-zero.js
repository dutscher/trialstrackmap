angular.module('trialsTrackmap')
.filter('leadingZero', function(){
    return function(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
})