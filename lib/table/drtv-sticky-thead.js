angular.module("trialsTrackmap")
.directive("stickyThead", function($window, $document, $compile){
    return {
        restrict: "A",
        link: function(scope, element, attrs){

            var mirror = null,
                naviSticky = "make-sticky",
                isSticky = "is-sticky";

            function handleMirrorHead(remove){
                if(!remove && mirror == null) {
                    var thead = element.find("thead").clone(),
                        navi = angular.element($document[0].querySelector("."+naviSticky));

                    mirror = angular.element('\
                        <div class="flying-header"\
                            style="top:'+navi[0].clientHeight+'px">\
                            <table class="w100"></table>\
                        </div>\
                    ');
                    mirror.find("table").append(thead);
                    element.append(mirror);

                    var _scope_ = angular.element(element.find("thead")).scope();
                    // recompile cloned thead with real scope
                    $compile(mirror.contents())(_scope_);
                } else {
                    mirror.remove();
                    mirror = null;
                }
            }

            function makeNaviAlsoSticky(remove){
                var navi = angular.element($document[0].querySelector("."+naviSticky));
                if(!remove) {
                    navi.addClass(isSticky);
                } else {
                    navi.removeClass(isSticky);
                }
            }

            angular.element($window).on("scroll", function(){
                if( $window.scrollY > element[0].offsetTop && !(element.hasClass(isSticky))){
                    element.addClass(isSticky);
                    handleMirrorHead();
                    makeNaviAlsoSticky();
                } else if ($window.scrollY == 0){
                    element.removeClass(isSticky);
                    handleMirrorHead(true);
                    makeNaviAlsoSticky(true);
                }
            });
        }
    }
})