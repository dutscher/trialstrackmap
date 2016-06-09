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
                                           ng-change="validateInput(\'myValue\')"\
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
                                <section>\
                                    <label>{%::\'dialogs.labels.myFaults\'|translate%}</label>\
                                    <input ng-model="models.myFaults"\
                                           ng-change="validateInput(\'myFaults\')"\
                                           ng-enter="validateAndConfirm()"\
                                           select-on-click\
                                           placeholder="{%::\'dialogs.placeholder.myFaults\'|translate%}" />\
                                </section>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            myValue: improveTimes.getImproveOfTrack(trackData.id, type),
                            myFaults: improveTimes.getImproveOfTrack(trackData.id, "my" + (type === "myGoal" ? "Goal" : "") + "Faults") || 0
                        },
                        type: type,
                        ucfirstType: ucfirst(type),
                        oldTime: improveTimes.getImproveOfTrack(trackData.id, type),
                        trackName: trackData.i18n,
                        validateInput: function (type) {
                            var myValue = dialog.scope.models[type];

                            // reset
                            if (myValue === "0" && type !== "myFaults") {
                                dialog.close({myValue: 0});
                                return;
                            }

                            if (myValue !== "" && dialog.isNumeric(improveTimes.clearTime(myValue))) {
                                dialog.setTransferData(type, improveTimes.clearTime(myValue));
                            } else {
                                dialog.setTransferData(type, null);
                            }

                            dialog.validate();
                        }
                    },
                    valid: false,
                    transferDataInit: {
                        myValue: improveTimes.getImproveOfTrack(trackData.id, type),
                        myFaults: improveTimes.getImproveOfTrack(trackData.id, "my" + (type === "myGoal" ? "Goal" : "") + "Faults") || 0
                    }
                });

                return dialog.promise.then(function (_transferData_) {
                    var transferData = angular.extend(_transferData_, {});
                    // parse right for save
                    transferData[type] = transferData.myValue;
                    delete transferData.myValue;

                    if (type === "myGoal") {
                        transferData.myGoalFaults = transferData.myFaults;
                        delete transferData.myFaults;
                    }

                    // save
                    improveTimes
                        .setScope(drtvScope || dialog.scope)
                        .updateOne(trackData.id, transferData);

                    return dialog.isReject(transferData);
                });
            }
        };

        return thisScope;
    })