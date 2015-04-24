angular.module('trialsTrackmap')
.directive('trackMedals', function(){
    return {
        restrict:   'A',
        template:   '<span ng-if="!isEmpty(track.times.s)" title="{{\'page.trackDetail.medals.silver\'|translate}}">' +
        '<i class="medal-silver"></i>' +
        '<i class="timer"></i>{{track.times.s.t}}' +
        '<i class="faults"></i>{{track.times.s.f}}</span>' +
        '<span ng-if="!isEmpty(track.times.g)" title="{{\'page.trackDetail.medals.gold\'|translate}}">' +
        '<i class="medal-gold"></i>' +
        '<i class="timer"></i>{{track.times.g.t}}' +
        '<i class="faults"></i>{{track.times.g.f}}</span>' +
        '</span>' +
        '<span ng-if="!isEmpty(track.times.p)" title="{{\'page.trackDetail.medals.platinum\'|translate}}">' +
        '<i class="medal-platinum"></i>' +
        '<i class="timer"></i>{{track.times.p.t}}' +
        '<i class="faults"></i>{{track.times.p.f}}</span>' +
        '</span>',
        scope: {
            track: '=trackMedals'
        },
        controller: function($scope){
            $scope.isEmpty = function(medal){
                if(!medal || medal && medal.time == '0:00.000')
                    return true;

                return false;
            }
        }
    }
})