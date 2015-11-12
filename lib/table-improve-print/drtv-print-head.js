angular.module("trialsTrackmap")
    .directive("printHead", function () {
        return {
            restrict: "A",
            replace: true,
            scope: {
                headline: "@printHead"
            },
            template: '\
                <tr class="headline">\
                    <td></td>\
                    <td colspan="3">{%headline%}</td>\
                </tr>\
            '
        }
    })