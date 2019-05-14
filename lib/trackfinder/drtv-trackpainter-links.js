angular.module("trialsTrackmap")
    .directive("trackpainterLinks", function ($rootScope) {
        return {
            restrict: "A",
            template: '\
            <area ng-repeat="track in tracks"\
                title="{%::track.title%}"\
                href="trialsfrontier://open-track:{%::track.href%}" \
                shape="rect"\
                coords="{%::track.coords||\'0,0,0,0\'%}" \
                />\
            ',
            controller: function ($scope) {
                $scope.tracks = [];

                $rootScope.$on("clearAreaLinks", function () {
                    $scope.tracks = [];
                });

                $rootScope.$on("createAreaLink", function (event, data) {
                    $scope.tracks.push(data);
                });
            }
        }
    })