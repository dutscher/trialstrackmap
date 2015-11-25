angular.module("trialsTrackmap")
    .directive("showTrackInModal", function ($rootScope, $filter) {
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
                    if (!("startline" in scope.track)) {
                        return false;
                    }

                    var type = attrs.showTrackInModal,
                        typeName,
                        index = type.split(":")[1],
                        title = "";

                    switch (true) {
                        case "startline" == type:
                            typeName = "startline";
                            break;
                        case type.indexOf("datacube") >= 0:
                            typeName = "datacubeGuide";
                            break;
                        case type.indexOf("candy") >= 0:
                            title = scope.track.candies[index].title;
                            break;
                        case type.indexOf("youtube") >= 0:
                            var videoType = scope.track.youtube[index].type;
                            title = $filter("translate")("page.trackDetail.walkthrough" + videoType)
                                    + " "
                                    + $filter("translate")("page.trackDetail.walkthroughBy")
                                    + " "
                                    + scope.track.youtube[index].host;
                            break;
                    }

                    var dblClick = attrs.withDoubleClick || false;

                    element.bind(dblClick ? "dblclick" : "click", function ($event) {
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