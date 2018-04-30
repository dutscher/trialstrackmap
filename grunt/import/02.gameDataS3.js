module.exports = function (shared, done) {
    var filesToDownload = [];

    function downloadS3Data() {
        // get urls to files
        shared.http.get(shared.dataGet, function (res) {
            var body = "";
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                console.log("get json from amazon", shared.dataGet);
                var response = JSON.parse(body);
                console.log("downloading files from s3");
                for (var i in response.content) {
                    var fileData = response.content[i],
                        fileSrc = fileData.url.replace("https", "http"),
                        fileDest = shared.versionPath + "/" + fileData.name;
                    
                    filesToDownload.push({
                        src: fileSrc,
                        dest: fileDest
                    });
                }

                downloadFiles();
            });
        }).on("error", function (e) {
            console.error("Got an error: ", e);
            done();
        });
    }

    function downloadFiles(index) {
        var downloadIndex = index || 0,
            downloadFileObj = filesToDownload[downloadIndex];

        if (downloadIndex === 0) {
            console.log("Download content files", filesToDownload.length);
        }

        if (!downloadFileObj) {
            console.log("All files downloaded.");
            done();
            return;
        }

        // download file
        console.log("Download", downloadIndex, downloadFileObj.src);
        shared.downloadFile(downloadFileObj.src, downloadFileObj.dest, function () {
            downloadFiles(downloadIndex + 1);
        });
    }

    // start download
    shared.ensureDirectoryExistence(shared.versionPath + "/amazon.jo");
    downloadS3Data();
};