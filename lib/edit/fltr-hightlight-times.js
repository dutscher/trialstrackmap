angular.module('trialsTrackmap')
.filter('hightlightTime', function($sce, zeroTime){
    return function(string){
        var html = $sce.trustAsHtml(string);
        if(string != zeroTime){
            html = $sce.trustAsHtml('<span class="highlight">'+string+'</span>');
        }
        return html;
    }
})