angular.module("trialsTrackmap")
    .directive("improveImport", function (dialogImport) {
        return {
            restrict: "A",
            template: '\
                <button ng-click="openDialog()">{%"dialogs.labels.import"|translate%}</button>\
            ',
            scope: true,
            link: function (scope) {
                scope.openDialog = function(){
                    dialogImport.open(scope);
                };
            }
        }
    })