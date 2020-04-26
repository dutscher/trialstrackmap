angular.module("trialsTrackmap")
    .directive("showAmount", function (
        trackData
    ) {
        return {
            restrict: "A",
            scope: {
                riderData: "=showAmount",
                world: "=world"
            },
            link: function (scope, element, attrs) {
                var className = "hide-zero";
                var os = attrs.os;
                var bikeType = attrs.type;
                var name = scope.riderData.riderName;
                var id = scope.riderData.riderId;
                var amount = 0;
                var worlds = scope.riderData.worlds;

                if (
                    scope.world == 0
                    && os in scope.riderData.tracks
                    && bikeType in scope.riderData.tracks[os]
                ) {
                    amount = scope.riderData.tracks[os][bikeType].length;
                } else if(
                    scope.world in worlds
                    && os in worlds[scope.world]
                    && bikeType in worlds[scope.world][os]
                ) {
                    amount = worlds[scope.world][os][bikeType].length;
                }

                var tracks = os in scope.riderData.tracks ? scope.riderData.tracks[os][bikeType] : 0;
                var bonxyLink = "<a href=\"http://trials.bonxy.net/{url}\" target=\"_blank\">{label}</a>";

                if (amount === "") {
                    return;
                }
                //
                if (amount === 0) {
                    element.addClass(className);
                    element.html("<span>" + amount + "</span>");
                    // http://trials.bonxy.net/tracks/Deadwood+Valley-Crazy
                } else if (amount === 1) {
                    var track = trackData.getTrackByID(parseInt(tracks[0]));
                    element.removeClass(className);
                    element.html(
                        bonxyLink
                            .replace("{url}", "tracks/" + track.i18n
                                    .replace(/ /g, "+")
                                    .replace("'", "")
                                + (bikeType !== "normal" ? "-" + bikeType : "")
                                + "?riderFromTemple=" + name)
                            .replace("{label}", amount));
                } else {
                    element.removeClass(className);
                    element.html(bonxyLink.replace("{url}", id + "/" + bikeType).replace("{label}", amount));
                }
            }
        }
    })
