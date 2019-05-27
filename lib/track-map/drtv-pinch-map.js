angular.module("trialsTrackmap")
    .directive("pinchMap", function (localStorageService, $rootScope, $timeout, canvas, $document) {
        var lsKeyRaw = "mapDataNew",
            lsKey = "",
            // use less steps or more
            detailedScrolling = true,
            settings = {
                maxScale: 1,
                minScale: 0.45,
                newMinScale: -1,
                fitHeight: false,
                fitWidth: false,
                panInBounds: true
            },
            eleMask, eleImg, eleMap, eleHide,
            utils, mask, map,
            timeoutMask = null,
            timeoutFinal = null,
            timeoutUpdate = null;

        var helper = {
            maskCenter: $document[0].querySelector(".pinch-helper--mask-center"),
            scrollPos: $document[0].querySelector(".pinch-helper--scroll-pos"),
        };

        function cancelTimeouts() {
            $timeout.cancel(timeoutMask);
            $timeout.cancel(timeoutFinal);
            $timeout.cancel(timeoutUpdate);
        }

        function initWindow() {
            window.addEventListener("resize", function () {
                $timeout.cancel(timeoutMask);
                timeoutMask = $timeout(function () {
                    mask.dim = {
                        w: eleMask.offsetWidth,
                        h: eleMask.offsetHeight,
                        r: eleMask.offsetWidth / eleMask.offsetHeight
                    };

                    mask.init(eleMask);
                    map.init(eleMap, settings);

                    map.panToCenter();
                }, 50);
            });
        }

        function initHammer(element) {
            var mc = new Hammer.Manager(element);

            mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
            mc.add(new Hammer.Pinch({threshold: 0})).recognizeWith(mc.get("pan"));

            mc.on("panstart panmove", onPan);
            mc.on("pinchstart pinchmove", onPinch);
            mc.on("hammer.input", onFinal);

            // desktop pinching via mousewheel
            function MouseWheelHandler(event) {
                // cross-browser wheel delta
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))),
                    x = event.clientX,
                    y = event.clientY,
                    center = {
                        x: x,
                        y: y
                    };

                angular.element(helper.scrollPos)
                    .css("left", (x + 10) + "px")
                    .css("top", (y + 10) + "px");

                onScroll(delta, center);
            }

            if (element.addEventListener) {
                // IE9, Chrome, Safari, Opera
                element.addEventListener("mousewheel", MouseWheelHandler, false);
                // Firefox
                element.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
            }
        }

        function calcScale(ev) {
            var newScale = map.tmp.initScale * (ev ? ev.scale : 1),
                setScale = 1,
                newMinScale = utils.getMinScale(newScale);

            switch (true) {
                case newScale > settings.maxScale:
                    setScale = settings.maxScale;
                    break;
                case newMinScale === -1 && newScale < settings.minScale || newMinScale !== -1 && newScale < newMinScale:
                    setScale = newMinScale === -1 ? settings.minScale : newMinScale;
                    break;
                default:
                    setScale = newScale;
            }

            map.scale = map.transform.scale = setScale;
        }

        function onScroll(delta, center) {
            cancelTimeouts();

            var fakeEvent = {
                    type: "scrollstart",
                    center: center,
                    scale: 0
                },
                isZoomIn = delta > 0,
                isZoomOut = !isZoomIn;

            if (isZoomIn) {
                // zoom in
                fakeEvent.scale = detailedScrolling ? 1.02 : 1.25;
            } else {
                // zoom out
                fakeEvent.scale = detailedScrolling ? 0.98 : 0.85;
            }

            if (isZoomIn && map.scale === settings.maxScale
                || isZoomOut && map.scale === settings.minScale) {
                return;
            }

            onPinch(fakeEvent);
        }

        function onPinch(ev) {
            cancelTimeouts();

            if (ev.type === "pinchstart") {
                map.tmp.initScale = map.scale || 1;
                map.tmp.panTo = {
                    x: -(map.tmp.lastX - ev.center.x),
                    y: -(map.tmp.lastY - ev.center.y)
                };
            }

            if (ev.type === "scrollstart") {
                map.tmp.initScale = map.scale || 1;
                var diff = utils.getDifferenceOfMaskToMap(),
                    maskCenter = mask.getCenter(),
                    maskCenterToMap = {
                        x: Math.round((diff.x + maskCenter.x) / map.scale),
                        y: Math.round((diff.y + maskCenter.y) / map.scale)
                    };
                map.tmp.panTo = {
                    x: maskCenterToMap.x,
                    y: maskCenterToMap.y
                };
            }

            calcScale(ev);

            map.panTo(map.tmp.panTo.x, map.tmp.panTo.y);

            map.update("onPinch");
        }

        function onPan(ev) {
            cancelTimeouts();

            eleHide.css("display", "none");

            if (ev.type === "panstart") {
                map.tmp.panScale = 1;
                map.tmp.panBounds = utils.calcBounds(map.tmp.panScale);
                angular.element(eleMask).addClass("on-pan");
            }

            var possibleX = map.tmp.lastX + ev.deltaX,
                possibleY = map.tmp.lastY + ev.deltaY,
                coords = settings.panInBounds
                    ? utils.stayInBounds(possibleX, possibleY, map.tmp.panBounds, map.tmp.panScale)
                    : {x: possibleX, y: possibleY};

            map.transform.translate.x = coords.x;
            map.transform.translate.y = coords.y;

            map.update("onPan");
        }

        function onFinal(ev) {
            if (ev.isFinal) {
                map.tmp.lastX = map.transform.translate.x;
                map.tmp.lastY = map.transform.translate.y;

                angular.element(eleMask).removeClass("on-pan");

                localStorageService.set(lsKey, {
                    x: map.tmp.lastX,
                    y: map.tmp.lastY,
                    scale: map.transform.scale
                });

                $timeout.cancel(timeoutFinal);
                timeoutFinal = $timeout(function () {
                    eleHide.css("display", "");
                });
            }
        }

        // functions
        utils = {
            calcBounds: function () {
                var difference = map.getDifference();

                var minX = Math.ceil(difference.w / 2),
                    minY = Math.ceil(difference.h / 2),
                    maxX = -Math.abs((map.dim.w + difference.w) - (mask.dim.w + minX)),
                    maxY = -Math.abs((map.dim.h + difference.h) - (mask.dim.h + minY));

                return {
                    x: {
                        min: minX,
                        max: maxX
                    },
                    y: {
                        min: minY,
                        max: maxY
                    }
                };
            },
            stayInBounds: function (possibleX, possibleY, bounds) {
                var bounds = bounds || this.calcBounds(),
                    setX = 0, setY = 0;

                if (possibleX < bounds.x.min && possibleX > bounds.x.max) {
                    setX = possibleX;
                } else if (possibleX < bounds.x.min) {
                    setX = bounds.x.max;
                } else if (possibleX > bounds.x.max) {
                    setX = bounds.x.min;
                } else {
                    setX = bounds.x.min;
                }

                if (possibleY < bounds.y.min && possibleY > bounds.y.max) {
                    setY = possibleY;
                } else if (possibleY < bounds.y.min) {
                    setY = bounds.y.max;
                } else if (possibleY > bounds.y.max) {
                    setY = bounds.y.min;
                }

                return {
                    x: setX,
                    y: setY
                };
            },
            getMinScale: function (scale) {
                // calc new min and max
                if (map.dim.w * scale < mask.dim.w) {
                    return mask.dim.w / map.dim.w;
                } else {
                    return -1;
                }
            },
            checkMinScale: function (settings) {
                var minScale = utils.getMinScale(settings.minScale),
                    newMinScale = minScale !== -1 ? minScale : settings.minScale;

                if (settings.minScale !== newMinScale) {
                    settings.minScale = minScale;
                }
            },
            getDifferenceOfMaskToMap: function () {
                var bounds = utils.stayInBounds(0, 0),
                    nullX = bounds.x,
                    nullY = bounds.y;

                return {
                    x: Math.round(nullX - map.tmp.lastX),
                    y: Math.round(nullY - map.tmp.lastY)
                }
            }
        };
        mask = {
            dim: {},
            element: null,
            init: function (element) {
                // dom element
                this.element = element;

                // dimensions
                this.dim.w = element.offsetWidth;
                this.dim.h = element.offsetHeight;
                this.dim.r = element.offsetWidth / element.offsetHeight;
            },
            getCenter: function () {
                return {
                    x: (this.dim.w / 2),
                    y: (this.dim.h / 2)
                };
            }
        };
        map = {
            isReady: false,
            element: null,
            tmp: {},
            transform: {},
            dim: {},
            init: function (element, _settings_) {
                var settings = _settings_ || {};

                // dom element
                this.element = element;

                // dimensions
                this.dim.w = parseInt(angular.element(element).css("width"), 10);
                this.dim.h = parseInt(angular.element(element).css("height"), 10);
                this.dim.r = this.dim.w / this.dim.h;

                // set scale
                this.tmp.initScale = this.scale || 1;
                calcScale();

                var savedSettings = localStorageService.get(lsKey);

                // show saved position
                if (savedSettings !== null) {
                    this.scaleTo(savedSettings.scale);
                    this.tmp.startX = this.tmp.lastX = savedSettings.x;
                    this.tmp.startY = this.tmp.lastY = savedSettings.y;
                    // otherwise init center
                } else {
                    if (settings.newMinScale === -1) {
                        var newMinScale = utils.getMinScale(settings.minScale);
                        settings.newMinScale = newMinScale !== -1 ? newMinScale : settings.minScale;
                    }

                    // startScale
                    this.scaleTo();

                    // check settings
                    // fits the height
                    if ("fitHeight" in settings && settings.fitHeight) {
                        this.scale = this.tmp.startScale = mask.dim.h / this.dim.h;
                    }
                    // fits the height
                    if ("fitWidth" in settings && settings.fitWidth) {
                        this.scale = this.tmp.startScale = mask.dim.w / this.dim.w;
                    }

                    // start coords
                    var maskCenter = mask.getCenter(),
                        mapCenter = this.getCenter();

                    this.tmp.startX = this.tmp.lastX = maskCenter.x - mapCenter.x;
                    this.tmp.startY = this.tmp.lastY = maskCenter.y - mapCenter.y;
                }

                this.isReady = true;

                // first draw
                this.reset(undefined, "init");
            },
            getDifference: function () {
                var newWidth = this.dim.w * this.scale,
                    newHeight = this.dim.h * this.scale;
                return {
                    w: newWidth - map.dim.w,
                    h: newHeight - map.dim.h
                };
            },
            getCenter: function () {
                return {
                    x: (this.dim.w / 2),
                    y: (this.dim.h / 2)
                };
            },
            scaleTo: function (_scale_, goThroughUpdate) {
                this.scale = this.tmp.startScale = (_scale_ && _scale_ !== null && _scale_ !== -1)
                    ? _scale_
                    : settings.newMinScale;

                map.dim.scaled = {
                    w: Math.round(map.dim.w * map.scale),
                    h: Math.round(map.dim.h * map.scale),
                };

                this.reset(goThroughUpdate, "scaleTo");
            },
            panToCenter: function () {
                var center = map.getCenter();
                map.panTo(center.x, center.y);
            },
            panTo: function (newX, newY, newScale) {
                if (newScale) {
                    this.scaleTo(newScale, false);
                }

                if (!this.isReady || !newX || !newY) {
                    return false;
                }

                var maskCenter = mask.getCenter(),
                    difference = this.getDifference(),
                    bounds = utils.calcBounds(),
                    possibleX = -((bounds.x.min + (newX * this.scale)) - difference.w - maskCenter.x),
                    possibleY = -((bounds.y.min + (newY * this.scale)) - difference.h - maskCenter.y),
                    coords = utils.stayInBounds(possibleX, possibleY);

                this.transform.translate.x = this.tmp.lastX = coords.x;
                this.transform.translate.y = this.tmp.lastY = coords.y;
                this.update("panTo");
            },
            reset: function (goThroughUpdate, whoIs) {
                this.transform = {
                    translate: {x: this.tmp.startX, y: this.tmp.startY},
                    scale: this.tmp.startScale
                };

                if (goThroughUpdate === undefined || goThroughUpdate) {
                    this.update("reset" + whoIs);
                }
            },
            update: function (whoIs) {
                if (!this.isReady) {
                    return false;
                }

                var value = [
                    "translateX(" + this.transform.translate.x + "px)",
                    "translateY(" + this.transform.translate.y + "px)",
                    "scale(" + this.transform.scale + ", " + this.transform.scale + ")"
                ];

                value = value.join(" ");

                this.element.style.webkitTransform = value;
                this.element.style.mozTransform = value;
                this.element.style.transform = value;

                $timeout.cancel(timeoutUpdate);
                timeoutUpdate = $timeout(function () {
                    onFinal({isFinal: true});
                }, 500);
            }
        };

        // global events
        $rootScope.$on("map.panTo", function (event, x, y, scaleToMin) {
            if (scaleToMin) {
                map.scaleTo();
            }
            map.panTo(x, y);
        });
        $rootScope.$on("map.panToCenter", function () {
            map.scaleTo();
            map.panToCenter();
        });

        return {
            restrict: "A",
            priority: 1,
            link: function (scope, element) {
                function initMap() {
                    // for different worlds
                    lsKey = lsKeyRaw + $rootScope.selectedWorld;

                    // element part
                    eleMask = element[0];
                    eleImg = element[0].querySelector(".trackmap[world='" + $rootScope.selectedWorld + "']");

                    canvas.setDimensions(eleImg.naturalWidth, eleImg.naturalHeight);

                    eleMap = element[0].querySelector("[zoom-here]");
                    angular.element(eleMap).css({
                        height: eleImg.naturalHeight + "px",
                        width: eleImg.naturalWidth + "px"
                    });

                    eleHide = angular.element(element[0].querySelector("[hide-me-on-pan]"));

                    // init pinch pan
                    initWindow();
                    mask.init(eleMask);

                    initHammer(eleMap);
                    map.init(eleMap, settings);

                    $rootScope.$emit("world:ready");
                }

                $rootScope.$on("image:loaded", function (event, _element_) {
                    if (!_element_.hasClass("trackmap")) {
                        return false;
                    }

                    initMap();
                });

                $rootScope.$on("world:changeStart", function () {
                    onFinal({
                        isFinal: true
                    });
                });
            }
        };
    })