angular.module("trialsTrackmap", [
    "ng", "ngCookies", "ngSanitize",
    "ngDialog", "angular-gestures", "pascalprecht.translate", "LocalStorageModule"
])
.constant("$basePath", "")
//.constant("$basePath","http://localhost/trialstrackmap/")
.constant("zeroTime", "0:00.000")
.constant("trackRadius", 70)
.constant("useLocalFiles", false)
.constant("languages", ["en","de","fr","ru","es","it","pt"])

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