angular.module("trialsTrackmap")
    .service("categories", function () {

        var categories = [];

        return {
            setAll: function(_categories_){
                categories = _categories_;
            },
            findByName: function(_name_){
                var found = categories.find(function(category){
                    return category.class === _name_;
                });
                return found;
            },
            findById: function(_id_){
                var found = categories.find(function(category){
                    return category.index === parseInt(_id_, 10);
                });
                return found;
            }
        }
    })