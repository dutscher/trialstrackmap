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
                        name: fileData.name,
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
        // if dat file is new download from amazon
        const cachedFile = shared.cachePath + "/" + downloadFileObj.name;
        const isCached = shared.fs.existsSync(cachedFile);
        const isNewVersion = downloadFileObj.src.indexOf(shared.gameVersion) !== -1;

        if(!isCached || isNewVersion) {
            console.log("Download", downloadIndex, downloadFileObj.src);
            shared.downloadFile(downloadFileObj.src, downloadFileObj.dest, function () {
                // copy to cache
                shared.fsExt.copySync(downloadFileObj.dest, cachedFile);
                downloadFiles(downloadIndex + 1);
            });
        // copy from cache
        } else {
            console.log("From Cache", downloadIndex, downloadFileObj.src);
            shared.fsExt.copySync(cachedFile, downloadFileObj.dest);
            downloadFiles(downloadIndex + 1);
        }
    }

    // start download
    shared.ensureDirectoryExistence(shared.versionPath + "/amazon.jo");
    downloadS3Data();
};