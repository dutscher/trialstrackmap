angular.module("trialsTrackmap")
    .service("urlHandler", function (localStorageService, $window) {

        var params = ["search"],
            getActiveParams = function () {
                return queryStringToJSON(
                    location.hash !== ""
                        ? location.hash.replace("#", "")
                        : (location.search !== ""
                        ? location.search.replace("?", "")
                        : "")
                );
            },
            activeParams = getActiveParams();

        $window.addEventListener("hashchange", function () {
            activeParams = getActiveParams();
        });

        function queryStringToJSON (string) {
            var pairs = string !== "" ? string.split("&") : [];

            var result = {};
            pairs.forEach(function (pair) {
                pair = pair.split("=");
                result[pair[0]] = decodeURIComponent(pair[1] || "");
            });

            return JSON.parse(JSON.stringify(result));
        }

        function getLocationParam (param, defaultValue) {
            return param in activeParams
                ? activeParams[param]
                : defaultValue ? defaultValue : "";
        }

        function setLocationHash (obj) {
            // update the new params
            Object.keys(obj).forEach(function (param) {
                if (params.indexOf(param) >= 0) {
                    if (obj[param] && obj[param] !== "")
                        activeParams[param] = obj[param];
                    else
                        delete activeParams[param];
                }
            });

            // compare the active params to querystring
            var newHash = "";
            Object.keys(activeParams).forEach(function (param, index) {
                newHash += (index === 0 ? "" : "&") + param + "=" + activeParams[param];
            });

            history.pushState("", "", newHash ? "#" + newHash : " ");
            //location.hash = newHash;
        }

        return {
            setParams: function (_params_) {
                params = params.concat(_params_);
            },
            get: getLocationParam,
            set: setLocationHash,
            read: function (param) {
                return localStorageService.get(param);
            },
            save: function (param, value) {
                localStorageService.set(param, value);
                return true;
            }
        };
    });