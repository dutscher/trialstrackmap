angular.module("trialsTrackmap")
    .directive("wrRiderAdd", function (dialogCreateWRRider) {
        return {
            restrict: "A",
            template: '\
                <button ng-click="openDialog()">{%"page.worldRecordsTable.addRiderButton"|translate%}</button>\
            ',
            link: function (scope) {
                scope.openDialog = function(){
                    dialogCreateWRRider.open();
                };
            }
        }
    })