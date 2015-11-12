angular.module("trialsTrackmap", ["ng", "ngCookies", "angular-gestures", "pascalprecht.translate", "ngSanitize", "LocalStorageModule"])
.constant("$basePath", "")
//.constant("$basePath","http://localhost/trialstrackmap/")
.constant("zeroTime", "0:00.000")
.constant("useLocalFiles", false)

.config(function (localStorageServiceProvider, $translateProvider, $interpolateProvider) {

    localStorageServiceProvider
        .setPrefix("trackmap");

    $translateProvider
        .preferredLanguage("en")
        .useLocalStorage()
        .useStaticFilesLoader({
            prefix: (location.pathname.indexOf("dist/") >= 0 ? "" : "dist/") +"i18n/",
            suffix: ".json"
        });

    $interpolateProvider
        .startSymbol("{%")
        .endSymbol("%}");
})

.run(function () {
    // disabled the 3000 seconds delay on click when touch ;)
    FastClick.attach(document.body);
})