module.exports = function (shared, done) {
    const filesToDownload = [];
    const today = new Date();
    let cachedFiles = 0;

    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function downloadS3Data() {
        // get urls to files
        shared.http.get(shared.dataGet, function (res) {
            let body = "";
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                console.log("get json from amazon s3:", shared.dataGet);
                const response = JSON.parse(body);
                for (const i in response.content) {
                    const fileData = response.content[i];
                    const fileSrc = fileData.url.replace("https", "http");
                    const fileDest = `${shared.versionPath}/${fileData.name}`;

                    filesToDownload.push({
                        name: fileData.name,
                        src: fileSrc,
                        dest: fileDest
                    });
                }

                downloadFiles();
            });
        }).on("error", function (e) {
            console.error("got error at s3 downloading:", e);
            done();
        });
    }

    function getFileSize(filePath) {
        const isExists = shared.fs.existsSync(filePath);
        let stats = {};
        let fileSize = 0;

        if (isExists) {
            stats = shared.fs.statSync(filePath);
            fileSize = stats.size;
        }

        return fileSize;
    }

    function downloadFiles(index) {
        const downloadIndex = index || 0;
        const downloadFileObj = filesToDownload[downloadIndex];

        if (downloadIndex === 0) {
            console.log("Download content files");
        }

        if (!downloadFileObj) {
            console.log(`All ${filesToDownload.length} (${cachedFiles} cached) files are ready/downloaded.`);
            done();
            return;
        }

        // download file
        // if dat file is new download from amazon
        const cachedFile = shared.cachePath + "/" + downloadFileObj.name;
        const isCached = shared.fs.existsSync(cachedFile);
        let stats = null;
        let isCachedToday = false;
        let isNewVersion = true;

        if (isCached) {
            stats = shared.fs.statSync(cachedFile);
            isCachedToday = sameDay(stats.mtime, today);
            isNewVersion = downloadFileObj.src.indexOf(shared.gameVersion) !== -1;
        }

        if (!isCached || isNewVersion && !isCachedToday) {
            console.log("Download", downloadIndex + "\n",
                "from", downloadFileObj.src + "\n",
                "to", downloadFileObj.dest);


            shared.downloadFile(downloadFileObj.src, downloadFileObj.dest, function () {
                const fileSize = getFileSize(downloadFileObj.dest);
                // check filesSize of downloaded file
                if (fileSize > 0) {
                    // copy to cache
                    shared.fsExt.copySync(downloadFileObj.dest, cachedFile);
                    // download next file
                    downloadFiles(downloadIndex + 1);
                } else {
                    console.error(`null byte download of ${downloadFileObj.dest}`);
                    // download file again
                    downloadFiles(downloadIndex);
                }
            });
            // copy from cache
        } else {
            console.log("From Cache", downloadIndex, downloadFileObj.src);
            cachedFiles++;
            shared.fsExt.copySync(cachedFile, downloadFileObj.dest);
            downloadFiles(downloadIndex + 1);
        }
    }

    // start download
    shared.ensureDirectoryExistence(shared.versionPath + "/amazon.jo");
    downloadS3Data();
};