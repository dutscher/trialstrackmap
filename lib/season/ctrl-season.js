angular.module("trialsTrackmap")
    .controller("seasons", function ($rootScope, $scope, loader, $document, seasonUtil) {
        $scope.data = {};

        var mouseWheelEvt = function (event) {
            if ($document[0].body.doScroll) {
                $document[0].body.doScroll(event.wheelDelta > 0 ? "left" : "right");
            } else if ((event.wheelDelta || event.detail) > 0) {
                $document[0].body.scrollLeft -= 50;
            } else {
                $document[0].body.scrollLeft += 50;
            }

            return false;
        };

        $document[0].body.addEventListener("mousewheel", mouseWheelEvt);

        loader.get(["gfx", "seasons"]).then(function (data) {
            $scope.data.images = data.images;
            $scope.data.hoster = data.hoster;

            seasonUtil.setData({seasons: data._seasons, prizes: data._prizes});

            $rootScope.$emit("data:loaded", $scope.data);
        });
    })