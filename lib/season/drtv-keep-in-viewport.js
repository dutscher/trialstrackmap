angular.module("trialsTrackmap")
    .directive("keepInViewport", function ($document) {
        return {
            restrict: "A",
            link: function (scope, element) {
                $document[0].addEventListener("sticky-change", function (e) {
                    var header = e.detail.target;  // header became sticky or stopped sticking.
                    var sticking = e.detail.stuck; // true when header is sticky.
                    //header.classList.toggle('shadow', sticking); // add drop shadow when sticking.
                });
            }
        };
    });