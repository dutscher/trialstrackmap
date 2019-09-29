angular.module("trialsTrackmap")
    .directive("bonxyImport",
    function (dialogImportBonxy) {
        return {
            restrict: "A",
            template: '\
                <button ng-click="openDialog()">{%"dialogs.labels.import"|translate%}</button>\
            ',
            scope: true,
            link: function (scope) {
                scope.openDialog = function(){
                    dialogImportBonxy.open(scope.$parent);
                };
            }
        }
    })