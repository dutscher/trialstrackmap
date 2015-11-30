angular.module("trialsTrackmap")
    .service("dialogEditMyValue", function (improveTimes, dialogService) {

        var thisScope = {
            open: function (trackData, type, drtvScope) {

                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                function ucfirst(str) {
                    str += '';
                    var f = str.charAt(0)
                        .toUpperCase();
                    return f + str.substr(1);
                }

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.edit\'+ucfirstType+\'.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section>\
                                <section>\
                                    <label>{%::\'dialogs.labels.\' + type|translate%}</label>\
                                    <input ng-model="models.myValue"\
                                           ng-change="validateInput()"\
                                           ng-enter="validateAndConfirm()"\
                                           select-on-click\
                                           placeholder="{%::\'dialogs.placeholder.newTime\'|translate%}" />\
                                    <small ng-if="oldTime" class="old-value">\
                                        {%::\'dialogs.labels.oldTime\'|translate%}: <strong>{%oldTime|convertTime%}</strong>\
                                    </small>\
                                    <small ng-if="models.myValue">\
                                        {%::\'dialogs.preview\'|translate%}: <strong>{%models.myValue|convertTime%}</strong>\
                                    </small>\
                                </section>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            myValue: ""
                        },
                        type: type,
                        ucfirstType: ucfirst(type),
                        oldTime: improveTimes.getImproveOfTrack(trackData.id, type),
                        trackName: trackData.i18n,
                        validateInput: function () {
                            var myValue = dialog.scope.models.myValue;

                            // reset
                            if (myValue === "0") {
                                dialog.close({myValue:0});
                                return;
                            }

                            if (myValue !== "" && dialog.isNumeric(improveTimes.clearTime(myValue))) {
                                dialog.setTransferData("myValue", improveTimes.clearTime(myValue));
                            } else {
                                dialog.setTransferData("myValue", null);
                            }

                            dialog.validate();
                        }
                    },
                    valid: false,
                    transferData: {
                        myValue: null
                    }
                });

                return dialog.promise.then(function(data){
                    improveTimes
                        .setScope(drtvScope || dialog.scope)
                        .update(type, trackData.id, data.myValue);
                    return dialog.isReject(data);
                });
            }
        };

        return thisScope;
    })