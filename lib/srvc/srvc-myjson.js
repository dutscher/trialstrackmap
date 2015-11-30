/*
 $.get("https://api.myjson.com/bins/:id")

 $.ajax({
 url:"https://api.myjson.com/bins",
 type:"POST",
 data:'{"key":"value"}',
 contentType:"application/json; charset=utf-8",
 dataType:"json",
 success: function(data, textStatus, jqXHR){

 }
 });

 $.ajax({
 url:"https://api.myjson.com/bins/:id",
 type:"PUT",
 data:'{"key_updated":"value_updated"}',
 contentType:"application/json; charset=utf-8",
 dataType:"json",
 success: function(data, textStatus, jqXHR){

 }
 });
 */
angular.module("trialsTrackmap")
    .service("myJson", function (localStorageService, security, $q, $http, $filter) {
        var url = "https://api.myjson.com/bins",
            storageParam = "myJsonId",
            idStorageID = "3imst",
            worldRecordsID = "3s1ot",
            id = null,
            cachePromise = {
                wrData: null,
                backupList: null
            };

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        return {
            getId: function () {
                return localStorageService.get(storageParam);
            },
            create: function (data) {
                return $http.post(url, data).then(
                    function (response) {
                        if (response.status === 201) {
                            if ("uri" in response.data) {
                                id = response.data.uri.replace(/.*\/([\w]{0,10})$/, "$1");
                                localStorageService.set(storageParam, id);
                                alert($filter("translate")("page.timesTable.improve.successfullSaved", {id: id}));
                                return true;
                            }
                        }
                        return $q.reject();
                    }
                );
            },
            get: function (id) {
                return $http.get(url + "/" + ( id || this.getId() )).then(
                    function (response) {
                        if (response.status === 200) {
                            return response.data;
                        }
                        return $q.reject();
                    }
                );
            },
            save: function (data, userName, password, autoExport) {
                var thisScope = this,
                    savePromise;
                
                // first call and post
                if (this.getId() === null) {
                    savePromise = this.create(data);
                // update with a put
                } else {
                    data.dateEdit = (new Date()).getTime();

                    savePromise = $http.put(url + "/" + this.getId(), data).then(
                        function (response) {
                            if (response.status === 200) {
                                return $q.resolve("successfullUpdated", {id: thisScope.getId()});
                            }
                            return $q.reject();
                        }
                    );
                }

                if (!autoExport && userName) {
                    return this.backupID(savePromise, userName, password);
                } else {
                    return savePromise;
                }
            },
            getBackupList: function () {
                if(cachePromise.backupList === null) {
                    cachePromise.backupList = $http.get(url + "/" + idStorageID);
                }
                return cachePromise.backupList;
            },
            retrieveId: function (userName, password) {
                var getIDsPromise = this.getBackupList(),
                    listOfIds, id, isPasswordProtected, decryptedId;

                return getIDsPromise.then(function (response) {
                    listOfIds = response.data;
                    if (userName in listOfIds) {
                        id = listOfIds[userName];
                        isPasswordProtected = id.length > 5 && endsWith(id, "=");

                        if (!isPasswordProtected) {
                            return id;
                        } else if(!password || password === null || password === "") {
                            return $q.reject("isEncrypted");
                        } else if (password !== null && password !== "") {
                            decryptedId = security.aesDecrypt(id, password);
                            if (decryptedId !== "") {
                                return decryptedId;
                            } else {
                                return $q.reject("wrongPassword");
                            }
                        } else {
                            return $q.reject("emptyPassword");
                        }
                    } else {
                        return $q.reject("userNameNotFound", {userName: userName});
                    }
                });
            },
            backupID: function (savePromise, userName, password) {
                var thisScope = this,
                    idForBackup = this.getId(),
                    getIDsPromise = this.getBackupList(),
                    isValidUserName = userName !== "" && userName !== null,
                    isValidPassword = password !== "" && password !== null;

                if(isValidUserName) {
                    localStorageService.set("userName", userName);
                }

                return savePromise.then(function (saveBackup) {
                    if (!saveBackup) {
                        return true;
                    }
                    
                    idForBackup = thisScope.getId();

                    return getIDsPromise.then(function (response) {
                        var listOfIds = response.data;
                        if (!(userName in listOfIds)) {
                            // store id
                            listOfIds[userName] = isValidPassword
                                ? security.aesEncrypt(idForBackup, password)
                                : idForBackup;

                            // save
                            return $http.put(url + "/" + idStorageID, listOfIds);
                        }
                        return true;
                    })
                })
            },
            getWRData: function () {
                if(cachePromise.wrData === null) {
                    cachePromise.wrData = $http.get(url + "/" + worldRecordsID).then(function (response) {
                        return response.data;
                    });
                }
                return cachePromise.wrData;
            },
            setWRData: function (data) {
                return $http.put(url + "/" + worldRecordsID, data);
            }
        }
    })