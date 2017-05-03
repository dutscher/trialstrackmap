angular.module("trialsTrackmap")
    .service("dialogEditTags", function (improveTimes, dialogService, localStorageService) {

        var thisScope = {
            lsKey: "openMyTime",
            open: function (trackData, drtvScope) {
                if (!trackData) {
                    console.error("trackdata missing");
                    return;
                }

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.editTags.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.save\'|translate%}"\
                            >\
                            <section>\
                                <small class="full" tag-list="track" data-edit-mode="true"></small>\
                            </section>\
                        </div>\
                        ',
                    scope: {
                        models: {
                            tags: []
                        },
                        track: trackData,
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
                        }
                    },
                    valid: false,
                    transferData: {
                        myRank: null
                    }
                });

                return dialog.promise.then(function (data) {
                    return dialog.isReject(data);
                });
            }
        };

        return thisScope;
    })