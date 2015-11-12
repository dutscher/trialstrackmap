angular.module('trialsTrackmap')
.directive('languageSelect', function($translate){
    var languages = ['en','de','fr','ru','es','it','pt'];

    return {
        restrict: 'A',
        template: '<i class="lang lang_{%lang%}" ng-repeat="lang in languages" ng-click="switchToLang(lang)"></i>',
        controller: function ($scope) {
            $scope.languages = languages;

            $scope.switchToLang = function(lang){
                $translate.use(lang);
            }
        }
    }
})