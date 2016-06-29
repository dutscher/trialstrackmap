angular.module("trialsTrackmap")
    .service("dialogService", function (ngDialog, $rootScope, $q) {

        return {
            confirm: function (config) {
                var scope = $rootScope.$new(),
                    dialogScope = null,
                    thisScope;

                if ("scope" in config) {
                    // merge data to scope
                    var scopeKeys = Object.keys(config.scope);
                    scopeKeys.forEach(function (key) {
                        scope[key] = config.scope[key];
                    });
                }

                thisScope = {
                    scope: scope,
                    promise: ngDialog.openConfirm({
                        template: config.tpl || "",
                        scope: scope,
                        plain: true,
                        showClose: true,
                        closeByEscape: true,
                        controller: function (_$scope_) {
                            dialogScope = _$scope_;
                            // set init validation
                            dialogScope.valid = config.valid !== false;
                            // set init data
                            dialogScope.transferData = config.transferDataInit || {};

                            dialogScope.validateAndConfirm = function () {
                                thisScope.validate();
                                if (dialogScope.valid) {
                                    dialogScope.confirm(dialogScope.transferData);
                                }
                            };
                        }
                    }),
                    setTransferData: function (key, value) {
                        dialogScope.transferData[key] = value;
                    },
                    getTransferData: function () {
                        return dialogScope.transferData;
                    },
                    validate: function () {
                        var allData = Object.keys(dialogScope.transferData),
                            isAllValid = true;

                        allData.forEach(function (key) {
                            if (dialogScope.transferData[key] === null) {
                                isAllValid = false;
                            }
                        });

                        dialogScope.valid = isAllValid;

                        return isAllValid;
                    },
                    isEmpty: function (_var_) {
                        return !_var_ || _var_ === null || _var_ === ""
                    },
                    close: function (data) {
                        if (data) {
                            data.reject = true;
                        }
                        dialogScope.confirm(data);
                        dialogScope.closeThisDialog();
                    },
                    isReject: function (data) {
                        return !("reject" in data) ? true : this.getReject()
                    },
                    getReject: function () {
                        return $q.reject();
                    },
                    isNumeric: function (n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }
                };

                return thisScope;
            }
        }
    })