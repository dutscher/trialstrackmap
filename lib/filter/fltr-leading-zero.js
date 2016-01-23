angular.module('trialsTrackmap')
.filter('leadingZero', function(){
    return function(num, size) {
        var s = num+"",
            size = size || 2;
        while (s.length < size) s = "0" + s;
        return s;
    }
})