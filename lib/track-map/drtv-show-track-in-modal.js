angular.module("trialsTrackmap")
    .directive("showTrackInModal", function ($rootScope, $filter, items, categories) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var type = attrs.showTrackInModal,
                    title = "",
                    typeName;

                function setTitle(title, typeName) {
                    if (typeName) {
                        title = $filter("translate")("page.trackDetail." + typeName);
                    }
                    element.attr("title", title);
                }

                function setTypeForModal(catId) {
                    type = items.getOpenForModalType(scope.track, catId);
                }

                function init() {
                    if (!("startline" in scope.track) || !scope.track) {
                        return false;
                    }

                    var data = items.getTitleForModal(type, scope);
                    typeName = data.typeName;
                    title = data.title;

                    element.bind("click", function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        var data = items.getTitleForModal(type, scope);
                        typeName = data.typeName;
                        title = data.title;

                        $rootScope.$broadcast("showModal", scope.track, type, title);
                    });

                    setTitle(title, typeName);
                    if (type === "look-on-filter") {
                        setTypeForModal(categories.getFilterCatId());
                    }

                    $rootScope.$on("$translateChangeSuccess", function () {
                        setTitle(title, typeName);
                    });
                }

                scope.$watch("track", function () {
                    init();
                });

                if (type === "look-on-filter") {
                    $rootScope.$on("filter:tracks", function (event, catId) {
                        setTitle(title, typeName);
                        setTypeForModal(catId);
                    });
                }
            }
        }
    })
