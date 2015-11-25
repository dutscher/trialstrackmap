angular.module("trialsTrackmap")
    .service("dialogEditWorldRecord", function (improveTimes, dialogService, dialogCreateWRRider) {

        var thisScope = {
            open: function (trackData) {

                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                var resetValue = "!!!!!?",
                    timeObj = improveTimes.WRTimes.getWROfTrack(trackData.id),
                    oldTime = timeObj.time,
                    oldRider = timeObj.riderName,
                    dialog = dialogService.confirm({
                        tpl: '\
                            <div dialog\
                                data-header="{%::\'dialogs.editWR.header\'|translate:{trackName: trackName}%}"\
                                data-footer="{%::\'dialogs.confirm\'|translate%}"\
                                >\
                                <section>\
                                    <label>{%::\'dialogs.labels.newTime\'|translate%}</label>\
                                    <input ng-model="models.newTime" \
                                           ng-model-options="{debounce:500}"\
                                           ng-change="validateTime()"\
                                           placeholder="{%::\'dialogs.placeholder.newTime\'|translate%}" />\
                                    <small ng-if="oldTime" class="old-value">\
                                        {%::\'dialogs.oldTime\'|translate%}: <strong>{%oldTime|convertTime%}</strong>\
                                    </small>\
                                    <small ng-if="models.newTime">\
                                        {%::\'dialogs.preview\'|translate%}: <strong>{%models.newTime|convertTime%}</strong>\
                                    </small>\
                                </section>\
                                <section>\
                                    <label>{%::\'dialogs.labels.riderName\'|translate%}</label>\
                                    <input ng-model="models.riderName"\
                                           ng-model-options="{debounce:500}"\
                                           ng-change="validateRider()"\
                                           select-on-click\
                                           placeholder="{%::\'dialogs.placeholder.riderName\'|translate%}" />\
                                    <small ng-if="oldRider" class="old-value">\
                                        {%::\'dialogs.editWR.oldRider\'|translate%}: <strong>{%oldRider%}</strong>\
                                    </small>\
                                    <small ng-if="newRider">\
                                        {%::\'dialogs.editWR.newRider\'|translate%}: <strong>{%newRider%}</strong>\
                                    </small>\
                                    <small ng-if="wrRider.length > 0" class="with-spacer-top">\
                                        {%::\'dialogs.editWR.riderFound\'|translate%}:<br />\
                                        <span ng-repeat="rider in wrRider" ng-click="validateRiderID(rider)">\
                                            {%rider.riderName%}\
                                        </span>\
                                    </small>\
                                    <small ng-if="wrRider.length == 0 && models.riderName" class="with-spacer-top">\
                                        {%::\'dialogs.editWR.createRider\'|translate%} \
                                        <button class="btn" ng-click="addRider()">{%::\'dialogs.create\'|translate%}</button>\
                                    </small>\
                                </section>\
                            </div>\
                        ',
                        scope: {
                            trackName: trackData.i18n,
                            oldTime: improveTimes.clearTime(oldTime),
                            oldRider: oldRider,
                            newRider: "",
                            wrRider: [],
                            models: {
                                newTime: "",
                                riderName: ""
                            }
                        },
                        valid: false,
                        transferDataInit: {
                            newTime: null,
                            riderId: null,
                            riderName: null
                        }
                    });

                dialog.scope.validateTime = function () {
                    var newTimeValue = dialog.scope.models.newTime;
                    // reset for bugs or hacker
                    if (newTimeValue === resetValue) {
                        improveTimes.WRTimes.save(trackData.id, "", "");
                        dialog.close();
                        return;
                    }

                    // parse time
                    var validNewTimeValue = improveTimes.clearTime(newTimeValue),
                    // validate all variations
                        isValidTime = newTimeValue !== null // not abort
                            && newTimeValue !== "" // not empty
                            && newTimeValue !== dialog.scope.oldTime // not the same time
                            && validNewTimeValue > 0
                            && ( dialog.scope.oldTime > 0 ? (dialog.scope.oldTime > validNewTimeValue) : true); // is oldValue not empty then be better
                    // check
                    dialog.setTransferData("newTime", isValidTime ? validNewTimeValue : null);
                    dialog.validate();
                };

                dialog.scope.validateRider = function () {
                    var riderName = dialog.scope.models.riderName;
                    if (riderName) {
                        dialog.scope.wrRider = improveTimes.WRTimes.getAllRiderByName(riderName);
                    } else {
                        dialog.setTransferData("riderId", null);
                        dialog.setTransferData("riderName", null);
                    }
                    dialog.validate();
                };

                dialog.scope.validateRiderID = function (riderData) {
                    if (riderData && riderData.id) {
                        dialog.setTransferData("riderId", riderData.id);
                        dialog.setTransferData("riderName", riderData.riderName);
                        dialog.scope.newRider = riderData.riderName;
                        dialog.scope.wrRider = [];
                        dialog.scope.models.riderName = "";
                    } else {
                        dialog.scope.newRider = null;
                        dialog.setTransferData("riderId", null);
                        dialog.setTransferData("riderName", null);
                        dialog.scope.wrRider = [];
                        dialog.scope.models.riderName = "";
                    }
                    dialog.validate();
                };

                dialog.scope.addRider = function () {
                    var newRiderName = dialog.scope.models.riderName,
                        _dialog_ = dialogCreateWRRider.open(newRiderName);

                    _dialog_.then(function(riderData){
                        dialog.setTransferData("riderId", riderData.riderId);
                        dialog.setTransferData("riderName", riderData.riderName);
                        dialog.scope.newRider = riderData.riderName;
                        dialog.scope.models.riderName = "";
                        dialog.validate();
                    });
                };

                return dialog.promise.then(function(data){
                    thisScope.confirmSave(trackData, data.newTime, data.riderName).then(function(){
                        improveTimes.WRTimes.setScope(dialog.scope);
                        improveTimes.WRTimes.save(trackData.id, mode, bike, data.riderId, data.newTime).then(function(){
                            thisScope.openThanks();
                        })
                    });
                });
            },
            confirmSave: function(trackData, newTime, riderName){

                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.editWR.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section class="text">\
                                {%::\'dialogs.editWR.confirmNewData\'|translate:{newTime:newTime, riderName:riderName}%}\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        newTime: improveTimes.convertTime(newTime),
                        riderName: riderName,
                        trackName: trackData.i18n
                    }
                });
                return dialog.promise;
            },
            openThanks: function(){
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.editWR.headerSaved\'|translate%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-cancel="true"\
                            >\
                            <section class="text">\
                                {%::\'dialogs.editWR.thanks\'|translate%}\
                            </section>\
                        </div>\
                    '
                });
                return dialog.promise;
            }
        };

        return thisScope;
    })