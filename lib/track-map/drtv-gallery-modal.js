angular.module("trialsTrackmap")
    .directive("galleryModal",
        function ($rootScope, $window, $timeout, $filter, items, urlHandler, trackData, categories) {
            return {
                restrict: "C",
                template: "\
                    <div class=\"backdrop\"></div>\
                        <div class=\"body\" ng-click=\"close($event)\">\
                        <div class=\"gallery gradient-border\" ng-class=\"{'ready':galleryReady}\">\
                            <h2>{%track.i18n%}</h2>\
                            <span class=\"caption\">\
                                <h3>{%title%}</h3>\
                            </span>\
                            <div ng-hide=\"imageReady\" class=\"loader spin\"></div>\
                            <div class=\"wrap\">\
                                <img ng-hide=\"showVideo\" ng-load=\"imageReady = true\" ng-class=\"{'loading':!imageReady,'loaded':imageReady}\" width=\"100%\" height=\"100%\" />\
                                <iframe ng-show=\"showVideo\" src=\"about:blank\" frameborder=\"0\" allowfullscreen width=\"100%\" height=\"100%\"></iframe>\
                            </div>\
                            <div class=\"track-data\" ng-class=\"{'video-is-visible':showVideo}\">\
                                <div class=\"track-data__wrap\">\
                                    <div class=\"track-data__middle\">\
                                        <div class=\"track-data__block\">\
                                            <table>\
                                                <thead>\
                                                    <tr title=\"{%'page.trackDetail.media'|translate%}\">\
                                                        <td colspan=\"2\" class=\"media-chooser\">" + items.getModalItemsList() + "</td>\
                                                    </tr>\
                                                </thead>\
                                                <tbody class=\"track-data--parts track-data--hide-for-video\">\
                                                    <tr title=\"{%'page.trackDetail.categories'|translate%}\">\
                                                        <td colspan=\"2\" class=\"normal-font\">\
                                                            <span ng-repeat=\"categoryId in track.categories\"\
                                                                  ng-click=\"showCat(categoryId)\"\
                                                                  class=\"{%categoryData(categoryId).class%}\">\
                                                                {%'cats.' + categoryId|translate|translateCat%}<br />\
                                                            </span>\
                                                        </td>\
                                                    </tr>\
                                                    <tr ng-if=\"track.chips\">\
                                                        <td><span class=\"icon-wrap\">{%'page.trackDetail.chipsAmount'|translate%} <i class=\"chips\"></i></span></td>\
                                                        <td><span>{%track.chips%}</span></td>\
                                                    </tr>\
                                                    <tr ng-if=\"track.seasonReward\">\
                                                        <td>{%'page.trackDetail.seasonReward'|translate%}</td>\
                                                        <td><span>{%track.seasonReward%}</span></td>\
                                                    </tr>\
                                                    <tr ng-if=\"track.level\">\
                                                        <td>{%'page.trackDetail.level'|translate%}</td>\
                                                        <td><span>{%track.level%}</span></td>\
                                                    </tr>\
                                                    <tr ng-if=\"track.pack\">\
                                                        <td>{%'page.trackDetail.pack'|translate%}</td>\
                                                        <td><span>{%track.pack%}</span></td>\
                                                    </tr>\
                                                    <tr>\
                                                        <td>{%'page.trackDetail.tier'|translate%}</td>\
                                                        <td><span>{%track.tier%}</span></td>\
                                                    </tr>\
                                                    <tr>\
                                                        <td><span class=\"icon-wrap\">{%'page.trackDetail.fuel'|translate%} <i class=\"fuel\"></i></span></td>\
                                                        <td><span>{%track.fuel%}</span></td>\
                                                    </tr>\
                                                    <tr title=\"{%'page.trackDetail.medalsLabel'|translate%}\">\
                                                        <td colspan=\"2\">\
                                                            <span track-medals=\"track\"></span>\
                                                        </td>\
                                                    </tr>\
                                                    <tr title=\"{%'page.trackDetail.parts'|translate%}\">\
                                                        <td colspan=\"2\"><div part-list=\"track\" part-scale=\"3\" index=\"0\"></div></td>\
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>",
                scope: true,
                controller: function ($scope, $element) {
                    var hoster = {},
                        maxWidth = 960;

                    function domReset () {
                        //$element.find("img").attr("src", "");
                        $element.find("iframe").attr("src", "");
                    }

                    function reset () {
                        $scope.showVideo = false;
                        $scope.track = {};
                        $scope.title = "";
                        $scope.image = "";
                        $scope.type = "";
                        $scope.galleryReady = false;
                        $scope.imageReady = false;
                        domReset();
                        $element.removeClass("open");

                        $rootScope.$emit("pageTitle:change");
                    }

                    function calcDim (dim) {
                        if (dim.w > maxWidth) {
                            dim.h = Math.round(maxWidth / (dim.w / dim.h));
                            dim.w = maxWidth;
                        }

                        var windowDim = {w: $window.innerWidth, h: $window.innerHeight},
                            newDim = {w: 320, h: 180},
                            defaultDim = {
                                w: dim.w,
                                h: dim.h,
                                ratio: dim.w / dim.h,
                                percent: {
                                    w: Math.floor((dim.w * 100) / windowDim.w),
                                    h: Math.floor((dim.h * 100) / windowDim.h)
                                }
                            };

                        if (defaultDim.percent.w >= 75 || defaultDim.percent.h >= 75) {
                            newDim.w = defaultDim.w - (defaultDim.w * 0.25);
                            newDim.h = defaultDim.h - (defaultDim.h * 0.25);

                            if (newDim.w >= windowDim.w) {
                                newDim.w = windowDim.w - 50;
                                newDim.h = newDim.w / defaultDim.ratio;
                            } else if (newDim.h >= windowDim.h) {
                                newDim.h = windowDim.h - 100;
                                newDim.w = newDim.h * defaultDim.ratio;
                            }

                        } else {
                            newDim.w = defaultDim.w;
                            newDim.h = defaultDim.h;
                        }

                        return newDim;
                    }

                    function setSize () {
                        var newDim = {};

                        if (!$scope.src) {
                            return false;
                        }

                        if (!$scope.showVideo) {
                            $element
                                .find("img")
                                .attr("src", "");

                            var image = new Image();
                            image.src = $scope.src;
                            image.onload = function () {

                                newDim = calcDim({w: image.width, h: image.height});

                                angular.element($element[0].querySelector(".wrap"))
                                    .css("width", newDim.w + "px")
                                    .css("height", newDim.h + "px");

                                $timeout(function () {
                                    $element
                                        .find("img")
                                        .attr("src", $scope.src);
                                }, 250);
                            };
                        } else {
                            $scope.imageReady = true;
                            newDim = calcDim({w: 1280, h: 720});

                            $element
                                .find("iframe")
                                .attr("src", "about:blank");

                            $timeout(function () {
                                angular.element($element[0].querySelector(".wrap"))
                                    .css("width", newDim.w + "px")
                                    .css("height", newDim.h + "px");

                                $element
                                    .find("iframe")
                                    .attr("src", $scope.src);
                            }, 250);
                        }
                    }

                    reset();

                    angular.element($window).on("resize", function () {
                        setSize();
                    });

                    $scope.close = function ($event) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        reset();
                        urlHandler.set({track: ""});
                        document.querySelector("body").classList.remove("track-is-open");
                    };

                    $rootScope.$on("showModal", function (event, track, type, title, withoutApply) {
                        if (!track)// || track == $scope.track && type == $scope.type
                            return false;

                        document.querySelector("body").classList.add("track-is-open");

                        domReset();

                        $scope.track = track;
                        $scope.title = title;
                        $scope.type = type;
                        $scope.imageReady = false;
                        $scope.showVideo = false;

                        $rootScope.$emit("pageTitle:change", track.i18n);

                        var src = items.getSrcForModal(type, $scope);

                        $scope.src = $filter("hoster")(src, hoster);

                        setSize();

                        if (!withoutApply) {
                            $scope.$apply();
                        }
                        urlHandler.set({track: track.uri, filterCat: "", world: ""});
                        $element.addClass("open");
                    });

                    $rootScope.$on("tracks:ready", function (event, data) {
                        hoster = data.hoster;
                    });

                    $scope.$watch("imageReady", function (imageReady) {
                        if (imageReady) {
                            $scope.galleryReady = true;
                        }
                    });

                    $scope.categoryData = categories.findById;

                    $scope.showCat = function (catId) {
                        $rootScope.$emit("filter:tracks", catId);
                    };

                    // init
                    urlHandler.setParams(["track"]);

                    function openModalViaUrl (track) {
                        $rootScope.$emit("showModal", track, "startline", null, true);
                    }

                    $rootScope.$on("data:loaded", function () {
                        var track = urlHandler.get("track"),
                            data = track ? track.split("-") : [],
                            trackId = data[data.length - 1];

                        if (trackId && trackId !== "0") {
                            $rootScope.$on("world:ready", function () {
                                track = trackData.getTrackByID(parseInt(trackId));
                                if (trackData.getWorld() !== track.world) {
                                    var removeListener = $rootScope.$on("world:changed", function () {
                                        openModalViaUrl(track);
                                        removeListener();
                                    });
                                    $scope.changeWorld(track.world);
                                } else {
                                    openModalViaUrl(track);
                                }
                            });
                        }
                    });
                }
            };
        });