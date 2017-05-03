angular.module("trialsTrackmap")
    .directive("tagList", function (categories, garage, dialogEditTags) {
        return {
            restrict: "A",
            scope: {
                track: "=tagList",
                editMode: "=editMode"
            },
            template: '\
                <div ng-if="track.case"\
                      class="tag">\
                    {%track.case%}\
                </div>\
                <div ng-repeat="categoryId in track.categories"\
                      class="tag">\
                    <div class="tag__color {%categoryData(categoryId).class%}-bg"></div>\
                    {%\'cats.\' + categoryId|translate%}{% categoryExtraData(categoryId) %}\
                </div>\
                <div ng-repeat="tagId in track.tags.all"\
                      class="tag">\
                    {% tagData(tagId) %}{% tagExtraData(tagId) %}\
                    <div ng-if="editMode" class="tag tag--add" ng-click="deleteTag(tagId)">x</div>\
                </div>\
                <div ng-if="!editMode" class="tag tag--add" ng-click="createNewTag()">+</div>',
            controller: function ($scope) {
                $scope.categoryData = categories.findById;
                $scope.tagData = categories.findTagById;
                
                $scope.categoryExtraData = function (catId) {
                    var strReturn = "",
                        trackData = $scope.track;
                    
                    switch (catId) {
                        case 3: // slot machine
                            if ("level" in trackData) {
                                strReturn = "Level " + trackData.level;
                            }
                            break;
                    }
                    
                    return (strReturn !== "" ? ": " : "") + strReturn;
                };
                
                $scope.tagExtraData = function (tagId) {
                    var strReturn = "",
                        tagsData = $scope.track.tags.data,
                        tagsGlobalData = categories.getTagsData();
                    
                    if (tagId in tagsData) {
                        switch (tagId) {
                            case 3: // bike
                                strReturn = garage.getBikeName(tagsData[tagId]);
                                break;
                            case 6: // checkpoints
                                strReturn = tagsData[tagId];
                                break;
                            case 7: // daily items gems
                                strReturn = tagsData[tagId] + " Gems";
                                break;
                            case 8: // season
                                strReturn = "#" + tagsData[tagId].join(", #");
                                break;
                            case 9: // trackpack
                                strReturn = tagsGlobalData.trackpacks[tagsData[tagId]];
                                break;
                            case 10: // chip shop chips
                                strReturn = tagsData[tagId] + " Chips";
                                break;
                        }
                    }
                    return (strReturn !== "" ? ": " : "") + strReturn;
                };
                
                $scope.createNewTag = function () {
                    dialogEditTags.open($scope.track, $scope);
                };
                
                $scope.deleteTag = function () {
                    console.log(arguments)
                };
            }
        };
    })