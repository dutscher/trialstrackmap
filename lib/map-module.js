angular.module("trialsTrackmap", [
    "ng", "ngCookies", "ngSanitize",
    "ngDialog", "angular-gestures", "pascalprecht.translate", "LocalStorageModule"
])
    .constant("$useLocalFiles", false)
    .constant("$useLocalJsonFiles", false)
    .constant("$basePath", "")//"http://localhost/trialstrackmap")
    .constant("$lastBackupWRJson", "/database/backup/wrs/20160123.135428.json")
    .constant("$zeroTime", "0:00.000")
    .constant("$trackRadius", 80)
    .constant("$languages", ["en", "de", "fr", "ru", "es", "it", "br"])

    .config(function (localStorageServiceProvider, $translateProvider, $interpolateProvider) {
        localStorageServiceProvider
            .setPrefix("trackmap");

        $translateProvider
            .preferredLanguage("en")
            .useLocalStorage()
            .useStaticFilesLoader({
                prefix: (location.pathname.indexOf("dist/") >= 0 ? "" : "dist/") + "i18n/",
                suffix: ".json"
            });

        $interpolateProvider
            .startSymbol("{%")
            .endSymbol("%}");
    })

    .run(function () {
        // disabled the 3000 seconds delay on click when touch ;)
        FastClick.attach(document.body);

        if (window.hasOwnProperty("Snowflakes")) {
            var sf = new Snowflakes({
                color: "#61d4d7",
                container: document.body
            });
        }
    });