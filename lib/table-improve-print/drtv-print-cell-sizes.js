angular.module("trialsTrackmap")
    .directive("printCellSizes", function () {
        return {
            restrict: "A",
            replace: true,
            template: '\
                <tr>\
                    <th width="10"></th>\
                    <th></th>\
                    <th width="20"></th>\
                    <th width="40"></th>\
                </tr>\
            '
        }
    })