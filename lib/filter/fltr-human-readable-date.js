angular.module("trialsTrackmap")
    .filter("humanReadableDate", function(){

        function pad(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }

        function humanReadableDate(timestamp, withTime) {
            var date = timestamp ? new Date(parseInt(timestamp)) : new Date(),
                //datePre = [
                //    date.getFullYear(),
                //    pad(date.getMonth() + 1, 2),
                //    pad(date.getDate(), 2)
                //],
                //dateTime = [
                //    pad(date.getHours(), 2),
                //    pad(date.getMinutes(), 2),
                //    pad(date.getSeconds(), 2)
                //],
                //returnStr = datePre.join(".") + (withTime ? " " + dateTime.join(":") : "");
                returnStr = date.toLocaleDateString() + (withTime ? " " + date.toLocaleTimeString() : "");
            return returnStr;
        }

        return function(timestamp, withTime) {
            return humanReadableDate(timestamp, withTime);
        }
    })