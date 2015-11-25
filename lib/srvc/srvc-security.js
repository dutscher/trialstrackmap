angular.module("trialsTrackmap")
    .service("security", function ($window) {

        var base64Regexp = "^(data:(.*?);?base64,)(.*)$";

        function clearBase64(b64Data) {
            if (typeof b64Data != "string")
                return '';

            var clearedBase64 = b64Data
                .replace(/\r?\n|\r| /g, "")
                .replace(new RegExp(base64Regexp, "i"), function () {
                    return arguments[3];// return the cleared base64
                });
            return clearedBase64;
        }

        return {
            md5: function (string) {
                return $window.md5(string);
            },
            aesEncrypt: function(string, passphrase){
                if (typeof string === "object") {
                    string = JSON.stringify(string);
                }
                var encrypted = CryptoJS.AES.encrypt(string, passphrase || "trialstrackmap");
                return encrypted.toString();

            },
            aesDecrypt: function(encrypted, passphrase){
                var decrypted = CryptoJS.AES.decrypt(encrypted, passphrase || "trialstrackmap");
                return decrypted.toString(CryptoJS.enc.Utf8);
            },
            base64encode: function (string) {
                if (typeof string === "object") {
                    string = JSON.stringify(string);
                }

                return $window.btoa(string);
            },
            base64decode: function (base64) {
                return $window.atob(clearBase64(base64));
            }
        }
    })