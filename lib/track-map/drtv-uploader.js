angular.module("trialsTrackmap")
    .directive("uploader", function ($document) {
        return {
            scope: {
                ngModel: "="
            },
            template: '\
                <input type="file" accept="text/json" class="invisible-input"\
                       ng-model="ngModel" \
                       />\
                <button class="btn">{%"dialogs.labels.chooseFile"|translate%}</button>\
                <small ng-if="error" class="error">\
                    {%"dialogs.error." + error|translate%}\
                </small>\
            ',
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {
                var reader = new FileReader(),
                    file;

                reader.onload = function (event) {
                    var source = event.target.result;

                    scope.$apply(function(){
                        scope.error = null;
                    });

                    ngModel.$setViewValue({
                        file: file,
                        source: source
                    });
                };

                element.find("button").on("click", function (event) {
                    var prevElement = this.previousElementSibling;
                    prevElement.click();
                });

                element.find("input").on("change", function (event) {
                    var files = event.target.files; // FileList object
                    // read file
                    file = files[0];

                    // check filesize
                    if (file.size > (1024 * 1024)) {
                        scope.$apply(function(){
                            scope.error = "fileTooBig";
                        });
                        return;
                    }

                    reader.readAsDataURL(file);
                });
            }
        }
    })