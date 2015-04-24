angular.module('trialsTrackmap')
.filter('catTracks', function(){
    return function(array, cat) {
        if (!array)
            return [];
        return array.filter(function (item) {
            var catIds = item.cats.split(',');
            return catIds.indexOf(''+cat) >= 0;
        })
    }
})