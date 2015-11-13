angular.module("trialsTrackmap")
    .directive("improveExportCsv", function ($filter, improveTimes) {

        var isFileSaverSupported = false;

        try {
            isFileSaverSupported = !!new Blob && saveAs;
        } catch (e) {
            console.error("no export supported");
            return {}
        }

        return {
            restrict: "A",
            template: '\
                 <button>{%"page.timesTable.improve.exportFileCsv"|translate%}</button>\
            ',
            link: function (scope, element, attrs) {
                element.on("click", function () {
                    var pattern = improveTimes.getPattern(),
                        patternKeys = Object.keys(pattern),
                        csvData = "ID;Track;" + (patternKeys.join(";")) + "\n";

                    scope.data.tracks.forEach(function (track) {
                        var data = [];

                        data.push(track.id);
                        data.push($filter("stripLevel")(track.i18n));

                        patternKeys.forEach(function (key) {
                            var index = key.split("-"),
                                value = track.improve[index[1]][index[2]][index[0]];

                            if (value === improveTimes.error) {
                                value = "";
                            }

                            if (index[0] === "myTime") {
                                value = value ? $filter("convertTime")(value) : "";
                            }

                            data.push(value);
                        });

                        csvData += data.join(";") + "\n";
                    });

                    var blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
                    saveAs(blob, improveTimes.fileName + "." + improveTimes.humanReadableDate() + "." + "csv");
                });
            }
        }
    })