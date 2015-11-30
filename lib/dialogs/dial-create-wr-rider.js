angular.module("trialsTrackmap")
    .service("dialogCreateWRRider", function (improveTimes, dialogService) {

        var thisScope = {
            open: function (riderName) {

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.createRider.header\'|translate%}"\
                            data-footer="{%::\'dialogs.confirm\'|translate%}"\
                            >\
                            <section>\
                                <section>\
                                    <label>{%::"dialogs.labels.riderName"|translate%}</label>\
                                    <input ng-model="models.riderName"\
                                           ng-change="validateInput()"\
                                           ng-init="validateInput()"\
                                           ng-enter="validateAndConfirm()"\
                                           select-on-click\
                                           placeholder="{%::\'dialogs.placeholder.riderName\'|translate%}" />\
                                </section>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            riderName: riderName
                        },
                        validateInput: function () {
                            var riderName = dialog.scope.models.riderName,
                                notFound = improveTimes.WRTimes.getAllRiderByName(riderName);
                            if (riderName && notFound.length === 0) {
                                // load actual and check
                                improveTimes.WRTimes.reload().then(
                                    function (_data_) {
                                        if (_data_ !== null) {
                                            var riderRawLow = JSON.stringify(_data_.rider).toLowerCase();
                                            if (riderRawLow.indexOf(riderName.toLowerCase()) >= 0) {
                                                improveTimes.WRTimes.set(_data_);
                                                dialog.setTransferData("riderName", null);
                                                dialog.setTransferData("rawData", null);
                                            } else {
                                                dialog.setTransferData("riderName", riderName);
                                                dialog.setTransferData("rawData", _data_);
                                            }
                                        }
                                    }
                                );
                            } else {
                                dialog.setTransferData("riderName", null);
                                dialog.setTransferData("rawData", null);
                            }

                            dialog.validate();
                        }
                    },
                    valid: false,
                    transferData: {
                        riderName: null,
                        rawData: null
                    }
                });

                return dialog.promise.then(function(data){
                    return thisScope.confirmSave(data.riderName).then(function(){
                        data.riderId = improveTimes.WRTimes.addRider(riderName, data.rawData);
                        return data;
                    });
                });
            },
            confirmSave: function (riderName) {

                if (!riderName) {
                    console.error("riderName missing");
                    return;
                }

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.createRider.header\'|translate%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section class="text">\
                                {%::"dialogs.createRider.confirmNewData"|translate:{riderName:riderName}%}\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        riderName: riderName
                    }
                });
                return dialog.promise;
            }
        };

        return thisScope;
    })