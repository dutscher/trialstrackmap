angular.module('trialsTrackmap')
.controller('trackmap', function ($rootScope, $scope, $filter, loader) {

        $scope.data = {};

        loader.get(['map','gfx']).then(function(data){
            Object.keys(data.database).forEach(function(_dataKeyName_){
                $scope.data[_dataKeyName_] = data.database[_dataKeyName_];
            });

            $scope.data.images = data.images;
            $scope.data.imagehoster = data.imagehoster;

            $rootScope.$emit('data:loaded',$scope.data);
        });

        $scope.repeatObject = function(object){
            return Object.keys(object);
        };

        $scope.getTracks = function(searchTrack){
            var tracks = $scope.data.tracks,
                dataCubeCat = 6,
                filteredArray = [],
                tiersObject = {};

            // walk through tracks
            tracks.forEach(function(track){
                if(searchTrack && searchTrack != '' && track.i18n.toLowerCase().indexOf(searchTrack) == -1){
                    return;
                }

                var trackCats = track.cats.split(',');
                // create tier
                if(!(track.tier in tiersObject)) {
                    tiersObject[track.tier] = {
                        number: track.tier,
                        cats: {}
                    };
                }
                // create cats
                trackCats.forEach(function(cat){
                    if(cat == dataCubeCat) {
                        return;
                    }

                    var catClass = $scope.data.map.cats[cat-1].class;

                    if(!(catClass in tiersObject[track.tier].cats)) {
                        tiersObject[track.tier].cats[catClass] = [];
                    }
                    tiersObject[track.tier].cats[catClass].push(track);
                });
            });

            if(Object.keys(tiersObject).length > 0){
                Object.keys(tiersObject).forEach(function(tier){
                    filteredArray.push(tiersObject[tier]);
                });
            }

            return filteredArray;
        };

        $scope.handleSidebars = function(event, which, action, forceClose){
            function handleBar(_which_, _forceClose_){
                var sidebar = angular.element(document.querySelector('.new-sidebar.'+_which_));

                // open
                if (!_forceClose_ && !sidebar.hasClass('open')) {
                    // check if opposite is open
                    if(action && action.indexOf('toggle') >= 0){
                        if(handleBar(action.replace('toggle','').toLowerCase(),true))
                            return false;
                    }
                    sidebar.addClass('open');
                    return false;
                    // close if isnt closed
                } else if(sidebar.hasClass('open')) {
                    sidebar.removeClass('open');
                    return true;
                }
            }

            if(which == 'close'){
                handleBar('left',true);
                handleBar('right',true);
                return false;
            } else if(forceClose) {
                handleBar(which,true);
                return false;
            } else {
                event.stopPropagation();
                handleBar(which);
            }
        };

        function mergeTrackData(onlyI18n){
            $scope.data.tracks.forEach(function(track, index){
                if(!onlyI18n) {
                    var trackId = track.id;

                    // times
                    var foundTimes = $scope.data.times.filter(function(_track_){
                        return _track_.id == trackId ;
                    });

                    if (foundTimes.length > 0) {
                        delete foundTimes[0].id;
                        track.times = foundTimes[0];
                    }
                    // parts
                    var foundParts = $scope.data.parts.filter(function(_track_){
                        return _track_.id == trackId;
                    });

                    if (foundParts.length > 0) {
                        track.parts = foundParts[0].p;
                        if('g' in foundParts[0]){
                            track.gems = foundParts[0].g;
                        }
                    }

                    switch(true){
                        case track.tier == 1:
                            track.fuel = 5;
                            track.gems = 'gems' in track ? track.gems : 5;
                        break;
                        case track.tier == 2:
                            track.fuel = 7;
                            track.gems = 'gems' in track ? track.gems : 7;
                        break;
                        case track.tier == 3:
                            track.fuel = 10;
                            track.gems = 'gems' in track ? track.gems : 10;
                        break;
                    }
                }

                track.i18n = $filter('translate')('tracks.'+track.id)+(track.level ? ' (level '+track.level+')': '');
            });
        }

        $scope.visibility = function(variable){
            $scope[variable] = $scope[variable] ? false : true;
        };

        $rootScope.$on('handleSidebars', function($evt, event, which, action, forceClose){
            $scope.handleSidebars(event, which, action, forceClose);
        });

        $rootScope.$on('data:loaded', function(data){
            mergeTrackData();

            $scope.tierlegend = $scope.getTracks();

            $scope.$watch('searchTrack',function(data){
                $scope.tierlegend = $scope.getTracks(data);
            });

            $rootScope.$on('$translateChangeSuccess', function(){
                mergeTrackData(true);
            });
        });
    })