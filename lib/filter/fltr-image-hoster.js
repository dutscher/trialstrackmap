angular.module("trialsTrackmap")
.filter("hoster", function(){
    return function(str, hoster){
        if(!hoster || !str || str.indexOf("http") >= 0)
            return str;

        Object.keys(hoster).forEach(function(_index_){
            str = str.replace(_index_,hoster[_index_]);
        })

        return str;
    };
})