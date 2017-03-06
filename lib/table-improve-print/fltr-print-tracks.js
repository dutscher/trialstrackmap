angular.module("trialsTrackmap")
    .filter("printTracks", function (categories) {

        function isInTrackCats(trackCats, cats){
            var isIn = cats.filter(function(cat){
                return trackCats.indexOf(cat ? cat.index : cats.index) >= 0;
            });
            return isIn.length > 0;
        }

        function checkWithAndWithout(track, _with_, _without_){
            if(_with_ && (_with_ in track) && track[_with_]) {
                return true;
            } else if(_without_ && !(_without_ in track)){
                return true;
            }
            return false;
        }

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

                // filter out
                array = array.filter(function(track){
                    return (isCheckWithAndWithout ? checkWithAndWithout(track, _with_, _without_) : true)
                        && (tierNr !== "all" ? track.tier === tierNr : true)
                        && (cats && track.categories ? isInTrackCats(track.categories, cats) : true);
                });
            }
            return array;
        }
    })