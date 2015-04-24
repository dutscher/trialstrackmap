angular.module('trialsTrackmap')
.controller('seasons', function ($rootScope, $scope, loader) {

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
                    var foundDonkey =  season.summary.extras.filter(function(extra){return extra.type == 'donkey'});
                    if(level.extra_type == 'donkey' && foundDonkey.length > 0)
                        season.summary.extras[0].amount += 1;
                    else
                        season.summary.extras.push({name: level.extra, type: level.extra_type, amount: 1});
                }
            });
        });
    }

    loader.get(['gfx','seasons']).then(function(data){
        $scope.data.images = data.images;
        $scope.data.imagehoster = data.imagehoster;
        $scope.data.seasons = data.seasons;

        $scope.filteredArray = $scope.data.seasons.reverse();

        collectSummaries();

        $rootScope.$emit('data:loaded',$scope.data);
    });

})