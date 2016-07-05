angular.module("trialsTrackmap")
    .service("categories", function () {

        var categories = [],
            alias = {},
            defaultFilterCatId = "all",
            filterCatId = defaultFilterCatId;

        return {
            setFilterCatId: function (_catId_) {
                filterCatId = (!_catId_) ? defaultFilterCatId : _catId_;
            },

            getFilterCatId: function () {
                return filterCatId;
            },

            getDefaultFilterCatId: function () {
                return defaultFilterCatId;
            },

            setAlias: function (_alias_) {
                alias = _alias_;
            },

            checkAlias: function (_catName_) {
                return alias.hasOwnProperty(_catName_) ? alias[_catName_] : _catName_;
            },

            setAll: function (_categories_) {
                categories = _categories_;
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

            hasTrackCategory: function (_track_, _searchedCatId_) {
                var cats = _track_.cats.split(",");
                return cats.indexOf("" + _searchedCatId_) !== -1;
            }
        }
    })