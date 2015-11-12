angular.module("trialsTrackmap")
    .directive("improveImport", function (improveTimes, $http, $filter) {
        return {
            restrict: "A",
            template: '\
                <input type="file" accept="text/json" class="invisible-input" />\
                <button data-type="dialog-opener">{%"page.timesTable.improve.importFile"|translate%}</button>\
                <button data-type="dialog-url">{%"page.timesTable.improve.importUrl"|translate%}</button>\
            ',
            link: function (scope, element, attrs) {
                var input = element.find("input"),
                    reader = new FileReader(),
                    file;

                reader.onload = function (event) {
                    var source = event.target.result;
                    improveTimes
                        .setScope(scope)
                        .validateFile(source, file);
                };

                input.on("change", function (event) {
                    var files = event.target.files; // FileList object
                    // read file
                    file = files[0];

                    // check filesize
                    if (file.size > (1024 * 1024)) {
                        console.error("your file is to big for import!");
                        return;
                    }

                    reader.readAsDataURL(file);
                });

                element.find("button").on("click", function (event) {
                    var button = angular.element(event.target);

                    switch (button.attr("data-type")) {
                        case "dialog-opener":
                            input[0].click();
                            break;
                        case "dialog-url":
                            var url = prompt($filter("translate")("page.timesTable.improve.chooseImportUrl"), "https://*.json");
                            if (url != null && url != "") {
                                $http({
                                    method: "GET",
                                    url: url
                                }).then(function (response) {
                                    if (response.status === 200) {
                                        improveTimes
                                            .setScope(scope)
                                            .confirmImport(response.data);
                                    } else {
                                        console.error("couldn't access to the url!", url, response);
                                    }
                                }, function (response) {
                                    console.error("couldn't access to the url!", url, response);
                                })
                            }
                            break;
                    }
                });
            }
        }
    })