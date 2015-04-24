angular.module('trialsTrackmap')
.service('editTimes', function($basePath, $http){
    var updates = [];

    return {
        unsavedChanges: function(){
            return updates.length;
        },
        update: function(track){
            var found = updates.filter(function(update){
                return update.id == track.id
            });
            if(found.length == 0){
                delete track.public;
                updates.push(track);
            } else {
                found[0] = track;
            }
        },
        saveChanges: function(){
            if(updates.length == 0){
                return false;
            }

            $http.post($basePath+'edit.php',{token:'',times:updates})
                .then(function(r){
                    if(r.data.OK == 'update solved'){
                        updates = [];
                    }
                });
        }
    }
})