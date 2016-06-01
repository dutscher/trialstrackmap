angular.module("trialsTrackmap")
    .service("tflforoApi",
    function (localStorageService, security, $q, $http, $filter,
              improveTimes) {

        var searchUrl = "http://tf.lforo.com/{{os}}/profile/search?nick={{profileName}}",
            profileUrl = "http://tf.lforo.com/{{os}}/profile/{{id}}.json",
            storageParam = "tflforoProfileId",
            cachePromise = {
                searchProfile: null,
                getProfile: null
            };

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        return {
            getStorageParam: function () {
                return storageParam;
            },
            getProfileId: function () {
                return localStorageService.get(storageParam);
            },
            setProfileId: function(_profileId_){
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
                            .replace("{{os}}", _os_)
                            .replace("{{id}}", _profileId_)
                    );
                }
                return cachePromise.getProfile.then(function (response) {
                    data = response.data;

                    if (data.hasOwnProperty("tracks") && data.tracks.length > 1) {
                        cachePromise.getProfile = null;
                        return data;
                    } else {
                        cachePromise.getProfile = null;
                        return $q.reject("noTrackDataFound");
                    }
                });
            }
        }
    })