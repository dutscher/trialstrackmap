angular.module("trialsTrackmap")
    .directive("printCellSizes", function () {
        return {
            restrict: "A",
            replace: true,
            template: '\
                <tr>\
                    <th width="15"></th>\
                    <th></th>\
                    <th width="30"></th>\
                    <th width="55"></th>\
                </tr>\
            '
        }
    })