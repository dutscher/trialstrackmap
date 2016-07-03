angular.module("trialsTrackmap")
    .directive("legendSpectrum", function (trackData, $rootScope) {
        return {
            restrict: "C",
            scope: {
                cats: "=cats"
            },
            template: '<div class="spectrum__wrap">\
                <div ng-show="isFiltered" class="spectrum__item" ng-click="resetFilter()" title="reset">x</div>\
                <div ng-repeat="cat in filteredCats"\
                    show-cat-on-map="cat"\
                    class="spectrum__item {%::cat.class%}-bg"\
                    title="{%\'cats.\' + cat.index|translate%}">\
                </div>\
            </div>',
            link: function (scope) {
                scope.isFiltered = false;

                scope.resetFilter = function () {
                    $rootScope.$emit("filter:tracks", "reset");
                };

                $rootScope.$on("filter:tracks", function(event, id){
                    scope.isFiltered = id !== "reset";
                });

                scope.$watch("cats", function (cats) {
                    if (!cats) {
                        return;
                    }

                    // remove leaked
                    scope.filteredCats = scope.cats.filter(function (cat) {
                        var worldId = trackData.getWorld();
                        return cat.class != "secret";
                    });
                })
            }
        }
    })