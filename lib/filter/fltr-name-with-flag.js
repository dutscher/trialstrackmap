angular.module("trialsTrackmap")
    .filter("nameWithFlag", function ($languages) {
        var convertPattern = {
                "usa": "us",
                "us": "us",
                "pt": "br",
                "ca": "ca",
                "can": "ca",
                "gr": "gr",
                "ind": "ne",
                "aut": "au",
                "ger": "de",
                "ge": "de",
                "itge": "de",
                "uk": "en",
                "eng": "en",
                "eg": "eg",
                "swe": "se",
                "co": "co",
                "cze": "cz",
                "cro": "hr",
                "nor": "no",
                "no": "no",
                "est": "et",
                "jpn": "jp"
            },
            convertKeys = Object.keys(convertPattern).concat($languages),
            tplIcon = '<i class="lang lang_{%lang%} beside-name no-margin"></i> ',
            tplSmall = '<small>{%riderName%}</small>';

        return function (_name_) {
            if (!_name_) {
                return _name_;
            }

            var name = _name_;

            convertKeys.forEach(function (country) {
                var regxp = new RegExp("(-|_)" + country + "$|^" + country + "(-_-|-|_)", "i"),
                    match = _name_.match(regxp);

                if (match !== null) {
                    if (match[0].toLowerCase() === "itge-") {
                        name = tplIcon.replace("{%lang%}", "it");
                        name += tplIcon.replace("{%lang%}", "de");

                    } else {
                        name = tplIcon.replace("{%lang%}", (country in convertPattern) ? convertPattern[country] : country);
                    }
                    name += _name_.replace(match[0], "");
                    name += tplSmall.replace("{%riderName%}", _name_);
                }
            });

            return name;
        }
    })