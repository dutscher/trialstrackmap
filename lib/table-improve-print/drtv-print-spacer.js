angular.module("trialsTrackmap")
    .directive("printSpacer", function () {
        return {
            restrict: "A",
            replace: true,
            scope: {
                text: "@printSpacer"
            },
            template: '\
                <tr class="spacer" ng-class="{\'with-text\':text != \'\'}">\
                    <td></td>\
                    <td colspan="3">\
                        {%text%}\
                    </td>\
                </tr>\
            '
        }
    })