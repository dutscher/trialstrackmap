angular.module("trialsTrackmap")
    .directive("countdown", function ($timeout, $filter) {
        return {
            restrict: "C",
            scope: {
                start: "@dateStart",
                end: "@dateEnd"
            },
            link: function (scope, element) {
                var pattern = /(\d{2})\.(\d{2})\.(\d{4})/,
                    dateStart = new Date(scope.start.replace(pattern, "$3/$2/$1")),
                    dateEnd = new Date(scope.end.replace(pattern, "$3/$2/$1 13:00:00"));

                function pad(n, width, z) {
                    z = z || "0";
                    n = n + "";
                    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                }

                function countdown() {
                    var dateNow = new Date();

                    if (dateNow < dateEnd) {
                        var days = 0, hours = 0, minutes = 0, seconds = 0;

                        // Tage
                        while (dateNow.getTime() + (24 * 60 * 60 * 1000) < dateEnd) {
                            days++;
                            dateNow.setTime(dateNow.getTime() + (24 * 60 * 60 * 1000));
                        }

                        // Stunden
                        hours = Math.floor((dateEnd - dateNow) / (60 * 60 * 1000));
                        dateNow.setTime(dateNow.getTime() + hours * 60 * 60 * 1000);

                        // Minuten
                        minutes = Math.floor((dateEnd - dateNow) / (60 * 1000));
                        dateNow.setTime(dateNow.getTime() + minutes * 60 * 1000);

                        // Sekunden
                        seconds = Math.floor((dateEnd - dateNow) / 1000);

                        // Anzeige formatieren
                        days = (days + 1) + $filter("translate")("seasons.day_short") + " ";
                        hours = pad(hours, 2) + ":";
                        minutes = pad(minutes, 2) + ":";
                        seconds = pad(seconds, 2);

                        element.html(days + hours + minutes + seconds);

                        $timeout(function () {
                            countdown()
                        }, 200);
                    }
                }

                countdown();
            }
        }
    })