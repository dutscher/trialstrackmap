(function () {
    module.exports.register = function (Handlebars, options) {
        //Use this with caution! Assign variable from template
        Handlebars.registerHelper('hoster', function (path, hoster, options) {
            if(!hoster || !path || path.indexOf("http") >= 0)
                return path;

            Object.keys(hoster).forEach(function(_index_){
                path = path.replace(_index_, hoster[_index_]);
            });

            return path;
        });
    }
}).call(this);