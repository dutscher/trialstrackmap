var iframe = null,
    iframeWrap = null,
    iframeUrl = "http://trialstrackmap.sb-f.de/trackfinder.html?track=",
    iframeUrl = "http://localhost:8001/trackfinder.html#track=",
    baseDim = "788x324".split("x");

function closeTrackFinder () {
    iframeWrap.setAttribute("style",
        " \
            left:{1}px;\
        "
            .replace("{1}", -(baseDim[0]))
    );
}

function showTrackFinder (event, element) {
    var trackName = element.innerText,
        newSrc = iframeUrl + encodeURI(trackName);

    if (iframe === null) {
        iframeWrap = document.createElement("div");
        iframeWrap.setAttribute("class", "trackfinder__iframe__wrap");
        iframe = document.createElement("iframe");
        iframe.setAttribute("class", "trackfinder__iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("onmouseleave", "closeTrackFinder()");
        iframe.setAttribute("scrolling", "no");
        iframe.src = iframeUrl;
        iframeWrap.appendChild(iframe);
        document.body.appendChild(iframeWrap);

        // set attributes
        iframe.setAttribute("style",
            " \
                width:{1}px;\
                height:{2}px;\
            "
                .replace("{1}", baseDim[0])
                .replace("{2}", baseDim[1])
        );
    }

    if (newSrc !== iframe.src) {
        iframe.src = newSrc;
    }
    iframeWrap.setAttribute("style",
        " \
            left:{1}px;\
            top:{2}px;\
        "
            .replace("{1}", event.x + 18)
            .replace("{2}", event.y + 18)
    );
}
