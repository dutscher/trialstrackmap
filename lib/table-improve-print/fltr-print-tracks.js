angular.module("trialsTrackmap")
    .filter("printTracks", function (categories) {
        return function (array, tierNr, catName, _with_, _without_) {
            if (array && tierNr) {
                var cats,
                    trackCats,
                    isCheckWithAndWithout = false;
                // find cat
                if(catName && catName.indexOf(",") >= 0) {
                    var catNames = catName.split(",");
                    cats = [];
                    catNames.forEach(function(catName){
                        cats.push(categories.findByName(catName));
                    });
                } else if(catName) {
                    cats = [categories.findByName(catName)];
                }
                // special tracks
                if(_with_ || _without_) {
                    isCheckWithAndWithout = true;
                }

                function isInTrackCats(trackCats){
                    var isIn = cats.filter(function(cat){
                        return trackCats.indexOf(cat ? cat.index : cats.index) >= 0;
                    });
                    return isIn.length > 0;
                }

                function checkWithAndWithout(track){
                    if(_with_ && (_with_ in track) && track[_with_]) {
                        return true;
                    } else if(_without_ && !(_without_ in track)){
                        return true;
                    }
                    return false;
                }

                // filter out
                array = array.filter(function(track){
                    trackCats = track.cats.split(",").map(Number);
                    return (isCheckWithAndWithout ? checkWithAndWithout(track) : true)
                        && (tierNr !== "all" ? track.tier === tierNr : true)
                        && (cats && trackCats ? isInTrackCats(trackCats) : true);
                });
            }
            return array;
        }
    })