angular.module("trialsTrackmap")
    .directive("showTrackInModal", function ($rootScope, $filter, items) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

                function setTitle(title, typeName) {
                    if (typeName) {
                        title = $filter("translate")("page.trackDetail." + typeName);
                    }
                    element.attr("title", title);
                }

                function init() {
                    if (!("startline" in scope.track) || !scope.track) {
                        return false;
                    }

                    var type = attrs.showTrackInModal,
                        title = "",
                        typeName,
                        data = items.getTitleForModal(type, scope);

                    typeName = data.typeName;
                    type = data.type;

                    element.bind("click", function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $rootScope.$broadcast("showModal", scope.track, type, title);
                    });

                    setTitle(title, typeName);

                    $rootScope.$on("$translateChangeSuccess", function () {
                        setTitle(title, typeName);
                    });
                }

                scope.$watch("track", function () {
                    init();
                });
            }
        }
    })