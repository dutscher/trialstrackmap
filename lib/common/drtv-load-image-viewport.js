angular.module("trialsTrackmap")
    .directive("loadImageViewport", function () {
        var config = {
            // If the image gets within 50px in the Y axis, start the download.
            rootMargin: "50px 0px",
            threshold: 0.01
        };
        return {
            restrict: "A",
            link: function (scope, image, attr) {
                function loadImage () {
                    image.attr("src", attr["loadImageViewport"]);
                }

                function onIntersection (entries) {
                    // Loop through the entries
                    entries.forEach(function (entry) {
                        // Are we in viewport?
                        if (entry.intersectionRatio > 0) {
                            // Stop watching and load the image
                            observer.unobserve(entry.target);
                            loadImage();
                        }
                    });
                }

                if (!("IntersectionObserver" in window)) {
                    loadImage();
                } else {
                    var observer = new IntersectionObserver(onIntersection, config);
                    observer.observe(image[0]);
                }
            }
        };
    })
;