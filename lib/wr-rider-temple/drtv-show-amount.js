angular.module("trialsTrackmap")
    .directive("showAmount", function (trackData) {
        return {
            restrict: "A",
            scope: {
                riderData: "=showAmount"
            },
            link: function (scope, element, attrs) {
                var className = "hide-zero";
                var os = attrs.os;
                var bikeType = attrs.type;
                var name = scope.riderData.riderName;
                var amount = scope.riderData.WRAmount[os][bikeType];
                var trackId = os in scope.riderData.tracks ? scope.riderData.tracks[os][bikeType] : 0;
                var bonxyLink = "<a href=\"http://trials.bonxy.net/{url}\" target=\"_blank\">{label}</a>";

                if (amount === "") {
                    return;
                }

                if (amount == 0) {
                    element.addClass(className);
                    element.html("<span>" + amount + "</span>");
                    // http://trials.bonxy.net/tracks/Deadwood+Valley-Crazy
                } else if (amount == 1 && trackId > 0) {
                    var track = trackData.getTrackByID(parseInt(trackId));
                    console.log(trackId, track)
                    element.removeClass(className);
                    element.html(
                        bonxyLink
                            .replace("{url}", "tracks/" + track.i18n .replace(" ", "+") + "-" + bikeType)
                            .replace("{label}", amount));
                } else {
                    element.removeClass(className);
                    element.html(bonxyLink.replace("{url}", name + "/" + bikeType).replace("{label}", amount));
                }
            }
        }
    })