angular.module("trialsTrackmap")
.directive("trackMedals", function($zeroTime){
    return {
        restrict:   "A",
        template:   '\
            <span ng-if="!isEmpty(track.times.silver)" title="{%\'page.trackDetail.medals.silver\'|translate%}"> \
                <i class="medal-silver"></i> \
                <i class="timer"></i>{%track.times.silver.time|convertTime%} \
                <i class="faults"></i>{%track.times.silver.faults%}</span> \
            <span ng-if="!isEmpty(track.times.gold)" title="{%\'page.trackDetail.medals.gold\'|translate%}"> \
                <i class="medal-gold"></i> \
                <i class="timer"></i>{%track.times.gold.time|convertTime%} \
                <i class="faults"></i>{%track.times.gold.faults%}</span> \
            </span> \
            <span ng-if="!isEmpty(track.times.platinum)" title="{%\'page.trackDetail.medals.platinum\'|translate%}"> \
                <i class="medal-platinum"></i> \
                <i class="timer"></i>{%track.times.platinum.time|convertTime%} \
                <i class="faults"></i>{%track.times.platinum.faults%}</span> \
            </span> \
        ',
        scope: {
            track: "=trackMedals"
        },
        controller: function($scope){
            $scope.isEmpty = function(medal){
                if(!medal || medal && medal.time == $zeroTime)
                    return true;

                return false;
            }
        }
    }
})