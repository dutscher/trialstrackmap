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
                    bunker: 0,
                    leaked: 0,
                    not_released: 0,
                    event: 0,
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
                // leaked
                if(
                    isLeaked
                ){
                    counts.leaked++;
                }
                // bunker
                if(
                    isBunkerOnly
                ){
                    counts.bunker++;
                }
                // not released
                if(
                    withoutCoordinates && !isBunkerOnly && !isLeaked && !isEventOnly
                ){
                    counts.not_released++;
                }
                // only event
                if(
                    isEventOnly
                ){
                    counts.event++;
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
            // only bunker
            html += counts.bunker + " " + $filter("translate")("page.rightSidebar.only_bunker") + "<br />";
            // only event
            html += counts.event + " " + $filter("translate")("page.rightSidebar.only_event") + "<br />";
            if(counts.not_released > 0) {
                // not released
                html += counts.not_released + " " + $filter("translate")("page.rightSidebar.not_released") + "<br />";
            }
            // leaked
            html += counts.leaked + " " + $filter("translate")("page.rightSidebar.leaked") + "<br />";
            html += "</span>---<br />";
            // with video
            html += counts.youtube+ " " + $filter("translate")("page.rightSidebar.with_video") + "<br />";

            return $sce.trustAsHtml(html);
        }
    })