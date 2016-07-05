angular.module("trialsTrackmap")
    .directive("legendSpectrum", function (trackData, urlHandler, $rootScope, categories) {
        return {
            restrict: "C",
            scope: {
                cats: "=cats"
            },
            template: '<div class="spectrum__wrap">\
                <div ng-show="isFiltered" class="spectrum__item" ng-click="resetFilter()" title="reset">\
                    <i class="faults with-cursor"></i>\
                </div>\
                <div ng-repeat="cat in filteredCats"\
                    show-cat-on-map="cat"\
                    class="spectrum__item {%::cat.class%}-bg"\
                    title="{%\'cats.\' + cat.index|translate%}">\
                </div>\
            </div>',
            link: function (scope) {
                // init url
                var defaultFilterCatId = categories.getDefaultFilterCatId();
                scope.isFiltered = false;

                scope.resetFilter = function () {
                    $rootScope.$emit("filter:tracks", defaultFilterCatId);
                };

                scope.updateFilter = function (catId) {
                    scope.isFiltered = (catId !== defaultFilterCatId);
                    urlHandler.set({filterCat: categories.getName(catId) });
                };

                // bind events
                $rootScope.$on("filter:tracks", function (event, catId) {
                    scope.updateFilter(catId);
                });

                scope.$watch("cats", function (cats) {
                    if (!cats) {
                        return;
                    }

                    // remove leaked
                    scope.filteredCats = scope.cats.filter(function (catObject) {
                        var worldId = trackData.getWorld();
                        return catObject.class != "secret";
                    });
                });

                // init
                $rootScope.$on("data:loaded", function () {
                    urlHandler.setParams(["filterCat"]);
                    var categoryName = urlHandler.get("filterCat") || defaultFilterCatId;
                    $rootScope.filterCatId = categories.getIndex(categoryName) || defaultFilterCatId;
                    categories.setFilterCatId($rootScope.filterCatId);
                    $rootScope.$emit("filter:tracks", $rootScope.filterCatId);
                });
            }
        }
    })