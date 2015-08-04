angular.module('trialsTrackmap')
.filter('listPlayable', function($sce, $filter){
    return function(tracks) {

        if(!tracks)
            return tracks;

        var html = '',
            types = {
                leaked: 'leaked',
                bunker: 'only_bunker',
                youtube: 'youtube'
            };

        // all playable with map location
        html += tracks.filter(function(track){return !(types.leaked in track) && !(types.bunker in track)}).length + ' ' + $filter('translate')('page.rightSidebar.on_map') + '<br />';
        // only bunker
        html += tracks.filter(function(track){return (types.bunker in track) && track[types.bunker]}).length + ' ' + $filter('translate')('page.rightSidebar.only_bunker') + '<br />';
        // leaked
        html += tracks.filter(function(track){return (types.leaked in track) && track[types.leaked]}).length + ' ' + $filter('translate')('page.rightSidebar.leaked') + '<br />';
        // with video
        html += tracks.filter(function(track){return (types.youtube in track)}).length + ' ' + $filter('translate')('page.rightSidebar.with_video') + '<br />';

        return $sce.trustAsHtml(html);
    }
})