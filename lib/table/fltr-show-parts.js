angular.module('trialsTrackmap')
.filter('showParts', function(){
    return function(array, selectedPart, selectedLevel){
        if(array && selectedPart || array && selectedLevel){
            return array.filter(function(track){
                if('parts' in track) {
                    // show ids out of all levels
                    if(selectedLevel){
                        if(!selectedPart && selectedLevel in track.parts){
                            return true;
                        } else if(selectedLevel in track.parts && track.parts[selectedLevel].indexOf(parseInt(selectedPart)) >= 0){
                            return true;
                        }
                        return false;
                    } else if(selectedPart){
                        var foundPart = false;
                        Object.keys(track.parts).forEach(function(level){
                            if(level in track.parts && typeof track.parts[level] == 'object' && track.parts[level].indexOf(parseInt(selectedPart)) >= 0)
                                foundPart = true;
                        });
                        return foundPart;
                    }
                }
                return false;
            });
        }
        return array;
    }
})