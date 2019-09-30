angular.module("trialsTrackmap")
    .service("bonxyApi",
    function (localStorageService, security, $q, $http) {
        var host = "https://api.myjson.com/bins/",
            leadersUrl = host + "x6bsp",
            searchUrl = "{{os}}/profile/search?nick={{profileName}}",
            profileUrl = host + "10texl",
            profileDonkeyUrl = host + "{{os}}/profile/{{id}}/donkey.json",
            profileCrazyUrl = host + "{{os}}/profile/{{id}}/crazy.json",
            storageParam = "bonxyProfileId",
            cachePromise = {
                searchProfile: null,
                getProfile: null,
                getProfileDonkey: null,
                getProfileCrazy: null
            };

        var thisScope = {
            getStorageParam: function () {
                return storageParam;
            },
            getProfileId: function () {
                return localStorageService.get(storageParam);
            },
            setProfileId: function (_profileId_) {
                localStorageService.set(storageParam, _profileId_);
            },
            searchProfileName: function (_os_, _profileName_) {
                var data;
                if (cachePromise.searchProfile === null) {
                    cachePromise.searchProfile = $http.get(
                        searchUrl
                            .replace("{{os}}", _os_)
                            .replace("{{profileName}}", _profileName_)
                    );
                }
                return cachePromise.searchProfile.then(function (response) {
                    data = response.data;

                    if (data.total_count === 1) {
                        cachePromise.searchProfile = null;
                        return data.items[0];
                    } else if (data.total_count > 1) {
                        cachePromise.searchProfile = null;
                        return $q.reject("tooMuchMatches", data.total_count);
                    } else if (data.total_count === 0) {
                        cachePromise.searchProfile = null;
                        return $q.reject("noMatches");
                    }
                });
            },
            getProfileData: function (_os_, _profileId_) {
                var data;
                if (cachePromise.getProfile === null) {
                    cachePromise.getProfile = $http.get(
                        profileUrl
                    );
                }

                // get normal
                cachePromise.getProfile.then(function (response) {
                    data = response.data;

                    if (data.hasOwnProperty("tracks") && data.tracks.length > 1) {
                        cachePromise.getProfile = null;
                        return data;
                    } else {
                        cachePromise.getProfile = null;
                        return $q.reject("noTrackDataFound");
                    }
                });

                return $q.all([cachePromise.getProfile])
                    .then(function (dataAll) {
                        return {
                            name: dataAll[0].data.name,
                            date: new Date().toString(),//dataAll[0].data.date,
                            rank: dataAll[0].data.profile.rank,
                            tracks: dataAll[0].data.tracks,
                        }
                    });
            },

            getLeaders: function () {
                return $http.get(leadersUrl)
                    .then(function (response) {
                        return thisScope.convertToOurs(response.data);
                    });
            },

            trackConvert: function(trackData){
                return {
                    "myRank": trackData.rank,
                    "myRankPercent": trackData.percent,
                    "myTime": trackData.drivetime,
                    "myBike": trackData.bike + "-" + trackData.paintjob,
                    "myFaults": trackData.errors
                };
            },

            convertToOurs: function (_data_) {
                var data = {
                    times: {},
                    rider: {}
                };

                function values(o) {
                    return Object.keys(o).map(function (k) {
                        return o[k]
                    })
                }

                function getRiderID(riderName) {
                    var nextRiderID = Object.keys(data.rider).length + 1,
                        foundedRider = -1,
                        riderID = -1,
                        isRiderExists = values(data.rider).filter(function (rider, index) {
                            var exists = rider === riderName;
                            if (exists) {
                                foundedRider = index + 1;
                            }
                            return exists
                        });

                    if (isRiderExists.length === 0) {
                        data.rider[nextRiderID] = riderName;
                        riderID = nextRiderID;
                    } else {
                        riderID = foundedRider;
                    }

                    return riderID;
                }

                function getWRData(__data__) {
                    if (__data__) {
                        return getRiderID(__data__.ridr)
                            + ":" + __data__.time
                            + ":" + __data__.bkId
                            + ":" + 0;
                    }
                    return ":";
                }

                angular.forEach(_data_, function (track, trackID) {
                    var WRTimes = getWRData(track.android.n);// android.normal
                    WRTimes += "|" + getWRData(track.android.d);// android.donkey
                    WRTimes += "|" + getWRData(track.android.c);// android.crazy
                    WRTimes += "|" + getWRData(track.ios.n);// ios.normal
                    WRTimes += "|" + getWRData(track.ios.d);// ios.donkey
                    WRTimes += "|" + getWRData(track.ios.c);// ios.crazy
                    // add to data
                    data.times[trackID] = WRTimes;
                });

                return data;
            }
        };

        return thisScope;
    })