angular.module("trialsTrackmap")
    .service("items", function ($filter) {

        var dataCubesId = 6,
            treasurePieceId = 19,
            eggsId = 25,
            youtubeVideosId = 21,
            trackData,
            defaultModalType = "startline";

        function convertYoutube(videoRaw) {
            // only id
            // d9dcQwzfoAE
            // with host
            // 1|d9dcQwzfoAE
            // with host and video type
            // 1|d9dcQwzfoAE|2
            var types = trackData.media.youtube.types,
                tutorialGuys = trackData.media.youtube.hosts,
                hasHost = videoRaw.indexOf("|") >= 0,
                videoArr = videoRaw.split("|");

            return {
                host: (hasHost ? tutorialGuys[videoArr[0]].name : ""),
                hostUrl: (hasHost ? tutorialGuys[videoArr[0]].url : ""),
                url: "#3/" + videoArr[hasHost ? 1 : 0],
                type: videoArr.length === 3 ? (types[videoArr[2]] != "" ? "-" : "") + types[videoArr[2]] : "-" + types["1"]
            }
        }

        return {
            setTrackData: function (_data_) {
                trackData = _data_;
            },
            getSpecialsCats: function () {
                return [dataCubesId, treasurePieceId, youtubeVideosId, eggsId];
            },
            // lib/filter/fltr-cat-and-tier-tracks.js
            isSpecialCat: function (_catId_) {
                return this.getSpecialsCats().indexOf(_catId_) !== -1;
            },
            // lib/srvc/srvc-trackdata.js
            addItemsToTrack: function (track) {
                var trackId = track.id;

                // startline
                if (trackId in trackData.trackdata.startlines) {
                    track.startline = "#1/" + trackData.trackdata.startlines[trackId];
                }

                // datacube
                if (trackId in trackData.media.datacubes) {
                    track.datacube = "#1/" + trackData.media.datacubes[trackId];
                    track.categories.push(dataCubesId);
                }

                // candys
                if (trackId in trackData.media.candies) {
                    track.candy = trackData.media.candies[trackId];
                }

                // treasure, outdated because only for event
                //if (trackId in trackData.media.treasures) {
                //    var items = trackData.media.treasures[trackId];
                //    track.treasure = angular.isArray(items) ? items : [items];
                //    track.categories.push(treasurePieceId);
                //}

                // eggs
                if (trackId in trackData.media.eggs) {
                    var items = trackData.media.eggs[trackId];
                    track.eggs = angular.isArray(items) ? items : [items];
                    track.categories.push(eggsId);
                }

                // youtube
                if (trackId in trackData.media.youtube.videos) {
                    var videos = trackData.media.youtube.videos[trackId];
                    track.youtube = [];
                    if (typeof videos == "string") {
                        track.youtube.push(convertYoutube(trackData.media.youtube.videos[trackId]));
                    } else {
                        videos.forEach(function (video) {
                            track.youtube.push(convertYoutube(video));
                        });
                    }
                    track.categories.push(youtubeVideosId);
                }
            },
            // lib/track-map/drtv-gallery-modal.js
            getModalItemsList: function () {
                return '\
                    <i class="startline" show-track-in-modal="startline" ng-model="track"></i>\
                    <span class="item-list" data-track="track" data-type="eggs"></span>\
                    <span class="youtube-list" data-track="track"></span>\
                ';

                return '\
                    <i class="startline" show-track-in-modal="startline" ng-model="track"></i>\
                    <span class="item-list" data-track="track" data-type="treasure"></span>\
                    <span class="youtube-list" data-track="track"></span>\
                    <i class="data-cube" ng-if="track.datacube" show-track-in-modal="datacube"></i>\
                    <span class="item-list" data-track="track" data-type="candy"></span>\
                '
            },
            // lib/track-map/drtv-track-in-sidebar.js
            getSidebarItemsList: function () {
                return '\
                   <span class="item-list" data-track="data.track" data-type="eggs" data-with-badge="true"></span>\
                   <span class="youtube-list" data-track="track" data-with-badge="true"></span>\
                ';

                return '\
                    <span class="item-list" data-track="data.track" data-type="treasure" data-with-badge="true"></span>\
                    <span class="item-list" data-track="data.track" data-type="eggs" data-with-badge="true"></span>\
                    <span class="youtube-list" data-track="track" data-with-badge="true"></span>\
                    <i class="data-cube" ng-if="data.track.datacube" show-track-in-modal="datacube"></i>\
                    <span class="item-list" data-track="data.track" data-with-badge="true" data-type="candy"></span>\
                ';
            },
            // lib/track-map/drtv-show-track-in-modal.js
            getOpenForModalType: function (_track_, _catId_) {
                var type = defaultModalType;

                switch (true) {
                    case (_catId_ === dataCubesId && _track_.hasOwnProperty("datacube")):
                        type = "datacube:0";
                        break;
                    case (_catId_ === treasurePieceId && _track_.hasOwnProperty("treasure")):
                        type = "treasure:0";
                        break;
                    case (_catId_ === eggsId && _track_.hasOwnProperty("eggs")):
                        type = "eggs:0";
                        break;
                    case (_catId_ === youtubeVideosId && _track_.hasOwnProperty("youtube")):
                        type = "youtube:0";
                        break;
                }

                return type;
            },
            // lib/track-map/drtv-show-track-in-modal.js
            getTitleForModal: function (type, scope) {
                var data = {},
                    index = type ? type.split(":")[1] : 0;

                if (!type) {
                    return data;
                }

                if (type === "look-on-filter") {
                    type = defaultModalType;
                }

                switch (true) {
                    case defaultModalType === type:
                        data.typeName = defaultModalType;
                        break;
                    case type.indexOf("datacube") >= 0:
                        data.typeName = "datacubeGuide";
                        break;
                    case type.indexOf("candy") >= 0:
                        if (scope.track.candy) {
                            data.title = $filter("translate")("page.trackDetail.candy")
                                + ": "
                                + scope.track.candy[index].title;
                        } else {
                            data.title = "";
                        }
                        break;
                    case type.indexOf("treasure") >= 0:
                        if (scope.track.treasure) {
                            data.title = scope.track.treasure[index].title;
                        } else {
                            data.title = "";
                        }
                        break;
                    case type.indexOf("eggs") >= 0:
                        if (scope.track.eggs && scope.track.eggs[index]) {
                            data.title = scope.track.eggs[index].title;
                        } else {
                            data.title = "";
                        }
                        break;
                    case type.indexOf("youtube") >= 0:
                        var videoType = scope.track.youtube[index].type;
                        data.title = $filter("translate")("page.trackDetail.walkthrough" + videoType)
                            + " "
                            + $filter("translate")("page.trackDetail.walkthroughBy")
                            + " "
                            + scope.track.youtube[index].host;
                        break;
                }

                return data;
            },
            // lib/track-map/drtv-gallery-modal.js
            getSrcForModal: function (type, scope) {
                var src,
                    index = type ? type.split(":")[1] : 0;
                // return undefined if type is undefined
                if (!type) {
                    return src;
                }

                if (type === "look-on-filter") {
                    type = defaultModalType;
                }

                switch (true) {
                    case defaultModalType === type:
                        src = scope.track[defaultModalType];
                        break;
                    case type.indexOf("datacube") >= 0:
                        src = scope.track.datacube;
                        break;
                    case type.indexOf("candy") >= 0:
                        src = scope.track.candy[index].src;
                        break;
                    case type.indexOf("treasure") >= 0:
                        src = scope.track.treasure[index].src;
                        break;
                    case type.indexOf("eggs") >= 0:
                        src = scope.track.eggs[index].src;
                        break;
                    case type.indexOf("youtube") >= 0:
                        src = scope.track.youtube[index].url;
                        scope.showVideo = true;
                        break;
                }

                return src;
            }
        }
    })