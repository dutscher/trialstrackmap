angular.module("trialsTrackmap")
    .directive("garageBigImage", function ($document) {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                var wrap = $document[0].querySelector(".garage-big-image"),
                    image = wrap.querySelector("div"),
                    name = wrap.querySelector("span"),
                    isNew = attr.title.indexOf("*") !== -1,
                    newClass = "is-new";

                element.on("click", function () {
                    angular.element(wrap).addClass("is-open");
                    if (isNew) {
                        angular.element(wrap).addClass(newClass);
                    } else {
                        angular.element(wrap).removeClass(newClass);
                    }
                    angular.element(image).css("background-image", "url(" + attr.garageBigImage + ")");
                    angular.element(name).html(attr.title.replace("*", ""));
                });
            }
        }
    })