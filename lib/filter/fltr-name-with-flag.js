angular.module("trialsTrackmap")
    .filter("nameWithFlag", function (languages) {
        var convertPattern = {
                "usa": "us",
                "br": "br",
                "ger": "de",
                "ge": "de"
            },
            convertKeys = Object.keys(convertPattern).concat(languages),
            tplIcon = '<i class="lang lang_{%lang%} beside-name no-margin"></i> ',
            tplSmall = '<small>{%riderName%}</small>';

        return function (_name_) {
            if (!_name_) {
                return _name_;
            }

            var name = _name_;

            convertKeys.forEach(function (country) {
                var regxp = new RegExp("(-|_)" + country + "$|^" + country + "(-|_)", "i"),
                    match = _name_.match(regxp);
                if (match !== null) {
                    name = tplIcon.replace("{%lang%}", (country in convertPattern) ? convertPattern[country] : country) + _name_;
                    name = name.replace(match[0], "")
                    name += tplSmall.replace("{%riderName%}", _name_);
                }
            });

            return name;
        }
    })