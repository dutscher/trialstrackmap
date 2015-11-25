angular.module("trialsTrackmap")
    .service("dialogEditMyRank", function (improveTimes, dialogService) {

        var thisScope = {
            open: function (trackData, drtvScope) {

                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.editMyRank.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section>\
                                <section>\
                                    <label>{%::\'dialogs.labels.myRank\'|translate%}</label>\
                                    <input ng-model="models.myRank"\
                                           ng-model-options="{debounce:500}"\
                                           ng-change="validateInput()"\
                                           ng-enter="validateAndConfirm()"\
                                           select-on-click\
                                           placeholder="{%::\'dialogs.placeholder.myRank\'|translate%}" />\
                                    <small ng-if="oldRank" class="old-value">\
                                        {%::\'dialogs.editMyRank.oldRank\'|translate%}: <strong>{%oldRank%}</strong>\
                                    </small>\
                                </section>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            myRank: ""
                        },
                        oldRank: improveTimes.getImproveOfTrack(trackData.id, "myRank"),
                        trackName: trackData.i18n,
                        validateInput: function () {
                            var myRank = dialog.scope.models.myRank;

                            // reset
                            if (myRank === "0") {
                                dialog.close({myRank:0});
                                return;
                            }

                            if (myRank !== "" && dialog.isNumeric(myRank)) {
                                dialog.setTransferData("myRank", myRank);
                            } else {
                                dialog.setTransferData("myRank", null);
                            }

                            dialog.validate();
                        }
                    },
                    valid: false,
                    transferData: {
                        myRank: null
                    }
                });

                return dialog.promise.then(function(data){
                    improveTimes
                        .setScope(drtvScope || dialog.scope)
                        .update("myRank", trackData.id, data.myRank);
                    return dialog.isReject(data);
                });
            }
        };

        return thisScope;
    })