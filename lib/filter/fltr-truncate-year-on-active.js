angular.module('trialsTrackmap')
.filter('truncateYearOnActive', function(){
    return function(string, isActive) {
        if(isActive && isActive === true){
            var date = new Date();
            return string.replace('.'+date.getFullYear(),'');
        } else {
            return string;
        }
    }
})