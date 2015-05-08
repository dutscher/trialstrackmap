angular.module('trialsTrackmap')
.controller('trackTimesEdit', function($basePath, $q, $rootScope, $scope, $http, editTimes){
    var timesDB = {},
        pageParams = ['showZero','medal','part','partLevel','search','cat'],
        activeParams = queryStringToJSON(location.hash != '' ? location.hash.replace('#','') : '');

    function queryStringToJSON(string) {
        var pairs = string != '' ? string.split('&') : [];

        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
    }

    function getLocationParam(param, defaultValue){
        return param in activeParams ? activeParams[param] : defaultValue ? defaultValue : '';
    }

    function setLocationHash(obj){
        // update the new params
        Object.keys(obj).forEach(function(param){
            if(pageParams.indexOf(param) >= 0){
                if(obj[param] != '')
                    activeParams[param] = obj[param];
                else
                    delete activeParams[param];
            }
        });

        // compare the active params to querystring
        var newHash = '';
        Object.keys(activeParams).forEach(function(param,index){
            newHash += (index == 0 ? '' : '&')+param+'='+activeParams[param];
        });

        location.hash = newHash;
    }

    $scope.publicChanges = 0;

    // handle promises
    $rootScope.$on('data:loaded', function(event,data){
        timesDB = data.times;
    });

    $scope.showZero = getLocationParam('showZero',false);
    $scope.medal = getLocationParam('medal');
    if($scope.medal != ''){
        $scope.showZero = true;
    }

    $scope.toggleShowZero = function(event){
        var checkbox = event.target;
        $scope.showZero = checkbox.checked;

        setLocationHash({showZero:$scope.showZero});
    };
    $scope.setMedal = function(event, medal){
        var checkbox = event.target;
        $scope.medal = checkbox.checked ? medal : '';
        if(!$scope.showZero)
            $scope.showZero = true;

        setLocationHash({medal:$scope.medal});
    };
    $scope.isChecked = function(type){
        switch(type){
            case 'zero':
                return $scope.showZero;
                break;
            case 'silver':
            case 'gold':
            case 'platinum':
                return $scope.showZero && $scope.medal == type;
                break;
        }
    };

    $scope.selectedCat = getLocationParam('cat');
    $scope.setCat = function(){
        setLocationHash({cat:$scope.selectedCat});
    };

    $scope.selectedPart = getLocationParam('part');
    $scope.selectedPartLevel = getLocationParam('partLevel');
    $scope.setParts = function(changeLevel){
        if(changeLevel){
            setLocationHash({partLevel:$scope.selectedPartLevel});
            return false;
        }
        setLocationHash({part:$scope.selectedPart});
    };

    $scope.search = getLocationParam('search');
    $scope.saveSearch = function(){
        setLocationHash({search:$scope.search});
    };

    $scope.editTimes = editTimes;
})