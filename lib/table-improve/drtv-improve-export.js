angular.module("trialsTrackmap")
    .directive("improveExport", function ($filter, improveTimes) {

        var isFileSaverSupported = false;

        try {
            isFileSaverSupported = !!new Blob && saveAs;
        } catch (e) {
            console.error("no export supported");
            return {

            }
        }

        return {
            restrict: "A",
            template: '\
                 <button>{%"page.timesTable.improve.exportFile"|translate%}</button>\
            ',
            link: function (scope, element, attrs) {
                element.on("click", function () {
                    var fileData = {
                        date: (new Date()).getTime(),
                        times: improveTimes.getAll()
                    };

                    var blob = new Blob([JSON.stringify(fileData)], {type: improveTimes.fileMimeType + ";charset=utf-8"});
                    saveAs(blob, improveTimes.fileName + "." + improveTimes.humanReadableDate() + "." + improveTimes.fileExtension);
                });
            }
        }
    })