angular.module("trialsTrackmap")
    .service("dialogImport", function (dialogService, improveTimes, myJson,
                                       localStorageService, security, $filter, $http) {

        var drtvScope = null,
            thisScope;

        thisScope = {
            open: function (_drtvScope_) {

                drtvScope = _drtvScope_;

                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.header\'|translate:{trackName: trackName}%}"\
                            data-footer="{%::\'dialogs.close\'|translate%}"\
                            data-hide-footer="true"\
                            >\
                            <section>\
                                <label>{%::"dialogs.import.viaJsonFile"|translate%}</label>\
                                <small uploader\
                                       ng-model="models.jsonFile"\
                                       ng-change="validateFile()">\
                                </small>\
                                <small ng-if="models.jsonFile.file">\
                                    {%::"dialogs.labels.choosedFile"|translate%}: <strong>{%models.jsonFile.file.name%}</strong><br />\
                                </small>\
                                <small ng-if="error.file  && !error.file.data" class="error with-spacer-top">\
                                    {%::"dialogs.error." + error.file|translate%}\
                                </small>\
                                <small ng-if="error.file && error.file.data" class="error with-spacer-top">\
                                    {%::"dialogs.error." + error.file.type|translate:error.file.data%}\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.import.viaJsonFileUrl"|translate%}</label>\
                                <input ng-model="models.jsonUrl"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateUrl()"\
                                       ng-enter="validateUrl()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.import.enterJsonUrl\'|translate%}" />\
                                <small ng-if="error.url" class="error">\
                                    {%::"dialogs.error." + error.url|translate%}\
                                </small>\
                            </section>\
                            <section class="with-border-top">\
                                <label>{%::"dialogs.import.viaStorage"|translate%}</label>\
                                <input ng-model="models.storageId"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateStorage()"\
                                       ng-init="validateStorage()"\
                                       ng-enter="validateStorage()"\
                                       select-on-click\
                                       class="small inline"\
                                       placeholder="{%::\'dialogs.import.enterYourId\'|translate%}" />\
                                <small ng-if="!error.storage" class="inline">\
                                    <button class="btn" ng-click="importStorage(models.storageId)">{%::"dialogs.labels.import"|translate%}</button>\
                                </small>\
                                <small ng-if="error.storage" class="inline">\
                                    <button class="btn" ng-click="restoreStorageId()">{%::"dialogs.import.retrieveYourId"|translate%}</button>\
                                </small>\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        models: {
                            jsonFile: {},
                            jsonUrl: "",
                            storageId: myJson.getId()
                        },
                        validateFile: function () {
                            dialog.scope.error.file = null;
                            dialog.setTransferData("importData", null);

                            var json = "",
                                data = {},
                                file = this.models.jsonFile.file,
                                base64 = this.models.jsonFile.source;

                            if (file.type !== "" && file.type !== improveTimes.fileMimeType) {
                                dialog.scope.error.file = {
                                    "type": "wrongFileType",
                                    "data": {fileType: improveTimes.fileMimeType}
                                };
                                console.error($filter("translate")("dialogs.error.wrongFileType", {fileMimeType: this.fileMimeType}), file);
                                return;
                            }

                            if (file.name.indexOf(improveTimes.fileName) === -1) {
                                dialog.scope.error.file = {
                                    "type": "wrongFileName",
                                    "data": {fileName: improveTimes.fileName}
                                };
                                console.error($filter("translate")("dialogs.error.wrongFileName", {fileName: this.fileName}), file);
                                return;
                            }

                            try {
                                json = security.base64decode(base64);
                            } catch (e) {
                                dialog.scope.error.file = {
                                    "type": "cantReadFile",
                                    "data": {e: e}
                                };
                                console.error($filter("translate")("dialogs.error.cantReadFile", {e: e}), file);
                                return;
                            }

                            try {
                                data = JSON.parse(json);
                            } catch (e) {
                                dialog.scope.error.file = {
                                    "type": "cantReadJson",
                                    "data": {e: e}
                                };
                                console.error($filter("translate")("dialogs.error.cantReadJson", {e: e}), file);
                                return;
                            }

                            dialog.setTransferData("importData", data);
                            if (dialog.validate()) {
                                dialog.scope.validateImportData(data, "file");
                            }
                        },
                        validateUrl: function () {
                            dialog.scope.error.url = null;
                            dialog.setTransferData("importData", null);

                            var url = this.models.jsonUrl,
                                data = {};

                            if (url !== null && url !== "") {
                                $http({
                                    method: "GET",
                                    url: url
                                }).then(function (response) {
                                    if (response.status === 200 && "data" in response) {
                                        data = response.data;
                                        dialog.scope.validateImportData(data, "url");
                                    } else {
                                        dialog.scope.error.url = "noAccess";
                                        console.error($filter("translate")("dialogs.error.noAccess"), url, response);
                                    }
                                }, function () {
                                    dialog.scope.error.url = "noAccess";
                                    console.error($filter("translate")("dialogs.error.noAccess"), url);
                                });
                            }
                        },
                        validateStorage: function () {
                            dialog.scope.error.storage = null;
                            dialog.setTransferData("importData", null);

                            var storageId = this.models.storageId;
                            if (!storageId || storageId === null || storageId === "") {
                                dialog.scope.error.storage = "emptyStorageId";
                            }
                        },
                        importStorage: function (_storageId_) {
                            myJson.get(_storageId_).then(
                                function (json) {
                                    if (json !== null) {
                                        localStorageService.set("myJsonId", _storageId_);
                                        dialog.scope.validateImportData(json, "storage");
                                    }
                                },
                                function () {
                                    dialog.scope.error.storage = "noAccessMyJson";
                                    console.error($filter("translate")("page.timesTable.error.noAccessMyJson", {id: id}), json);
                                }
                            );
                        },
                        restoreStorageId: function () {
                            thisScope.openRestore().then(function (_data_) {
                                dialog.scope.models.storageId = _data_.storageId;
                                dialog.scope.error.storage = null;
                            });
                        },

                        validateImportData: function (_data_, _type_) {
                            if (!("times" in _data_)) {
                                dialog.scope.error[_type_] = "noTimes";
                                console.error($filter("translate")("dialogs.error.noTimes"), _data_);
                                return;
                            }

                            thisScope.openConfirm({
                                exportDate: improveTimes.humanReadableDate(_data_.dateEdit, true)
                            }).then(function () {
                                improveTimes
                                    .setScope(drtvScope)
                                    .importData(_data_);
                                
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
                                {%::"dialogs.import.confirmNewData"|translate:data%}\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        data: data || {}
                    }
                });
                return dialog.promise;
            },
            openRestore: function (data) {
                var dialog = dialogService.confirm({
                    tpl: '\
                        <div dialog\
                            data-header="{%::\'dialogs.import.restoreHeader\'|translate%}"\
                            data-footer="{%::\'dialogs.check\'|translate%}">\
                            <section>\
                                <label>{%::"dialogs.labels.userName"|translate%}</label>\
                                <input ng-model="models.userName"\
                                       ng-model-options="{debounce:1000}"\
                                       ng-change="validateValue()"\
                                       ng-init="validateValue()"\
                                       ng-enter="validateValue()"\
                                       select-on-click\
                                       placeholder="{%::\'dialogs.import.enterYourUserName\'|translate%}" />\
                                <small ng-if="error.userName" class="error">\
                                    {%::"dialogs.error." + error.userName|translate%}\
                                </small>\
                            </section>\
                            <section ng-if="isEncrypted">\
                                <label>{%::"dialogs.labels.password"|translate%}</label>\
                                <input ng-model="models.password"\
                                       ng-model-options="{debounce:500}"\
                                       ng-change="validateValue(\'password\')"\
                                       ng-init="validateValue(\'password\')"\
                                       ng-enter="validateAndConfirm()"\
                                       select-on-click\
                                       type="password"\
                                       placeholder="{%::\'dialogs.import.enterYourPassword\'|translate%}" />\
                                <small ng-if="error.password" class="error">\
                                    {%::"dialogs.error." + error.password|translate%}\
                                </small>\
                            </section>\
                        </div>\
                    ',
                    scope: {
                        isEncrypted: false,
                        error: {},
                        models: {
                            userName: localStorageService.get("userName"),
                            password: ""
                        },
                        validateValue: function (_type_) {
                            dialog.setTransferData("userName", null);
                            dialog.setTransferData("storageId", null);
                            dialog.scope.error.userName = null;

                            var userName = this.models.userName,
                                password = this.models.password;
                            if (userName !== null && userName !== "") {
                                myJson.retrieveId(userName, password).then(
                                    function (id) {
                                        dialog.setTransferData("userName", userName);
                                        dialog.setTransferData("storageId", id);
                                        dialog.validate();
                                    },
                                    function (error) {
                                        if (error === "isEncrypted") {
                                            dialog.scope.isEncrypted = true;
                                            return;
                                        } else if (_type_ !== "password") {
                                            dialog.scope.isEncrypted = null;
                                        }
                                        dialog.scope.error[_type_ ? _type_ : "userName"] = error;
                                    }
                                );
                            }
                        }
                    },
                    valid: false,
                    transferData: {
                        userName: null,
                        storageId: null
                    }
                });
                return dialog.promise.then(function (_data_) {
                    localStorageService.set("userName", _data_.userName);
                    return _data_;
                });
            }
        };
        return thisScope;
    })