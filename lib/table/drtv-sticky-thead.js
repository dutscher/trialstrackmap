angular.module("trialsTrackmap")
    .directive("stickyThead", function ($window, $document, $compile) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

                var mirror = null,
                    naviSticky = "make-sticky",
                    isSticky = "is-sticky",
                    is5050 = attrs.stickyThead === "w50";

                function handleMirrorHead(remove) {
                    if (!remove && mirror == null) {
                        var theadElement = element.find("thead");
                        var thead = theadElement.clone();
                        var navi = angular.element($document[0].querySelector("." + naviSticky));

                        angular.element(element).css({
                            marginTop: (theadElement[0].offsetHeight + theadElement[0].scrollTop) + "px"
                        });

                        mirror = angular.element('\
                        <div class="flying-header' + (is5050 ? ' flex' : '') + '"\
                            style="top:' + navi[0].clientHeight + 'px">\
                            <table class="' + (is5050 ? 'w50' : 'w100') + '"></table>\
                            ' + (is5050 ? '<table class="w50"></table>' : '') + '\
                        </div>\
                    ');
                        mirror.find("table")[0].append(thead[0]);
                        if (is5050 && thead.length === 2) {
                            mirror.find("table")[1].append(thead[1]);
                        }

                        element.append(mirror);

                        var _scope_ = angular.element(element.find("thead")).scope();
                        // recompile cloned thead with real scope
                        $compile(mirror.contents())(_scope_);
                    } else if (mirror) {
                        mirror.remove();
                        mirror = null;

                        angular.element(element).css({marginTop: 0});
                    }
                }

                function makeNaviAlsoSticky(remove) {
                    var navi = angular.element($document[0].querySelector("." + naviSticky));
                    if (!remove) {
                        navi.addClass(isSticky);
                    } else {
                        navi.removeClass(isSticky);
                    }
                }

                angular.element($window).on("scroll", function () {
                    if ($window.scrollY > element[0].offsetTop && !(element.hasClass(isSticky))) {
                        element.addClass(isSticky);
                        handleMirrorHead();
                        makeNaviAlsoSticky();
                    } else if ($window.scrollY === 0) {
                        element.removeClass(isSticky);
                        handleMirrorHead(true);
                        makeNaviAlsoSticky(true);
                    }
                });
            }
        }
    })