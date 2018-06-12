(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("imgurThumb", function (imgurSrc) {
            if(imgurSrc) {
                var thumbPath = imgurSrc.split(".");
                // add thumb t
                thumbPath[thumbPath.length - 2] += "t";
                return thumbPath.join(".");
            }
            return "";
        });
    }
}).call(this);