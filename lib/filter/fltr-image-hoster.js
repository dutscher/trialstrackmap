angular.module('trialsTrackmap')
.filter('imageHoster', function(){
    return function(str, imageHoster){
        if(!imageHoster || !str || str.indexOf('http') >= 0)
            return str;

        Object.keys(imageHoster).forEach(function(_index_){
            str = str.replace(_index_,imageHoster[_index_]);
        })

        return str;
    };
})