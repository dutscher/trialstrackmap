angular.module("trialsTrackmap")
    .directive("bonxyImport",
    function (dialogImportBonxy) {
        return {
            restrict: "A",
            Xtemplate: '\
                <button ng-click="openDialog()">{%"dialogs.labels.import"|translate%}</button>\
            ',
            scope: true,
            link: function (scope, element) {
                angular.element(element).on('click', function(){
                    dialogImportBonxy.open(scope.$parent);
                });
            }
        }
    })