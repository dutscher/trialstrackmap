angular.module("trialsTrackmap")
.directive("seasonPrize", function(seasonUtil){
    return {
        restrict: "C",
        scope: {
            extra: "@extra",
            extraType: "@extraType",
            spritePointer: "@spritePointer"
        },
        template: '\
            <i ng-if="extra && !spritePointer || extraType && !spritePointer" class="season-extra-{%::level.css_selector%} {%::level.sprite%}" title="{%::level.title%}"></i>\
            <i ng-if="extra && spritePointer || extraType && spritePointer" class="{%::level.css_selector%} {%::level.sprite%}" title="{%::level.title%}"></i>\
        ',
        link: function(scope){
            seasonUtil.isReady().then(function(){
                scope.level = seasonUtil.extendLevel(scope.extraType, scope.extra, scope.spritePointer);
            });
        }
    }
})