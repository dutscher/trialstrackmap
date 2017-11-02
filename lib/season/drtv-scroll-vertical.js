angular.module("trialsTrackmap")
    .directive("scrollVertical", function ($document) {
        return {
            restrict: "A",
            link: function () {
                var nextPx = 150,
                    scroller = $document[0].querySelectorAll("html, body"),
                    mouseWheelEvt = function (event) {
                        if (this.doScroll) {
                            this.doScroll(event.wheelDelta > 0 ? "left" : "right");
                        } else if ((event.wheelDelta || event.detail) > 0) {
                            this.scrollLeft -= nextPx;
                        } else {
                            this.scrollLeft += nextPx;
                        }

                        event.preventDefault();

                        return false;
                    };

                scroller.forEach(function (element) {
                    angular.element(element)[0].addEventListener("mousewheel", mouseWheelEvt);
                });
            }
        };
    });