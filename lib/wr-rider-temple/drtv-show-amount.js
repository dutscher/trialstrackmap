angular.module("trialsTrackmap")
    .directive("showAmount", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var className = "hide-zero",
                    attrValue = attrs.showAmount;

                if (attrValue === "") {
                    return;
                }

                if (attrValue === "0") {
                    element.addClass(className);
                    element.html("<span>" + attrValue + "</span>");
                } else {
                    element.removeClass(className);
                    element.html(attrValue);
                }
            }
        }
    })