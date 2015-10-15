angular.module("trialsTrackmap")
    .filter("listPlayable", function($sce, $filter){
        return function(tracks) {

            if(!tracks)
                return tracks;

            var html = "",
                types = {
                    leaked: "leaked",
                    bunker: "only_bunker",
                    youtube: "youtube",
                    coords: "coords",
                    event: "only_event"
                },
                counts = {
                    all: 0,
                    coords: 0,
                    bunker: {
                        nums: 0,
                        names: []
                    },
                    leaked: {
                        nums: 0,
                        names: []
                    },
                    event: {
                        nums: 0,
                        names: []
                    },
                    not_released: 0,
                    youtube: 0
                };

            tracks.forEach(function(track){
                var isBunkerOnly = (types.bunker in track) && track[types.bunker],
                    isEventOnly = (types.event in track),
                    isLeaked = (types.leaked in track) && track[types.leaked],
                    withoutCoordinates = !(types.coords in track) || ((types.coords in track) && track.coords == "");
                // all playable with map location
                if(
                    !isLeaked && !isBunkerOnly && !isEventOnly && !withoutCoordinates
                ){
                    counts.all++;
                }
                // without coords
                if(
                    withoutCoordinates
                ){
                    counts.coords++;
                }
                // not released
                if(
                    withoutCoordinates && !isBunkerOnly && !isLeaked && !isEventOnly
                ){
                    counts.not_released++;
                }
                // bunker
                if(
                    isBunkerOnly
                ){
                    counts.bunker.nums++;
                    counts.bunker.names.push(counts.bunker.nums + ". " + $filter("translate")("tracks."+track.id));
                }
                // only event
                if(
                    isEventOnly
                ){
                    counts.event.nums++;
                    counts.event.names.push(counts.event.nums + ". " + $filter("translate")("tracks."+track.id));
                }
                // leaked
                if(
                    isLeaked
                ){
                    counts.leaked.nums++;
                    counts.leaked.names.push(counts.leaked.nums + ". " + $filter("translate")("tracks."+track.id));
                }
                // youtube
                if(
                    (types.youtube in track)
                ){
                    counts.youtube++;
                }
            });

            // all playable with map location
            html += counts.all + " " + $filter("translate")("page.rightSidebar.on_map") + "<br />";
            // without coords
            html += counts.coords + " " + $filter("translate")("page.rightSidebar.without_coords") + "<br />";
            html += "<span class=\"without-coords\">";
            // waiting for
            if(counts.not_released > 0) {
                // not released
                html += counts.not_released + " " + $filter("translate")("page.rightSidebar.not_released") + "<br />";
            }
            // only bunker
            html += counts.bunker.nums + " " + $filter("translate")("page.rightSidebar.only_bunker") + "<br />";
            html += "<span class=\"stats-track-names\">";
            html += counts.bunker.names.join("<br />");
            html += "</span>";
            // only event
            html += counts.event.nums + " " + $filter("translate")("page.rightSidebar.only_event") + "<br />";
            html += "<span class=\"stats-track-names\">";
            html += counts.event.names.join("<br />");
            html += "</span>";
            // leaked
            html += counts.leaked.nums + " " + $filter("translate")("page.rightSidebar.leaked") + "<br />";
            html += "<span class=\"stats-track-names\">";
            html += counts.leaked.names.join("<br />");
            html += "</span>";
            html += "</span>---<br />";
            // with video
            html += counts.youtube+ " " + $filter("translate")("page.rightSidebar.with_video") + "<br />";


            return $sce.trustAsHtml(html);
        }
    })