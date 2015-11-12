angular.module("trialsTrackmap")
    .directive("printCellSizes", function () {
        return {
            restrict: "A",
            replace: true,
            template: '\
                <tr>\
                    <th width="30"></th>\
                    <th></th>\
                    <th width="70"></th>\
                    <th width="70"></th>\
                </tr>\
            '
        }
    })