angular.module("trialsTrackmap")
    .controller("trackMap", function (improveTimes, categories, urlHandler, localStorageService, trackData,
                                      $useLocalFiles, $rootScope, $scope, $filter, $timeout, canvas) {
        urlHandler.setParams(["world", "search", "showTrack", "sbl", "sbr"]);
        $rootScope.selectedWorld = parseInt(urlHandler.get("world") || localStorageService.get("world")) || 2;
        trackData.setWorld($rootScope.selectedWorld);
        $rootScope.otherWorld = trackData.getOtherWorld();
        $scope.worldImage = null;
        $scope.worldAlt = null;


        function setWorldData() {
            var activeWorld = $scope.data.images.trackmaps[$rootScope.selectedWorld];
            $scope.worldImage = $filter("hoster")(activeWorld[$useLocalFiles ? "offline_src" : "src"], $scope.data.hoster);
            $scope.worldAlt = activeWorld.alt;
        }

        $scope.changeWorld = function (newWorld) {
            $rootScope.selectedWorld = parseInt(newWorld);
            urlHandler.set({world: $rootScope.selectedWorld});
            localStorageService.set("world", newWorld);
            trackData.setWorld($rootScope.selectedWorld);
            $scope.trackmapReady = false;
            canvas.isDrawable = false;
            $rootScope.$emit("world:changeStart", newWorld);
        };

        $rootScope.$on("image:loaded", function () {
            canvas.isDrawable = true;
            $rootScope.$emit("world:changed", trackData.getWorld());
        });

        $scope.repeatObject = function (object) {
            return object ? Object.keys(object) : [];
        };

        $scope.handleSidebars = function (event, which, action, forceClose) {
            function handleBar(_which_, _forceClose_) {
                var sidebar = angular.element(document.querySelector(".new-sidebar." + _which_)),
                    key = (_which_ === "left") ? "sbl" : "sbr";
                // open
                if (!_forceClose_ && !sidebar.hasClass("open")) {
                    // check if opposite is open
                    if (action && action.indexOf("toggle") >= 0) {
                        if (handleBar(action.replace("toggle", "").toLowerCase(), true)) {
                            return false;
                        }
                    }
                    sidebar.addClass("open");
                    if (!localStorageService.get(key)) {
                        urlHandler.set({[key]: "on"});
                    }
                    localStorageService.set(key, "on");
                    return false;
                    // close if isnt closed
                } else if (sidebar.hasClass("open")) {
                    sidebar.removeClass("open");
                    urlHandler.set({[key]: false});
                    localStorageService.remove(key);
                    return true;
                }
            }

            if (which === "close") {
                handleBar("left", true);
                handleBar("right", true);
                return false;
            } else if (forceClose) {
                handleBar(which, true);
                return false;
            } else {
                if (event && event.hasOwnProperty("stopPropagation")) {
                    event.stopPropagation();
                }
                handleBar(which);
            }
        };

        $scope.visibility = function (variable) {
            $scope[variable] = $scope[variable] ? false : true;
        };

        $scope.searchTrack = urlHandler.get("search") || "";
        $scope.clearSearch = function () {
            $scope.searchTrack = "";
        };

        $rootScope.$on("handleSidebars", function ($evt, event, which, action, forceClose) {
            $scope.handleSidebars(event, which, action, forceClose);
        });

        if (urlHandler.get("sbl") || localStorageService.get("sbl")) {
            $scope.handleSidebars(null, "left");
        }
        if (urlHandler.get("sbr") || localStorageService.get("sbr")) {
            $scope.handleSidebars(null, "right");
        }

        $rootScope.$on("changeWorld", function (event, worldId) {
            $scope.changeWorld(worldId);
        });

        $rootScope.$on("data:loaded", function () {
            var data = urlHandler.get("search");
            $scope.tracksInTiers = trackData.getTracksInTiers(data, "data:loaded");
            $scope.tracksInActiveWorld = trackData.getData("listedTracks");
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");

            $scope.$watch("searchTrack", function (data) {
                urlHandler.set({search: data});
                $scope.tracksInTiers = trackData.getTracksInTiers(data, "searchTrack");
                $scope.tracksInActiveWorld = trackData.getData("listedTracks");
                $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
            });

            setWorldData();
        });

        $rootScope.$on("filter:tracks", function (event, filterCatId) {
            categories.setFilterCatId(filterCatId);
            $scope.tracksInTiers = trackData.getTracksInTiers(null, "filter:tracks");
            $scope.tracksInActiveWorld = trackData.getData("listedTracks");
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
        });

        $rootScope.$on("world:changeStart", function (event, newWorld) {
            setWorldData(newWorld);
            var data = urlHandler.get("search");
            $scope.tracksInTiers = trackData.getTracksInTiers(data, "world:changed");
            $scope.tracksInActiveWorld = trackData.getData("listedTracks");
            $rootScope.otherWorld = trackData.getOtherWorld();
            $scope.tracksInOtherWorld = trackData.getData("otherWorldTracks");
        });

        $rootScope.$on("data:loaded", function () {
            var trackParam = urlHandler.get("showTrack"),
                data = trackParam ? trackParam.split("-") : [],
                trackId = data[data.length - 1],
                track;

            $rootScope.$on("world:ready", function () {
                track = trackData.getTrackByID(parseInt(trackId));
                if (trackId && trackId !== "0") {
                    if (trackData.getWorld() !== track.world) {
                        var removeListener = $rootScope.$on("world:changed", function () {
                            canvas.handleShowTrackOnMap(track, true);
                            removeListener();
                        });
                        $scope.changeWorld(track.world);
                    } else {
                        canvas.handleShowTrackOnMap(track, true);
                    }
                }
            });
        });
    });