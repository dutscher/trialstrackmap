angular.module("trialsTrackmap")
    .directive("showLegend", function (canvas) {
        var allLegendsCheckboxes = [];

        return {
            restrict: "A",
            scope: {
                data: "=showLegend"
            },
            link: function (scope, element) {
                var checkbox = element.find("input");

                function showLegend() {
                    canvas.clear();

                    scope.data.tracks.forEach(function (track) {
                        if (!track.genCoords
                            || "tier" in scope.data && track.tier != scope.data.tier
                            || "cat" in scope.data && track.categories.indexOf(scope.data.cat) == -1)
                            return false;

                        var color = scope.data.cats[("cat" in scope.data ? scope.data.cat : track.categories[0] - 1)].color;

                        canvas.drawCategoryTrack(track.genCoords, color);
                    })
                }

                element.bind("change", function () {
                    if (checkbox.prop("checked")) {
                        // uncheck all other
                        allLegendsCheckboxes.forEach(function (_checkbox_) {
                            if (_checkbox_ != checkbox)
                                _checkbox_.attr("checked", false);
                        });
                        showLegend();
                    } else {
                        canvas.clear();
                    }
                });
                allLegendsCheckboxes.push(checkbox);
            }
        }
    })