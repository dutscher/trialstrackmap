angular.module("trialsTrackmap")
    .directive("languageSelect", function ($parse, $translate, $languages, $additonalLanguages, $rootScope) {
        // $languages from map-module.js as constant
        return {
            restrict: "A",
            template:
            "<i class=\"country country--{%lang%}{%(activeLang === lang ? ' is-active' : '')%}\" " +
            "ng-repeat=\"lang in languages\" " +
            "ng-click=\"switchToLang(lang)\"></i>",
            link: function (scope, element, attrs) {
                scope.additonalLanguages = ("additonalLangs" in attrs) && attrs.additonalLangs !== null;

                scope.languages = $languages;

                if (scope.additonalLanguages) {
                    scope.languages = scope.languages.concat($additonalLanguages);
                }

                $rootScope.$on("$translateChangeSuccess", function (event, data) {
                    scope.activeLang = data.language;
                });

                scope.switchToLang = function (lang) {
                    $translate.use(lang);
                };
            }
        };
    });