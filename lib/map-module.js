angular.module('trialsTrackmap', ['ng','ngCookies','angular-gestures','pascalprecht.translate'])

.constant('$basePath','')
//.constant('$basePath','http://localhost/trialstrackmap/')
.constant('zeroTime','0:00.000')
.constant('useLocalFiles',false)

.config(['$translateProvider', function($translateProvider){
    $translateProvider
        .preferredLanguage('en')
        .useLocalStorage()
        .useStaticFilesLoader({
            prefix: 'dist/i18n/',
            suffix: '.json'
        });
}])

.run(function(){
    // disabled the 3000 seconds delay on click when touch ;)
    FastClick.attach(document.body);
})