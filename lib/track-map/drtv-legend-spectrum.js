angular.module("trialsTrackmap")
    .directive("legendSpectrum",
        function (trackData, urlHandler, $rootScope, categories) {
            return {
                restrict: "C",
                scope: true,
                template: '\
                    <div class="spectrum__wrap">\
                        <div ng-show="isFiltered" class="spectrum__item spectrum__item--reset" ng-click="resetFilter()" title="reset">\
                            🞮\
                        </div>\
                        <div ng-repeat="cat in filteredCats"\
                            show-cat-on-map="cat"\
                            class="spectrum__item {%::cat.class%}-bg"\
                            ng-class="{\'is-active\': cat.index === filterCatId}"\
                            title="{%\'cats.\' + cat.index|translate|translateCat%}">\
                        </div>\
                    </div>',
                link: function (scope) {
                    // init
                    var defaultFilterCatId = categories.getDefaultFilterCatId();
                    scope.isFiltered = false;
                    scope.filterCatId = -1;
                    scope.filteredCats = [];

                    scope.resetFilter = function () {
                        $rootScope.$emit("filter:tracks", defaultFilterCatId);
                        $rootScope.$emit("discover:clear");
                    };

                    scope.updateFilter = function (catId) {
                        scope.isFiltered = (catId !== -1 && catId !== defaultFilterCatId);
                        urlHandler.set({filterCat: categories.getName(catId), filterCatViaID: null});
                    };

                    // bind events
                    $rootScope.$on("filter:tracks", function (event, catId) {
                        $rootScope.filterCatId = catId;
                        scope.filterCatId = catId;
                        scope.updateFilter(catId);
                    });

                    // init
                    $rootScope.$on("data:loaded", function () {
                        // remove leaked
                        scope.filteredCats = categories.getAll().filter(function (catObject) {
                            return catObject.class !== "secret";
                        });
                        // read url
                        urlHandler.setParams(["filterCat", "filterCatViaID"]);
                        var categoryName = urlHandler.get("filterCat") || defaultFilterCatId;
                        categoryName = categories.checkAlias(categoryName);
                        var categoryID = urlHandler.get("filterCatViaID") || undefined;
                        // set to scope
                        $rootScope.filterCatId = parseInt(categoryID || categories.getIndex(categoryName) || defaultFilterCatId);
                        scope.filterCatId = $rootScope.filterCatId;
                        categories.setFilterCatId($rootScope.filterCatId);
                        $rootScope.$emit("filter:tracks", $rootScope.filterCatId);
                    });
                }
            }
        })