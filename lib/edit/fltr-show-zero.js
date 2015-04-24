angular.module('trialsTrackmap')
.filter('showZero', function(zeroTime){
    return function(array, showOnlyZero, medalOnly){
        if(array && showOnlyZero){
            return array.filter(function(track){
                if('timesDB' in track && 'times' in track.timesDB) {
                    var timesDB = track.timesDB.times
                    if(medalOnly && medalOnly != '' && medalOnly in timesDB){
                        return timesDB[medalOnly].time == zeroTime;
                    } else {
                        return (
                        timesDB.silver.time == zeroTime
                        || timesDB.gold.time == zeroTime
                        || timesDB.platinum.time == zeroTime
                        )
                    }
                }
                return true;
            });
        }
        return array;
    }
})