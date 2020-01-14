angular.module("trialsTrackmap")
    .directive("garageBigImage", function ($document) {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                var wrap = $document[0].querySelector(".garage-big-image"),
                    icon = wrap.querySelector("i"),
                    image = wrap.querySelector(".garage-big-image__image"),
                    name = wrap.querySelector(".garage-big-image__name"),
                    isNew = attr.title.indexOf("*") !== -1,
                    isLeaked = attr.title.indexOf("?") !== -1,
                    isComingSoon = attr.title.indexOf(">") !== -1,
                    newClass = "is-new",
                    leakedClass = "is-leaked",
                    soonClass = "coming-soon";

                element.on("click", function () {
                    angular.element(wrap).addClass("is-open");
                    angular.element(wrap).removeClass(newClass);
                    angular.element(wrap).removeClass(leakedClass);
                    angular.element(wrap).removeClass(soonClass);
                    if (isNew) {
                        angular.element(wrap).addClass(newClass);
                    } else if (isComingSoon) {
                        angular.element(wrap).addClass(soonClass);
                    } else if (isLeaked) {
                        angular.element(wrap).addClass(leakedClass);
                    }
                    angular.element(image).css("background-image", "url(" + attr.garageBigImage + ")");
                    angular.element(name).text(attr.title.replace(/[*?>]/, ""));
                    angular.element(icon).removeAttr('class').addClass(attr.icon);
                });
            }
        }
    })
