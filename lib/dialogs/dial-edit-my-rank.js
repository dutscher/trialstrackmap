angular.module("trialsTrackmap")
    .service("dialogEditMyRank", function (improveTimes, dialogService, localStorageService) {

        var thisScope = {
            lsKey: "openMyTime",
            open: function (trackData, drtvScope) {

                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                var defaultCheckbox = localStorageService.get(thisScope.lsKey),
                dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.editMyRank.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section>\
                                <label>{%::\'dialogs.labels.myRank\'|translate%}</label>\
                                <input ng-model="models.myRank"\
                                       ng-change="validateInput()"\
                                       ng-enter="validateAndConfirm()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.placeholder.myRank\'|translate%}" />\
                                <small ng-if="oldRank" class="old-value">\
                                    {%::\'dialogs.labels.oldRank\'|translate%}: <strong>{%oldRank%}</strong>\
                                </small>\
                            </section>\
                            <section>\
                                <small>\
                                    <input ng-model="models.openMyTime"\
                                           ng-change="validateOpenMyTime()"\
                                           ng-checked="models.openMyTime"\
                                           type="checkbox" />\
                                    <span ng-click="toggleOpenMyTime()" class="label-for-checkbox">\
                                        {%::"dialogs.labels.openMyTime"|translate%}\
                                    </span>\
                                </small>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            myRank: "",
                            openMyTime: defaultCheckbox !== null ? defaultCheckbox : true
                        },
                        oldRank: improveTimes.getImproveOfTrack(trackData.id, "myRank"),
                        trackName: trackData.i18n,
                        validateInput: function () {
                            var myRank = dialog.scope.models.myRank;

                            // reset
                            if (myRank === "0") {
                                dialog.close({myRank: 0});
                                return;
                            }

                            if (myRank !== "" && dialog.isNumeric(myRank)) {
                                dialog.setTransferData("myRank", myRank);
                            } else {
                                dialog.setTransferData("myRank", null);
                            }

                            dialog.validate();
                        },
                        validateOpenMyTime: function () {
                            var boolean = this.models.openMyTime;
                            if (!boolean) {
                                localStorageService.set(thisScope.lsKey, false);
                            } else {
                                localStorageService.remove(thisScope.lsKey);
                            }
                        },
                        toggleOpenMyTime: function(){
                            this.models.openMyTime = this.models.openMyTime ? false : true;
                            this.validateOpenMyTime();
                        }
                    },
                    valid: false,
                    transferData: {
                        myRank: null
                    }
                });

                return dialog.promise.then(function (data) {
                    improveTimes
                        .setScope(drtvScope || dialog.scope)
                        .update("myRank", trackData.id, data.myRank);

                    console.log(dialog.scope.models.openMyTime)

                    if(!dialog.scope.models.openMyTime){
                        data.reject = true;
                    }

                    return dialog.isReject(data);
                });
            }
        };

        return thisScope;
    })