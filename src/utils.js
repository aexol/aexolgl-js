/**
 @module utils
 */
/**
 * TextNode class
 * @class TextNode
 * @constructor
 * @param {String} domNodeID
 * @return {TextNode}
 */
TextNode = function (domNodeID) {
    var node = document.getElementById(domNodeID);
    if (!node)
        return null;

    var str = "";
    var n = node.firstChild;
    while (n) {
        if (n.nodeType == 3) {
            str += n.textContent;
        }
        n = n.nextSibling;
    }
    this.str = str
    return this;
}
/**
 @method aGLExists
 @static
 */
var aGLExists = function (el) {
    /* Need to check if WebGL canvas exists */
    var canvas = document.getElementById(el);
    if (!canvas)
        return null;
    var gl = canvas.getContext("webgl", {alpha: false}) || canvas.getContext("experimental-webgl", {alpha: false});
    if (!gl) {
        alert("No webgl supporta");
        return null;
    }
    if (gl.FALSE == undefined)
        gl.FALSE = 0;
    if (gl.TRUE == undefined)
        gl.TRUE = 1;
    gl.canvas = canvas;
    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = canvas.clientHeight;
    return gl;
};
var gl;
/**
 @method setGL
 @static
 */
var setGL = function (el) {
    window.gl = aGLExists(el);
}
var returnGL = function (el) {
    return aGLExists(el);
}
/**
 @method aLoadFile
 @static
 @param url {String}
 @return {String} contents of file
 */
function aLoadFile(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function (e) {
        callback(e.target.response);
    };
    request.send();
}
/**
 @method aLoadJSON
 @static
 @param url {String}
 @return {JSON} contents of file
 */
function aLoadJSON(url, callback) {
    aLoadFile(url, function (e) {
        callback(JSON.parse(e))
    })
}
/**
 @method toVector
 @static
 @param args {args} Array[3] or (x,y,z) arguments
 @return {Vector} vector
 */
function toVector() {
    var argi = arguments[0]
    if (argi.length == 3) {
        return new Vector(argi[0], argi[1], argi[2]);
    }
    else if (argi.length == 1) {
        if (argi[0] instanceof Vector) {
            return argi[0]
        }
        else if (argi[0] instanceof Array) {
            return new Vector(argi[0][0], argi[0][1], argi[0][2])
        }
    }
}
function saveObjectOnTheFly(contentsJson) {
    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(contentsJson));
    window.open(url, '_blank');
    window.focus();
}
function canvasInit() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function enterFullScreen(elem) {
    var element = document.getElementById(elem)
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else {
        alert('Your browser does not support full screen mode, it is time to move to a newer ;)');
    }
    if (gl.canvas) {
        gl.canvas.width = screen.width
        gl.canvas.height = screen.height
    }
    canvasInit()
}
function setDict(obj, str, val) {
    str = str.split(".");
    while (str.length > 1)
        obj = obj[str.shift()];
    return obj[str.shift()] = val;
}
function powerof2(liczba) {
    return liczba != 0 && ((liczba & (liczba - 1)) == 0)
}
Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
}
function trimWhitespace(arr) {
    for (var a in arr) {
        if (arr[a] == "") {
            arr.splice(a, 1)
        }
    }
}
function trimString(str) {
    return String(str).replace(/^\s+|\s+$/g, '');
};
function compare(a1, a2) {
    if (a1 instanceof Array) {
        if (a1.length != a2.length)
            return false;
        for (var i = 0, l = a1.length; i < l; i++) {
            if (a1[i] instanceof Array && a2[i] instanceof Array) {
                if (!compareArrays(a1[i], a2[i]))
                    return false;
            }
            else if (a1[i] != a2[i]) {
                return false;
            }
        }
        return true;
    } else {
        return (a1 == a2)
    }
}
function defineDynamicProperty(splitter, prop) {
    var trt = prop
    return function (value) {
        this[splitter][prop] = value
    }
}
function printInFrame(fr, something, val) {
    if (gl.frame == fr) {
    }
}
Math.radToDeg = 180.0 / Math.PI
Math.degToRad = Math.PI / 180.0
