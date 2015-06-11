angular.module('trialsTrackmap')
.controller('seasons', function ($rootScope, $scope, loader, $document) {
    $scope.data = {};
    $scope.filteredArray = [];

    function collectSummaries(){

        $scope.filteredArray.forEach(function(season){
            season.summary = {
                coins:0,
                gems:0,
                extras:[]
            };

            season.prizes.forEach(function(level){
                season.summary.coins += level.coins;
                season.summary.gems += level.gems;
                if('extra' in level){
                    // create title and css selector
                    switch(level.extra_type){
                        case 'donkey':
                            level.title = $scope.data.prizes.donkey+' '+level.extra;
                            level.css_selector = level.extra_type;
                        break;
                        case 'paintjob':
                            level.title = $scope.data.prizes.paintjob[level.extra];
                            level.css_selector = level.extra_type+'-'+level.extra;
                        break;
                    }

                    // concat prizes
                    var foundDonkey = season.summary.extras.filter(function(extra){return extra.css_selector == 'donkey'});
                    if(level.extra_type == 'donkey' && foundDonkey.length > 0) {
                        season.summary.extras[0].amount += 1;
                    } else {
                        season.summary.extras.push({title: level.title, css_selector: level.css_selector, amount: 1});
                    }
                }
            });

        });
    }


    var mouseWheelEvt = function (event) {
        console.log('scroll hori')
        if ($document[0].body.doScroll)
            $document[0].body.doScroll(event.wheelDelta>0?"left":"right");
        else if ((event.wheelDelta || event.detail) > 0)
            $document[0].body.scrollLeft -= 50;
        else
            $document[0].body.scrollLeft += 50;

        return false;
    };
    $document[0].body.addEventListener('mousewheel', mouseWheelEvt);

    loader.get(['gfx','seasons']).then(function(data){
        $scope.data.images = data.images;
        $scope.data.imagehoster = data.imagehoster;
        $scope.data.prizes = data.prizes;
        $scope.data.seasons = data.seasons;

        $scope.filteredArray = $scope.data.seasons.reverse();

        collectSummaries();

        $rootScope.$emit('data:loaded',$scope.data);
    });

})