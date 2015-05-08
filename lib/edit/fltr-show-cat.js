angular.module('trialsTrackmap')
.filter('showCat', function(){
    return function(array, selectedCat){
        if(array && selectedCat){
            return array.filter(function(track){
                var cats = track.cats.split(',');
                if(cats.indexOf(selectedCat) >= 0)
                    return true;
                return false;
            });
        }
        return array;
    }
})