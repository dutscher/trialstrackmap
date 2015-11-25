angular.module("trialsTrackmap")
    .filter("nameWithFlag", function(languages) {
        var convertPattern = {
            "usa": "us",
            "br": "br",
            "ger": "de"
        },
        convertKeys = Object.keys(convertPattern).concat(languages),
        tplIcon = '<i class="lang lang_{%lang%} beside-name no-margin"></i> ',
        tplSmall = '<small>{%riderName%}</small>';

        return function(_name_) {
            var name = _name_;

            convertKeys.forEach(function(country){
                if(_name_.toLowerCase().indexOf("-" + country) >= 0
                || _name_.toLowerCase().indexOf(country + "-") >= 0) {
                    name = tplIcon.replace("{%lang%}", (country in convertPattern) ? convertPattern[country] : country) + _name_;
                    name = name
                            .replace(("-" + country).toUpperCase(), "")
                            .replace((country + "-").toUpperCase(), "");
                    name+= tplSmall.replace("{%riderName%}", _name_);
                }
            });

            return name;
        }
    })