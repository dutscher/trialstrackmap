angular.module("trialsTrackmap")
    .directive("seasonPrize", function (seasonUtil) {
        return {
            restrict: "C",
            // https://blog.krawaller.se/posts/dissecting-bindings-in-angularjs/
            scope: {
                extra: "@extra",
                extraType: "@extraType",
                spritePointer: "@spritePointer",
                index: "@index",
                showTrackname: "@showTrackname"
            },
            template: '\
                <span ng-if="extraType !== \'costum\'">\
                    <span ng-if="showTrackname && extraType === \'track\'" >\
                        {%::level.title%}\
                    </span>\
                    <i \
                        ng-if="extra && !spritePointer || extraType && !spritePointer" \
                        class="season-extra-{%::level.css_selector%} {%::level.css_selector%} {%::level.sprite%}" \
                        title="{%::index%}. {%::level.title%}"></i>\
                    <i \
                        ng-if="extra && spritePointer || extraType && spritePointer" \
                        class="{%::level.css_selector%} {%::level.sprite%}" \
                        title="{%::index%}. {%::level.title%}"></i>\
                </span>\
                <span \
                    ng-if="extraType === \'costum\'" \
                    class="costum__part--season-prize {%::level.costumSelector%}" \
                    title="{%::index%}. {%::level.title%}">\
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