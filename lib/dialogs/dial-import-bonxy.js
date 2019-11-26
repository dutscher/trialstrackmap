angular.module("trialsTrackmap")
    .service("dialogImportBonxy",
    function (dialogService, improveTimes, bonxyApi,
              localStorageService, security, $filter) {

        var drtvScope = null,
            thisScope,
            vars = {
                uplayUsername: "uplayUsername",
                profileRank: "profileRank",
                importData: "importData",
                profileName: "profileName"
            };

        thisScope = {
            // first dialog with userName input
            open: function (_drtvScope_) {
                drtvScope = _drtvScope_;

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.bonxy.header\'|translate%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-footer="true">\
                            <section>\
                                <label>{%::"dialogs.labels.os"|translate%}</label>\
                                <small>\
                                    <select ng-model="models.os">\
                                        <option value="android">Android</option>\
                                        <option value="ios">iOS</option>\
                                    </select>\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.import.bonxy.labelVia"|translate%}</label>\
                                <input ng-model="models.uplayUsername"\
                                       ng-model-options="{debounce:250}"\
                                       ng-change="validateProfileId()"\
                                       ng-init="validateProfileId()"\
                                       ng-enter="validateProfileId()"\
                                       select-on-click\
                                       class="small inline"\
                                       placeholder="{%::\'dialogs.import.bonxy.placeholder\'|translate%}" />\
                                <small ng-if="!error.api" class="inline">\
                                    <button class="btn" ng-click="importProfileData(models.profileId)">{%::"dialogs.labels.import"|translate%}</button>\
                                </small>\
                                <small ng-if="error.api" class="inline">\
                                    <button class="btn" ng-click="importProfileData()">\
                                        {%::"dialogs.import.bonxy.searchId"|translate%}\
                                    </button>\
                                </small>\
                            </section>\
                            <section ng-if="models.profileName" class="with-border-top">\
                                <label>{%::"dialogs.labels.profileName"|translate%}</label>\
                                <small>\
                                {%models.profileName%}\
                                </small>\
                            </section>\
                            <section ng-if="models.profileRank" class="with-border-top">\
                                <label>{%::"dialogs.labels.profileRank"|translate%}</label>\
                                <small>\
                                {%models.profileRank%}\
                                </small>\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        models: {
                            os: improveTimes.getOS(),
                            allOs: improveTimes.getAllOS(),
                            uplayUsername: localStorageService.get(vars.uplayUsername),
                            profileName: localStorageService.get(vars.profileName),
                            profileRank: localStorageService.get(vars.profileRank),
                            profileId: bonxyApi.getProfileId()
                        },

                        validateProfileId: function () {
                            dialog.scope.error.storage = null;
                            dialog.setTransferData(vars.importData, null);

                            var profileId = this.models[vars.uplayUsername];
                            if (dialog.isEmpty(profileId)) {
                                dialog.scope.error.api = "emptyUplayUsername";
                            }
                        },

                        // open second dialog
                        searchUplayUsername: function () {
                            thisScope.openSearch(dialog.scope.models.os).then(function (_data_) {
                                dialog.scope.models[vars.profileId] = _data_[vars.profileId];
                                dialog.scope.models[vars.profileName] = _data_[vars.profileName];
                                dialog.scope.models[vars.profileRank] = _data_[vars.profileRank];
                                dialog.scope.error.api = null;
                            });
                        },

                        importProfileData: function (_profileId_) {
                            bonxyApi.getProfileData(dialog.scope.models.os, _profileId_).then(
                                function (json) {
                                    if (json !== null) {
                                        dialog.scope.validateImportData(json);
                                    }
                                },
                                function (json) {
                                    dialog.scope.error.api = "noAccessTflforo";
                                    console.error($filter("translate")("page.timesTable.error.noAccessTflforo", {id: _profileId_}), json);
                                }
                            );
                        },

                        validateImportData: function (_data_) {
                            var tracksData = {};

                            console.log('validateImportData', _data_)

                            function addTime(mode, trackId, trackData) {
                                if (trackData) {
                                    if(!tracksData[trackId].hasOwnProperty(mode)){
                                        tracksData[trackId][mode] = {};
                                    }
                                    tracksData[trackId][mode] = {
                                        "myRank": trackData.r,
                                        "myRankPercent": trackData.p,
                                        "myTime": trackData.t,
                                        "myBike": trackData.b + "-" + (trackData.paintjob || 0 ),
                                        "myFaults": trackData.f
                                    };
                                }
                            }

                            // iterate over normal tracks
                            Object.keys(_data_.tracks).forEach(function (trackId) {
                                var track = _data_.tracks[trackId];
                                tracksData[trackId] = {};

                                addTime("normal", trackId, track.n);
                                addTime("donkey", trackId, track.d);
                                addTime("crazy", trackId, track.c);
                            });

                            thisScope.openConfirm({
                                exportDate: _data_.date,
                                profileName: _data_.name,
                                profileRank: _data_.rank
                            }).then(function () {
                                improveTimes
                                    .setScope(drtvScope)
                                    .updateMore(tracksData);

                                drtvScope.profileRank = _data_.rank;
                                localStorageService.set(vars.profileRank, _data_.rank);

                                dialog.close();
                            });
                        },
                        error: {},
                        transferData: {
                            importData: null
                        }
                    }
                });

                return dialog.promise;
            },
            openSearch: function (_os_) {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.bonxy.searchHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.labels.import\'|translate%}">\
                            <section>\
                                <label>{%::"dialogs.labels.os"|translate%}</label>\
                                <small>\
                                    <select ng-model="models.os">\
                                        <option value="android">Android</option>\
                                        <option value="ios">iOS</option>\
                                    </select>\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.labels.profileName"|translate%}</label>\
                                <input ng-model="models.profileName"\
                                       ng-model-options="{debounce:250}"\
                                       ng-change="validateValue()"\
                                       ng-init="validateValue()"\
                                       ng-enter="validateValue()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.import.bonxy.enterYourProfileName\'|translate%}" />\
                                <small ng-if="error.profileName" class="error">\
                                    {%::"dialogs.error." + error.profileName|translate%}\
                                </small>\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        isEncrypted: false,
                        error: {},
                        models: {
                            os: _os_,
                            profileName: localStorageService.get(vars.profileName)
                        },
                        validateValue: function (_type_) {
                            dialog.setTransferData(vars.profileName, null);
                            dialog.scope.error[vars.profileName] = null;

                            var profileName = this.models[vars.profileName];

                            if (!dialog.isEmpty(profileName)) {
                                bonxyApi.searchProfileName(dialog.scope.models.os, profileName).then(
                                    function (profileData) {
                                        dialog.setTransferData(vars.profileName, profileData.name);
                                        dialog.setTransferData(vars.profileId, profileData.id);
                                        dialog.setTransferData(vars.profileRank, profileData.rank);
                                        dialog.validate();
                                    },
                                    function (error) {
                                        console.log("error", error)
                                        dialog.scope.error[_type_ ? _type_ : vars.profileName] = error;
                                    }
                                );
                            }
                        }
                    },
                    valid: false,
                    transferData: {
                        profileName: null,
                        profileId: null,
                        profileRank: null
                    }
                });
                return dialog.promise.then(function (_data_) {
                    bonxyApi.setProfileId(_data_[vars.profileId]);
                    // set scope in table
                    drtvScope.profileName = _data_[vars.profileName];
                    localStorageService.set(vars.profileName, _data_[vars.profileName]);
                    drtvScope.profileRank = _data_[vars.profileRank];
                    localStorageService.set(vars.profileRank, _data_[vars.profileRank]);
                    drtvScope.selectedOS = dialog.scope.models.os;
                    drtvScope.setOS();
                    return _data_;
                });
            },
            openConfirm: function (data) {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.confirmHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.confirm\'|translate%}"\
                            data-hide-cancel="true">\
                            <section class="text">\
                                {%::"dialogs.import.bonxy.confirmNewData"|translate:data%}\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        data: data || {}
                    }
                });
                return dialog.promise;
            }
        };
        return thisScope;
    })