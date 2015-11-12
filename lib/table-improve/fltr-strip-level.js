angular.module("trialsTrackmap")
.filter("stripLevel", function(){
    return function(string){
        if(string){
            string = string.replace(/ \(level \d.?\)/g, "");
        }
        return string;
    }
})