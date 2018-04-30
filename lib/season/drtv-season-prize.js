angular.module("trialsTrackmap")
    .directive("seasonPrize", function (seasonUtil) {
        return {
            restrict: "C",
            scope: {
                extra: "@extra",
                extraType: "@extraType",
                spritePointer: "@spritePointer",
                index: "@index"
            },
            template: '\
                <span ng-if="extraType!==\'costum\'">\
                    <i ng-if="extra && !spritePointer || extraType && !spritePointer" class="season-extra-{%::level.css_selector%} {%::level.css_selector%} {%::level.sprite%}" title="{%::index%}. {%::level.title%}"></i>\
                    <i ng-if="extra && spritePointer || extraType && spritePointer" class="{%::level.css_selector%} {%::level.sprite%}" title="{%::index%}. {%::level.title%}"></i>\
                </span>\
                <span ng-if="extraType===\'costum\'" class="costum__part--season-prize {%::level.costumSelector%}" title="{%::index%}. {%::level.title%}">\
                    <span class="{%::level.costumPart%}"></span>\
                </span>\
            ',
            link: function (scope) {
                seasonUtil.isReady().then(function () {
                    scope.level = seasonUtil.extendLevel(scope.extraType, scope.extra, scope.spritePointer);
                });
            }
        }
    })