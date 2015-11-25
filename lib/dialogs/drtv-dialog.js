angular.module("trialsTrackmap")
    .directive("dialog", function () {
        return {
            restrict: "A",
            transclude: true,
            template: '\
                <div class="header">\
                    {%header|stripLevel%}\
                </div>\
                <div class="body" ng-transclude></div>\
                <div class="footer" ng-if="!hideFooter">\
                    <button class="btn"\
                            ng-if="!hideCancel"\
                            ng-click="closeThisDialog()">{%\'dialogs.cancel\'|translate%}</button>\
                    <button class="btn"\
                            ng-click="validateAndConfirm()"\
                            ng-if="!hideConfirm"\
                            ng-disabled="!valid"\
                            ng-class="{\'is-inactive\':!valid}">{%footer%}</button>\
                </div>\
            ',
            link: function(scope, element, attrs){
                scope.header = attrs.header;
                scope.footer = attrs.footer;
                scope.hideCancel = attrs.hideCancel || false;
                scope.hideConfirm = attrs.hideConfirm || false;
                scope.hideFooter = attrs.hideFooter || false;
            }
        }
    })