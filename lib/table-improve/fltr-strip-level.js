angular.module("trialsTrackmap")
.filter("stripLevel", function(){
    return function(string){
        if(string){
            string = string.replace(/ \(LVL \d.?\)/g, "");
        }
        return string;
    }
})