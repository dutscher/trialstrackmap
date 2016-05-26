angular.module("trialsTrackmap")
    .service("dialogImportTflforo",
    function (dialogService, improveTimes, tflforoApi,
              localStorageService, security, $filter, $http) {

        var drtvScope = null,
            thisScope,
            vars = {
                profileId: "profileId",
                profileRank: "profileRank",
                importData: "importData",
                profileName: "profileName"
            };

        thisScope = {
            open: function (_drtvScope_) {

                drtvScope = _drtvScope_;

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.tflforo.header\'|translate%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-footer="true">\
                            <section>\
                                <label>{%::"dialogs.import.tflforo.labelVia"|translate%}</label>\
                                <input ng-model="models.profileId"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateProfileId()"\
                                       ng-init="validateProfileId()"\
                                       ng-enter="validateProfileId()"\
                                       select-on-click\
                                       class="small inline"\
                                       placeholder="{%::\'dialogs.import.tflforo.placeholder\'|translate%}" />\
                                <small ng-if="!error.api" class="inline">\
                                    <button class="btn" ng-click="importProfileData(models.profileId)">{%::"dialogs.labels.import"|translate%}</button>\
                                </small>\
                                <small ng-if="error.api" class="inline">\
                                    <button class="btn" ng-click="searchProfileId()">{%::"dialogs.import.tflforo.searchId"|translate%}</button>\
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
                            profileName: localStorageService.get(vars.profileName),
                            profileRank: localStorageService.get(vars.profileRank),
                            profileId: tflforoApi.getProfileId()
                        },
                        validateProfileId: function () {
                            dialog.scope.error.storage = null;
                            dialog.setTransferData(vars.importData, null);

                            var profileId = this.models[vars.profileId];
                            if (dialog.isEmpty(profileId)) {
                                dialog.scope.error.api = "emptyTflforoId";
                            }
                        },
                        searchProfileId: function () {
                            thisScope.openSearch().then(function (_data_) {
                                dialog.scope.models[vars.profileId] = _data_[vars.profileId];
                                dialog.scope.models[vars.profileName] = _data_[vars.profileName];
                                dialog.scope.models[vars.profileRank] = _data_[vars.profileRank];
                                dialog.scope.error.api = null;
                            });
                        },

                        importProfileData: function (_profileId_) {
                            tflforoApi.getProfileData(_profileId_).then(
                                function (json) {
                                    if (json !== null) {
                                        dialog.scope.validateImportData(json);
                                    }
                                },
                                function () {
                                    dialog.scope.error.api = "noAccessTflforo";
                                    console.error($filter("translate")("page.timesTable.error.noAccessTflforo", {id: _profileId_}), json);
                                }
                            );
                        },

                        validateImportData: function (_data_) {
                            if (("tracks" in _data_)) {
                                var tracksData = {};

                                _data_.tracks.forEach(function (track) {
                                    tracksData[track.id] = {
                                        "myRank": track.rank,
                                        "myTime": track.drivetime,
                                        "myBike": track.bike + "-" + track.paintjob
                                    };
                                });
                            } else {
                                dialog.scope.error.api = "noData";
                                console.error($filter("translate")("dialogs.error.noData"), _data_);
                                return;
                            }

                            thisScope.openConfirm({
                                exportDate: _data_.date,
                                profileName: _data_.name
                            }).then(function () {
                                improveTimes
                                    .setScope(drtvScope)
                                    .updateMore(tracksData);

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
            openConfirm: function (data) {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.confirmHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.confirm\'|translate%}"\
                            data-hide-cancel="true">\
                            <section class="text">\
                                {%::"dialogs.import.tflforo.confirmNewData"|translate:data%}\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        data: data || {}
                    }
                });
                return dialog.promise;
            },
            openSearch: function (data) {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.tflforo.searchHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.check\'|translate%}">\
                            <section>\
                                <label>{%::"dialogs.labels.profileName"|translate%}</label>\
                                <input ng-model="models.profileName"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateValue()"\
                                       ng-init="validateValue()"\
                                       ng-enter="validateValue()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.import.tflforo.enterYourProfileName\'|translate%}" />\
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
                            profileName: localStorageService.get(vars.profileName)
                        },
                        validateValue: function (_type_) {
                            dialog.setTransferData(vars.profileName, null);
                            dialog.scope.error[vars.profileName] = null;

                            var profileName = this.models[vars.profileName];

                            if (!dialog.isEmpty(profileName)) {
                                tflforoApi.searchProfileName(profileName).then(
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
                    localStorageService.set(vars.profileName, _data_[vars.profileName]);
                    localStorageService.set(vars.profileRank, _data_[vars.profileRank]);
                    tflforoApi.setProfileId(_data_[vars.profileId]);
                    return _data_;
                });
            }
        };
        return thisScope;
    })