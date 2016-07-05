angular.module("trialsTrackmap")
    .service("items", function ($filter) {

        var dataCubesId = 6,
            treasurePieceId = 19,
            trackData;

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
                return [dataCubesId, treasurePieceId];
            },
            // lib/filter/fltr-cat-and-tier-tracks.js
            isSpecialCat: function (_catId_) {
                return this.getSpecialsCats().indexOf(_catId_) !== -1;
            },
            // lib/track-map/drtv-gallery-modal.js
            getModalItemsList: function () {
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
                    <span class="item-list" data-track="data.track" data-type="treasure" data-with-badge="true"></span>\
                ';
                /*
                 <span class="youtube-list" data-track="track" data-with-badge="true"></span>\
                 <i class="data-cube" ng-if="data.track.datacube" show-track-in-modal="datacube"></i>\
                 <span class="item-list" data-track="data.track" data-with-badge="true" data-type="candy"></span>\
                 */
            },
            // lib/track-map/drtv-track-pointer.js
            getOpenForModalType: function (_catId_) {
                var type;

                switch (true) {
                    case (_catId_ === dataCubesId):
                        type = "datacube:0";
                        break;
                    case (_catId_ === treasurePieceId):
                        type = "treasure:0";
                        break;
                    default:
                        type = "startline";
                }

                return type;
            },
            // lib/track-map/drtv-gallery-modal.js
            getSrcForModal: function (type, scope) {
                var src,
                    index = type ? type.split(":")[1] : 0;

                if (!type) {
                    return src;
                }

                switch (true) {
                    case "startline" == type:
                        src = scope.track.startline;
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
                    case type.indexOf("youtube") >= 0:
                        src = scope.track.youtube[index].url;
                        $scope.showVideo = true;
                        break;
                }
                return src;
            },
            // lib/track-map/drtv-show-track-in-modal.js
            getTitleForModal: function (type, scope) {
                var data = {},
                    index = type ? type.split(":")[1] : 0;

                if (!type) {
                    return data;
                }

                switch (true) {
                    case "startline" == type:
                        data.typeName = "startline";
                        break;
                    case type.indexOf("datacube") >= 0:
                        data.typeName = "datacubeGuide";
                        break;
                    case type.indexOf("candy") >= 0:
                        if (scope.track.candy) {
                            data.title = scope.track.candy[index].title;
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
            // lib/srvc/srvc-trackdata.js
            addItemsToTrack: function (track) {
                var trackId = track.id;

                // startline
                if (trackId in trackData.media.startlines) {
                    track.startline = "#1/" + trackData.media.startlines[trackId];
                }

                // datacube
                if (trackId in trackData.media.datacubes) {
                    track.datacube = "#1/" + trackData.media.datacubes[trackId];
                    track.cats += "," + dataCubesId;
                }

                // candys
                if (trackId in trackData.media.candies) {
                    track.candy = trackData.media.candies[trackId];
                }

                // treasure
                if (trackId in trackData.media.treasures) {
                    var items = trackData.media.treasures[trackId];
                    track.treasure = angular.isArray(items) ? items : [items];
                    track.cats += "," + treasurePieceId;
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
                }
            }
        }
    })