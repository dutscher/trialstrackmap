angular.module("trialsTrackmap")
    .directive("improveExport", function (dialogExport) {
        return {
            restrict: "A",
            template: '\
                <button ng-click="openDialog()">{%"dialogs.labels.export"|translate%}</button>\
            ',
            scope: true,
            link: function (scope) {
                scope.openDialog = function(){
                    dialogExport.open(scope);
                };
            }
        }
    })