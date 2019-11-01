angular.module("trialsTrackmap")
    .service("categories", function () {
        var categories = [],
            tags = [],
            alias = {},
            defaultFilterCatId = "all",
            filterCatId = defaultFilterCatId;
        
        return {
            setAll: function (_categories_) {
                var catIds = Object.keys(_categories_);
                catIds.forEach(function (catId) {
                    var cat = _categories_[catId];
                    cat.index = parseInt(catId, 10);
                    categories.push(cat)
                });
            },
            
            setTags: function (_tags_) {
                tags = _tags_;
            },
            
            setAlias: function (_alias_) {
                alias = _alias_;
            },
            
            setFilterCatId: function (_catId_) {
                filterCatId = (!_catId_) ? defaultFilterCatId : _catId_;
            },
            
            getFilterCatId: function () {
                return filterCatId;
            },
            
            getDefaultFilterCatId: function () {
                return defaultFilterCatId;
            },
            
            checkAlias: function (_catName_) {
                return alias.hasOwnProperty(_catName_) ? alias[_catName_] : _catName_;
            },
            
            getAll: function () {
                return categories;
            },
            
            getTags: function () {
                return tags.all;
            },
            
            getTagsData: function () {
                return tags;
            },
            
            getName: function (_id_) {
                var match = this.findById(_id_);
                return match && match.hasOwnProperty("class") ? match.class : "";
            },
            
            getIndex: function (_name_) {
                var match = this.findByName(_name_);
                return match && match.hasOwnProperty("index") ? match.index : -1;
            },
            
            findByName: function (_name_) {
                var found = categories.find(function (category) {
                    return category.class === _name_;
                });
                return found;
            },
            
            findById: function (_id_) {
                var found = categories.find(function (category) {
                    return category.index === parseInt(_id_, 10);
                });
                return found;
            },
            
            findTagById: function (_id_) {
                var found = "";
                if (_id_ in tags.all) {
                    found = tags.all[_id_];
                }
                return found;
            },
            
            hasTrackCategory: function (_track_, _searchedCatId_) {
                return _track_.categories.indexOf(_searchedCatId_) !== -1;
            },
            
            getTrackTagConverted: function (trackTagIds) {
                var data = {},all = trackTagIds.map(function (input) {
                    var tagData = String(input).split(":"),
                        tagID = parseInt(tagData[0], 10);
                    if(tagData.length > 1) {
                        tagData.shift();
                        tagData = String(tagData).split(",");
                        data[tagID] = tagData !== "?" ? tagData.map(Number) : tagData;
                    }
                    return parseInt(tagID, 10);
                });
                
                return {
                    all: all,
                    data: data
                }
            }
        }
    })