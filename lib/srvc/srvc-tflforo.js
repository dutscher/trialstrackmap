angular.module("trialsTrackmap")
    .service("tflforoApi",
    function (localStorageService, security, $q, $http, $filter,
              improveTimes) {

        var searchUrl = "http://tf.lforo.com/{{os}}/profile/search?nick={{profileName}}",
            profileUrl = "http://tf.lforo.com/android/profile/{{id}}.json",
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
            searchProfileName: function (profileName) {
                var data;
                if (cachePromise.searchProfile === null) {
                    cachePromise.searchProfile = $http.get(
                        searchUrl
                            .replace("{{os}}", improveTimes.getMode())
                            .replace("{{profileName}}", profileName)
                    );
                }
                return cachePromise.searchProfile.then(function (response) {
                    data = response.data;

                    if (data.total_count === 1) {
                        return data.items[0];
                    } else if (data.total_count > 1) {
                        return $q.reject("tooMuchMatches");
                    } else if (data.total_count === 0) {
                        return $q.reject("noMatches");
                    }
                });
            },
            getProfileData: function (_profileId_) {
                var data;
                if (cachePromise.getProfile === null) {
                    cachePromise.getProfile = $http.get(
                        profileUrl
                            .replace("{{id}}", _profileId_)
                    );
                }
                return cachePromise.getProfile.then(function (response) {
                    data = response.data;

                    if (data.hasOwnProperty("tracks") && data.tracks.length > 1) {
                        return data;
                    } else {
                        return $q.reject("noTrackDataFound");
                    }
                });
            }
        }
    })