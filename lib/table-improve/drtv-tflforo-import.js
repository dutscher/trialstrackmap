angular.module("trialsTrackmap")
    .directive("tflforoImport",
    function (dialogImportTflforo) {
        return {
            restrict: "A",
            template: '\
                <button ng-click="openDialog()">{%"dialogs.labels.import"|translate%}</button>\
            ',
            scope: true,
            link: function (scope) {
                scope.openDialog = function(){
                    dialogImportTflforo.open(scope.$parent);
                };
            }
        }
    })