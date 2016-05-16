angular.module("trialsTrackmap")
.directive("languageSelect", function($translate, $languages){
    return {
        restrict: "A",
        template: '<i class="lang lang_{%lang%}" ng-repeat="lang in languages" ng-click="switchToLang(lang)"></i>',
        controller: function ($scope) {
            $scope.languages = $languages;

            $scope.switchToLang = function(lang){
                $translate.use(lang);
            }
        }
    }
})