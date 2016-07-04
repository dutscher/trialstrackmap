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
                var defaultFilterCatId = trackData.getDefaultFilterCatId();
                scope.isFiltered = false;

                scope.resetFilter = function () {
                    $rootScope.$emit("filter:tracks", defaultFilterCatId);
                };

                scope.updateFilter = function (id) {
                    scope.isFiltered = (id !== defaultFilterCatId);
                    var category = categories.findById(id);
                    urlHandler.set({filterCat: categories.findById(id).class});
                };

                // bind events
                $rootScope.$on("filter:tracks", function (event, id) {
                    scope.updateFilter(id);
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
                });

                // init
                $rootScope.$on("data:loaded", function () {
                    urlHandler.setParams(["filterCat"]);
                    var categoryName = urlHandler.get("filterCat") || defaultFilterCatId,
                        category = categories.findByName(categoryName);
                    $rootScope.filterCatId = category.hasOwnProperty("index") ? category.index : defaultFilterCatId;
                    trackData.setFilterCatId($rootScope.filterCatId);
                    $rootScope.$emit("filter:tracks", $rootScope.filterCatId);
                });
            }
        }
    })