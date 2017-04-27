angular.module('trialsTrackmap')
  .directive('tagList', function(categories) {
    return {
      restrict: 'A',
      scope: {
        track: '=tagList'
      },
      template: '\
        <span ng-repeat="categoryId in track.categories"\
              ng-click="showCat(categoryId)"\
              class="tag">\
            <span class="tag__color {%categoryData(categoryId).class%}-bg"></span>\
            {%\'cats.\' + categoryId|translate%}<br />\
        </span>',
      controller: function($scope) {
        $scope.categoryData = categories.findById;
      }
    };
  })