var iframe = null,
    iframeWrap = null,
    iframeScaler = null,
    iframeClose = null,
    iframeUrl = "http://trialstrackmap.sb-f.de/trackfinder.html#track=",
    iframeUrl = "http://localhost:8001/trackfinder.html#track=",
    baseDim = "788x324".split("x"),
    scale = 0.45;

function closeTrackFinder () {
    iframeWrap.setAttribute("style",
        " \
            left:{1}px;\
        "
            .replace("{1}", -(baseDim[0]))
    );
}

function calcScale () {
    var viewportWidth = document.body.offsetWidth,
        isMobile = viewportWidth <= 400;
    scale = isMobile ? (viewportWidth - (8 * 2)) / (parseInt(baseDim[0]) + (8 * 10)) : 0.5;

    // set attributes
    iframe.setAttribute("style",
        " \
            width:{1}px;\
            height:{2}px;\
            transform:scale({3});\
            transform-origin:0 0;\
        "
            .replace("{1}", baseDim[0])
            .replace("{2}", baseDim[1])
            .replace("{3}", scale)
    );

    iframeScaler.setAttribute("style",
        " \
            width:{1}px;\
            height:{2}px;\
        "
            .replace("{1}", baseDim[0] * scale)
            .replace("{2}", baseDim[1] * scale)
    );
}

function showTrackFinder (event, trackName) {
    var newSrc = iframeUrl + encodeURI(trackName);

    if (iframe === null) {
        iframeWrap = document.createElement("div");
        iframeWrap.setAttribute("class", "trackfinder__iframe");

        iframeScaler = document.createElement("div");
        iframeScaler.setAttribute("class", "trackfinder__iframe__scaler");

        iframeClose = document.createElement("div");
        iframeClose.setAttribute("class", "trackfinder__iframe__close");
        iframeClose.setAttribute("onclick", "closeTrackFinder()");
        iframeClose.appendChild(document.createTextNode("x"));

        iframe = document.createElement("iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("onmouseleave", "closeTrackFinder()");
        iframe.setAttribute("scrolling", "no");

        iframe.src = iframeUrl;

        iframeWrap.appendChild(iframeClose);
        iframeWrap.appendChild(iframeScaler);
        iframeScaler.appendChild(iframe);

        document.body.appendChild(iframeWrap);

        calcScale();
    }

    if (newSrc !== iframe.src) {
        iframe.src = newSrc;
    } else {
        iframe.src = iframeUrl;
        closeTrackFinder();
        return;
    }

    calcScale();

    iframeWrap.setAttribute("style",
        " \
            top:{1}px; \
            left:{2}px;\
        "
            .replace("{1}", event.y + 16)
            .replace("{2}", event.x + 16)
    );
}
