angular.module("trialsTrackmap")
.filter("hoster", function(){
    return function(path, hoster){
        if(!hoster || !path || path.indexOf("http") >= 0)
            return path;

        Object.keys(hoster).forEach(function(_index_){
            path = path.replace(_index_,hoster[_index_]);
        });

        return path;
    };
})