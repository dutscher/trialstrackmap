angular.module("trialsTrackmap")
    .filter("humanReadableDate", function($filter){

        function pad(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }

        function detectDelimiter(str){
            var arrDelimiter = [
                ".", "/", "-", " "
            ],
                returnDelimtier = "";

            arrDelimiter.forEach(function(_delimiter_){
                if(str.indexOf(_delimiter_) >= 0) {
                    returnDelimtier = _delimiter_
                }
            });

            return returnDelimtier;
        }

        function humanReadableDate(timestamp, withTime) {
            var date = timestamp ? new Date(parseInt(timestamp)) : new Date(),
                returnStr = date.toLocaleDateString() + (withTime ? " " + date.toLocaleTimeString() : ""),
                delimiter = detectDelimiter(returnStr),
                arrReturnStr = returnStr.split(delimiter);

            arrReturnStr.forEach(function(partOfStr, index){
                arrReturnStr[index] = $filter("leadingZero")(partOfStr);
            });

            return arrReturnStr.join(delimiter);
        }

        return function(timestamp, withTime) {
            return humanReadableDate(timestamp, withTime);
        }
    })