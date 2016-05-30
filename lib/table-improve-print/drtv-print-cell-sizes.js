angular.module("trialsTrackmap")
    .directive("printCellSizes", function () {
        return {
            restrict: "A",
            replace: true,
            template: '\
                <tr>\
                    <th width="10"></th>\
                    <th></th>\
                    <th width="25"></th>\
                    <th width="45"></th>\
                </tr>\
            '
        }
    })