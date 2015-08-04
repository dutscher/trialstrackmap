angular.module('trialsTrackmap')
.filter('listPlayable', function($sce){
    return function(tracks) {

        if(!tracks)
            return tracks;

        var html = '',
            types = {
                leaked: 'leaked',
                bunker: 'only_bunker'
            };

        // all playable with map location
        html += tracks.filter(function(track){return !(types.leaked in track) && !(types.bunker in track)}).length + ' on map<br />';
        // only bunker
        html += tracks.filter(function(track){return (types.bunker in track) && track[types.bunker]}).length + ' only bunker<br />';
        // leaked
        html += tracks.filter(function(track){return (types.leaked in track) && track[types.leaked]}).length+' leaked<br />';

        return $sce.trustAsHtml(html);
    }
})