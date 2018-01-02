module.exports = {
    dist: {
        options: {
            stripBanners: true,
            banner: [
                "'use strict';",
                "",
                "/*",
                "The MIT License (MIT)",
                "",
                "Copyright (c) 2016 willy woitas http://trialstrackmap.sb-f.de",
                "",
                "Permission is hereby granted, free of charge, to any person obtaining a copy",
                "of this software and associated documentation files (the 'Software'), to deal",
                "in the Software without restriction, including without limitation the rights",
                "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
                "copies of the Software, and to permit persons to whom the Software is",
                "furnished to do so, subject to the following conditions:",
                "",
                "The above copyright notice and this permission notice shall be included in",
                "all copies or substantial portions of the Software.",
                "",
                "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
                "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
                "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
                "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
                "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
                "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN",
                "THE SOFTWARE.",
                "*/"
            ].join("\n"),
            process: function (src, filepath) {
                if (filepath.indexOf("map-module") >= 0)
                    return src.replace(/;$/, "");
                return src.replace(/(^|\n)[ \t]*angular.module(.*)?\s*/g, "$1").replace(/;$/, "");
            }
        },
        src: [
            "lib/map-module.js",
            "lib/**/!(map-module|.min)*.js"
        ],
        dest: "dist/js/map.min.js"
    },
    vendor: {
        src: [
            "vendor/angular/angular-base.js",
            "vendor/angular/!(angular-base)*.js",
            "vendor/*.js"
        ],
        dest: "dist/js/vendor.min.js"
    },
    bonxy: {
        src: [
            "vendor/bonxy/bonxy.js"
        ],
        dest: "dist/js/bonxy.min.js"
    }
};