angular.module("trialsTrackmap")
    .service("dialogExport", function (dialogService, improveTimes, myJson,
                                       localStorageService, $filter, $q) {

        var drtvScope = null,
            thisScope;

        thisScope = {
            open: function (_drtvScope_) {

                drtvScope = _drtvScope_;

                var lsKey = improveTimes.autoExportLsKey,
                    dialog = dialogService.confirm({
                        tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.export.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-footer="true"\
                            >\
                            <section>\
                                <label>{%::"dialogs.export.toStorage"|translate%}</label>\
                                <input ng-model="models.storageId"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateStorage()"\
                                       ng-init="validateStorage()"\
                                       ng-enter="validateStorage()"\
                                       select-on-click\
                                       class="small inline"\
                                       placeholder="{%::\'dialogs.import.enterYourId\'|translate%}" />\
                                <small ng-if="!error.storage" class="inline">\
                                    <button class="btn" ng-click="saveStorage()">{%::"dialogs.labels.export"|translate%}</button>\
                                </small>\
                            </section>\
                            <section>\
                                <small>\
                                    <input ng-model="models.autoExport"\
                                           ng-change="validateAutoExport()"\
                                           type="checkbox" />\
                                    {%::"dialogs.labels.autoExport"|translate%}\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.export.toJsonFile"|translate%}</label>\
                                <small>\
                                    <button class="btn" ng-click="saveFile()">\
                                        {%::"dialogs.save"|translate%}</button>\
                                </small>\
                                <small ng-if="error.file" class="error">\
                                    {%::"dialogs.error." + error.file|translate%}\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.export.toCsvFile"|translate%}</label>\
                                <small>\
                                    <button class="btn" ng-click="saveFileCSV()">\
                                        {%::"dialogs.save"|translate%}</button>\
                                </small>\
                                <small ng-if="error.fileCsv" class="error">\
                                    {%::"dialogs.error." + error.fileCsv|translate%}\
                                </small>\
                            </section>\
                        </div>\
                    ',
                        scope: {
                            models: {
                                storageId: myJson.getId(),
                                autoExport: localStorageService.get(lsKey) || false
                            },
                            error: {},
                            validateStorage: function () {
                                var idStorage = this.models.storageId;
                                this.error.storage = null;
                                if (!idStorage || idStorage === null || idStorage === "") {
                                    this.error.storage = "noStorageId";
                                }
                            },
                            saveStorage: function () {
                                thisScope.openBackup().then(function (_data_) {
                                    var data = improveTimes.getEmptyData(drtvScope);
                                    myJson.save(data,
                                        _data_ && "userName" in _data_ ? _data_.userName : "",
                                        _data_ && "password" in _data_ ? _data_.password : ""
                                    ).then(function () {
                                        dialog.close();
                                        thisScope.openSuccessfull();
                                    });
                                });
                            },
                            validateAutoExport: function () {
                                var boolean = this.models.autoExport;
                                if (boolean) {
                                    localStorageService.set(lsKey, true);
                                } else {
                                    localStorageService.remove(lsKey);
                                }
                            },
                            saveFile: function () {
                                this.error.file = null;
                                var isFileSaverSupported = false;

                                try {
                                    isFileSaverSupported = !!new Blob && saveAs;
                                } catch (e) {
                                    console.error("no export supported");
                                    this.error.file = "cannotExport";
                                }

                                if (!isFileSaverSupported) {
                                    return;
                                }

                                var data = improveTimes.getEmptyData(drtvScope),
                                    blob = new Blob([JSON.stringify(data)], {type: improveTimes.fileMimeType + ";charset=utf-8"});
                                saveAs(blob, improveTimes.fileName + "." + $filter("humanReadableDate")() + "." + improveTimes.fileExtension);
                            },
                            saveFileCSV: function () {
                                this.error.fileCsv = null;
                                var isFileSaverSupported = false;

                                try {
                                    isFileSaverSupported = !!new Blob && saveAs;
                                } catch (e) {
                                    console.error("no export supported");
                                    this.error.fileCsv = "cannotExport";
                                }

                                if (!isFileSaverSupported) {
                                    return;
                                }

                                var pattern = improveTimes.getPattern(),
                                    patternKeys = Object.keys(pattern),
                                    csvData = "ID;Track;" + (patternKeys.join(";")) + "\n";

                                scope.data.tracks.forEach(function (track) {
                                    var data = [];

                                    data.push(track.id);
                                    data.push($filter("stripLevel")(track.i18n));

                                    patternKeys.forEach(function (key) {
                                        var index = key.split("-"),
                                            value = track.improve[index[1]][index[2]][index[0]];

                                        if (value === improveTimes.error) {
                                            value = "";
                                        }

                                        if (index[0] === "myTime") {
                                            value = value ? $filter("convertTime")(value) : "";
                                        }

                                        data.push(value);
                                    });

                                    csvData += data.join(";") + "\n";
                                });

                                var blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
                                saveAs(blob, improveTimes.fileName + "." + $filter("humanReadableDate")() + "." + "csv");
                            }
                        }
                    });

                return dialog.promise;
            },
            openBackup: function () {
                var lsKey = "dontAskAgainForBackup",
                    showDialog = localStorageService.get(lsKey),
                    dialog;

                if (showDialog) {
                    return $q.resolve();
                }

                dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.export.backupHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.backup\'|translate%}"\
                            data-hide-cancel="true">\
                            <section>\
                                <label>{%::"dialogs.labels.userName"|translate%}</label>\
                                <input ng-model="models.userName"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateUserName()"\
                                       ng-init="validateUserName()"\
                                       ng-enter="validateUserName()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.export.enterUserName\'|translate%}" />\
                                <small ng-if="error.userName" class="error">\
                                    {%::"dialogs.error." + error.userName|translate%}\
                                </small>\
                            </section>\
                            <section>\
                                <label>{%::"dialogs.labels.password"|translate%}</label>\
                                <input ng-model="models.password"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validatePassword()"\
                                       ng-init="validatePassword()"\
                                       ng-enter="validatePassword()"\
                                       select-on-click\
                                       type="password"\
                                       placeholder="{%::\'dialogs.export.enterPassword\'|translate%}" />\
                                <small ng-if="error.password" class="error">\
                                    {%::"dialogs.error." + error.password|translate%}\
                                </small>\
                            </section>\
                            <section>\
                                <small>\
                                    <input ng-model="models.dontAskAgain"\
                                           ng-change="validateDontAskAgain()"\
                                           type="checkbox" />\
                                    {%::"dialogs.labels.dontAskAgain"|translate%}\
                                </small>\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        models: {
                            userName: localStorageService.get("userName"),
                            password: "",
                            dontAskAgain: false
                        },
                        valid: false,
                        error: {},
                        validateUserName: function () {
                            var userName = this.models.userName;
                            if (userName && userName !== "") {
                                dialog.setTransferData("userName", userName);
                                dialog.setTransferData("password", "");
                            } else {
                                dialog.setTransferData("userName", null);
                                dialog.setTransferData("password", null);
                            }
                            dialog.validate();
                        },
                        validatePassword: function () {
                            var password = this.models.password;
                            if (password && password !== "") {
                                dialog.setTransferData("password", password);
                            } else {
                                dialog.setTransferData("password", "");
                            }
                            dialog.validate();
                        },
                        validateDontAskAgain: function () {
                            var boolean = this.models.dontAskAgain;
                            if (boolean) {
                                dialog.close();
                                localStorageService.set(lsKey, true);
                            } else {
                                localStorageService.remove(lsKey);
                            }
                        },
                        transferData: {
                            userName: null,
                            password: null
                        }
                    }
                });
                return dialog.promise;
            },
            openSuccessfull: function () {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.export.successfullExportedHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-cancel="true"\
                            >\
                            <section class="text">\
                                {%::\'dialogs.export.successfullExported\'|translate%}\
                            </section>\
                        </div>\
                    '
                });
                return dialog.promise;
            }
        };
        return thisScope;
    })