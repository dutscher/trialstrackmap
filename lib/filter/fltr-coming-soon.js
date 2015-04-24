angular.module('trialsTrackmap')
.filter('comingSoon', function($sce){
    return function(str){
        return $sce.trustAsHtml(str.replace('(coming soon on map)','<strong>(coming soon on map)</strong>'))
    }
})