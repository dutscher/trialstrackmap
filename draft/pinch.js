/*
 http://hammerjs.github.io/

 previous pincher but not very usefull
 ----
 jquery
 ----
 http://creativedroplets.com/html5-and-multitouch-hammer-js/
 http://jaukia.github.io/zoomooz/
 http://www.jqueryscript.net/zoom/Smart-jQuery-Pan-Zoom-Plugin-Smart-jQuery-Zoom.html
 http://stackoverflow.com/questions/10802176/pinch-to-zoom-with-css3
 http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js?rq=1
 ----
 angularjs
 ----
 https://gist.github.com/ktknest/5276f368c92bc1ce4dda
 http://codepen.io/ktknest/full/LDljw/
 */

function initWindow(){
    // When ready...
    window.addEventListener("load",function() {
        // Set a timeout...
        setTimeout(function(){
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);
    });
    window.addEventListener("resize",function() {
        mask.dim = {
            w: eleMask.offsetWidth,
            h: eleMask.offsetHeight,
            r: eleMask.offsetWidth / eleMask.offsetHeight
        };

        mask.init(eleMask);
        map.init(eleMap, settings);

    });
}

function initHammer(element){
    console.log("initHammer", element)
    var mc = new Hammer.Manager(element);

    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith( mc.get("pan") );

    mc.on("panstart panmove", onPan);
    mc.on("pinchstart pinchmove", onPinch);

    mc.on("hammer.input", onFinal);

    // desktop pinching via mousewheel
    function MouseWheelHandler(e) {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))),
            center = {
                x: e.clientX,
                y: e.clientY
            };

        onScroll(delta,center);
    }

    if (element.addEventListener) {
        // IE9, Chrome, Safari, Opera
        element.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        element.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
}

var settings = {
    startScale: 1,
    maxScale: 1,
    minScale: 0.45,
    newMinScale: -1,
    fitHeight: false,
    fitWidth: false,
    panInBounds: true
};

var utils = {
    calcBounds: function(){
        var difference = map.getDifference();

        var minX = Math.ceil(difference.w / 2),
            minY = Math.ceil(difference.h / 2),
            maxX = -((map.dim.w + difference.w) - mask.dim.w - minX),
            maxY = -((map.dim.h + difference.h) - mask.dim.h - minY);

        return {
            x: {
                min: minX,
                max: maxX
            },
            y: {
                min: minY,
                max: maxY
            }
        }
    },
    stayInBounds: function(possibleX, possibleY, bounds){
        var bounds = bounds || this.calcBounds(),
            setX = 0, setY = 0;

        if(possibleX < bounds.x.min && possibleX > bounds.x.max)
            setX = possibleX;
        else if(possibleX < bounds.x.min)
            setX = bounds.x.max;
        else if(possibleX > bounds.x.max)
            setX = bounds.x.min;
        else
            setX = bounds.x.min;

        if(possibleY < bounds.y.min && possibleY > bounds.y.max)
            setY = possibleY;
        else if(possibleY < bounds.y.min)
            setY = bounds.y.max;
        else if(possibleY > bounds.y.max)
            setY = bounds.y.min;

        return {
            x: setX,
            y: setY
        }
    }
};

var eleMask = document.querySelector(".mapMask");
var mask = {
    dim: {},
    element: null,
    init: function(element){
        console.log("mask.init", element)
        // dom element
        this.element = element;

        // dimensions
        this.dim.w = element.offsetWidth;
        this.dim.h = element.offsetHeight;
        this.dim.r = element.offsetWidth / element.offsetHeight;

        updatePanel({
            window: this.dim
        });
    },
    getCenter: function(){
        return {
            x: (this.dim.w / 2),
            y: (this.dim.h / 2)
        }
    }
};
var eleMap = document.querySelector("#map");
var map = {
    element: null,
    tmp: {},
    transform: {},
    dim: {},
    init: function(element, settings){
        var settings = settings || {};

        // dom element
        this.element = element;

        // dimensions
        this.dim.w = element.width;
        this.dim.h = element.height;
        this.dim.r = element.width / element.height;

        if(settings.newMinScale === -1) {
            settings.newMinScale = calcMinScale(map.transform.scale);
        }

        console.log(settings)

        // startScale
        this.scale = this.tmp.startScale = settings.newMinScale !== -1 ? settings.newMinScale : (settings.startScale || 1);

        console.log(this.scale)

        // check settings
        // fits the height
        if("fitHeight" in settings && settings.fitHeight){
            this.scale = this.tmp.startScale = mask.dim.h / this.dim.h;
        }
        // fits the height
        if("fitWidth" in settings && settings.fitWidth){
            this.scale = this.tmp.startScale = mask.dim.w / this.dim.w;
        }

        // start coords
        var maskCenter = mask.getCenter(),
            mapCenter = this.getCenter();

        this.tmp.startX = this.tmp.lastX = maskCenter.x - mapCenter.x;
        this.tmp.startY = this.tmp.lastY = maskCenter.y - mapCenter.y;

        // first draw
        this.reset();
    },
    getDifference: function(){
        var newWidth = this.dim.w * this.scale,
            newHeight = this.dim.h * this.scale;
        return {
            w: newWidth - map.dim.w,
            h: newHeight - map.dim.h
        }
    },
    getCenter: function(){
        return {
            x: (this.dim.w / 2),
            y: (this.dim.h / 2)
        }
    },
    reset: function(){
        this.transform = {
            translate: { x: this.tmp.startX, y: this.tmp.startY },
            scale: this.tmp.startScale
        };

        this.update();
    },
    update: function(){
        var value = [
            "translateX(" + this.transform.translate.x + "px)",
            "translateY(" + this.transform.translate.y + "px)",
            "scale(" + this.transform.scale + ", " + this.transform.scale + ")"
        ];

        value = value.join(" ");
        //mask.textContent = value;
        this.element.style.webkitTransform = value;
        this.element.style.mozTransform = value;
        this.element.style.transform = value;

        updatePanel({
            scale: this.transform.scale,
            minScale: settings.newMinScale,
            x: this.transform.translate.x,
            y: this.transform.translate.y
        });
    },
    panTo: function(newX, newY){
        var maskCenter = mask.getCenter(),
            difference = this.getDifference(),
            bounds = utils.calcBounds(),
            possibleX = -((bounds.x.min + (newX * this.scale)) - difference.w - maskCenter.x),
            possibleY = -((bounds.y.min + (newY * this.scale)) - difference.h - maskCenter.y),
            coords = utils.stayInBounds(possibleX, possibleY);

        this.transform.translate.x = map.tmp.lastX = coords.x;
        this.transform.translate.y = map.tmp.lastY = coords.y;

        this.update();
    }
};

console.log(eleMap.naturalHeight, eleMap.naturalWidth)

function calcMinScale(scale){
    // calc new min and max
    if(map.dim.w * scale < mask.dim.w) {
        return mask.dim.w / map.dim.w;
    } else {
        return -1;
    }
}

function onScroll(delta, center){
    var fakeEvent = {
        type: "pinchstart",
        center: center,
        scale: 0
    };

    // zoom in
    if(delta > 0){
        fakeEvent.scale = 1.25;
    // zoom out
    } else {
        fakeEvent.scale = 0.85;
    }

    onPinch(fakeEvent);
}

function onPinch(ev) {
    if(ev.type == "pinchstart") {
        map.tmp.initScale = map.scale || 1;
        map.tmp.panTo = {
            x: -(map.tmp.lastX - ev.center.x),
            y: -(map.tmp.lastY - ev.center.y)
        };
    }

    var newScale = map.tmp.initScale * ev.scale,
        setScale = 1;

    settings.newMinScale = calcMinScale(newScale);

    switch(true){
        case newScale > settings.maxScale:
            setScale = settings.maxScale;
        break;
        case settings.newMinScale === -1 && newScale < settings.minScale || settings.newMinScale !== -1 && newScale < settings.newMinScale:
            setScale = settings.newMinScale === -1 ? settings.minScale : settings.newMinScale;
        break;
        default:
            setScale = newScale;
    }

    map.scale = map.transform.scale = setScale;

    map.panTo(map.tmp.panTo.x,map.tmp.panTo.y);

    map.update();
}

function onPan(ev) {
    if(ev.type == "panstart"){
        map.tmp.panScale = 1;
        map.tmp.panBounds = utils.calcBounds(map.tmp.panScale);
    }

    var possibleX = map.tmp.lastX + ev.deltaX,
        possibleY = map.tmp.lastY + ev.deltaY,
        coords = settings.panInBounds
            ? utils.stayInBounds(possibleX, possibleY, map.tmp.panBounds, map.tmp.panScale)
            : {x:possibleX,y:possibleY};

    map.transform.translate.x = coords.x;
    map.transform.translate.y = coords.y;

    map.update();
}

function onFinal(ev) {
    if(ev.isFinal) {
        //console.log("final",JSON.stringify(map.transform,null))
        map.tmp.lastX = map.transform.translate.x;
        map.tmp.lastY = map.transform.translate.y;

        settings.newMinScale = calcMinScale(map.transform.scale);
    }
}

function updatePanel(data){
    document.getElementById("scale").innerHTML = data.scale || "";
    document.getElementById("minScale").innerHTML = data.minScale || "";
    document.getElementById("x").innerHTML = data.x || "0";
    document.getElementById("y").innerHTML = data.y || "0";
}

initWindow();
mask.init(eleMask);

initHammer(eleMap);
map.init(eleMap, settings);