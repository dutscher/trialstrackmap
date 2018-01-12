angular.module("trialsTrackmap")
    .directive("languageSelect", function ($translate, $languages, $rootScope) {
        return {
            restrict: "A",
            template: "<i class=\"lang lang_{%lang%}{%(activeLang === lang ? ' is-active' : '')%}\" " +
                        "ng-repeat=\"lang in languages\" " +
                        "ng-click=\"switchToLang(lang)\"></i>",
            controller: function ($scope) {
                $scope.languages = $languages;

                $rootScope.$on("$translateChangeSuccess", function (event, data) {
                    $scope.activeLang = data.language;
                });

                $scope.switchToLang = function (lang) {
                    $translate.use(lang);
                };
            }
        };
    });