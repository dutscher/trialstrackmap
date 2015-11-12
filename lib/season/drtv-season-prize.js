angular.module("trialsTrackmap")
.directive("seasonPrize", function(seasonUtil){
    return {
        restrict: "C",
        scope: {
            extra: "@extra",
            extraType: "@extraType"
        },
        template: '\
            <i ng-if="extra || extraType" class="season-extra-{%::level.css_selector%} {%::level.sprite%}" title="{%::level.title%}"></i>\
        ',
        link: function(scope){

            seasonUtil.isReady().then(function(){
                scope.level = seasonUtil.extendLevel(scope.extra, scope.extraType);
            });
        }
    }
})