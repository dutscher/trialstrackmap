angular.module("trialsTrackmap")
    .directive("tagList", function (categories, garage) {
        return {
            restrict: "A",
            scope: {
                track: "=tagList"
            },
            template: '\
                <span ng-if="track.case"\
                      class="tag">\
                    {%track.case%}\
                </span>\
                <span ng-repeat="categoryId in track.categories"\
                      class="tag">\
                    <span class="tag__color {%categoryData(categoryId).class%}-bg"></span>\
                    {%\'cats.\' + categoryId|translate%}{% categoryExtraData(categoryId) %}\
                </span>\
                <span ng-repeat="tagId in track.tags"\
                      class="tag">\
                    {% tagData(tagId) %}{% tagExtraData(tagId) %}\
                </span>',
            controller: function ($scope) {
                $scope.categoryData = categories.findById;
                $scope.tagData = categories.findTagById;

                $scope.categoryExtraData = function (catId) {
                    var strReturn = "",
                        trackData = $scope.track;

                    switch(catId){
                        case 3: // slot machine
                            if("level" in trackData) {
                                strReturn = "Level " + trackData.level;
                            }
                        break;
                    }

                    return (strReturn !== "" ? ": " : "") + strReturn;
                };
                $scope.tagExtraData = function (tagId) {
                    var strReturn = "",
                        trackId = $scope.track.id,
                        tagsData = categories.getTagsData();

                    switch (tagId) {
                        case 3: // bike
                            if (trackId in tagsData.bikeType) {
                                strReturn = garage.getBikeName(tagsData.bikeType[trackId]);
                            }
                            break;
                        case 6: // checkpoints
                            if (trackId in tagsData.checkpoints) {
                                strReturn = tagsData.checkpoints[trackId];
                            }
                            break;
                        case 7: // daily items gems
                            if (trackId in tagsData.dailyItemGems) {
                                strReturn = tagsData.dailyItemGems[trackId] + " Gems";
                            }
                            break;
                        case 8: // season
                            if (trackId in tagsData.seasonNumber) {
                                strReturn = "#" + tagsData.seasonNumber[trackId].join(", #");
                            }
                            break;
                        case 9: // trackpack
                            if (trackId in tagsData.trackpacks.ids) {
                                var trackpackIds = tagsData.trackpacks.ids[trackId];
                                strReturn = tagsData.trackpacks.all[trackpackIds];
                            }
                            break;
                        case 10: // chip shop chips
                            if (trackId in tagsData.chipShopDailyChips) {
                                strReturn = tagsData.chipShopDailyChips[trackId] + " Chips";
                            }
                            break;
                    }
                    return (strReturn !== "" ? ": " : "") + strReturn;
                };
            }
        };
    })