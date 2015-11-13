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
    var gl = canvas.getContext("webgl", {alpha: false});
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
    gl = aGLExists(el);
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
function __error(text){
  console.log(text);
}
Math.radToDeg = 180.0 / Math.PI
Math.degToRad = Math.PI / 180.0

var $jsonp = (function(){
  var that = {};

  that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
      on_success(data);
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  return that;
})();

/**
@module Math
*/
/**
  * Vector class
  * @class Vector
  * @constructor
  * @param {float} x X position
  * @param {float} y Y position
  * @param {float} z Z position
*/
var Vector = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

/**
* Returns the opposite vector
* @method negative
* @return {Vector} opposite Vector
*/
Vector.prototype.negative = function() {
	return new Vector(-this.x, -this.y, -this.z);
};
/**
* Add vector
* @method add
* @param {Vector} v Vector to add
* @return {Vector} sum of two vectors
*/
Vector.prototype.add = function(v) {
	var b = v instanceof Vector;
	return new Vector(this.x + ( b ? v.x : v), this.y + ( b ? v.y : v), this.z + ( b ? v.z : v));
};
/**
* Subtract vector
* @method subtract
* @param {Vector} v Vector to subtract
* @return {Vector} difference of two vectors
*/
Vector.prototype.subtract = function(v) {
	var b = v instanceof Vector;
	return new Vector(this.x - ( b ? v.x : v), this.y - ( b ? v.y : v), this.z - ( b ? v.z : v));
};
/**
* Multiply vector
* @method multiply
* @param {Vector} v Vector to multiply
* @return {Vector} product of two vectors
*/
Vector.prototype.multiply = function(v) {
	var b = v instanceof Vector;
	return new Vector(this.x * ( b ? v.x : v), this.y * ( b ? v.y : v), this.z * ( b ? v.z : v));
};
/**
* Divide vector
* @method divide
* @param {Vector} v Vector to divide
* @return {Vector} quotient of two vectors
*/
Vector.prototype.divide = function(v) {
	var b = v instanceof Vector;
	return new Vector(this.x / ( b ? v.x : v), this.y / ( b ? v.y : v), this.z / ( b ? v.z : v));
};
/**
* Dot product
* @method dot
* @param {Vector} v Vector
* @return {Vector} Dot product of two vectors
*/
Vector.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y + this.z * v.z;
};
/**
* Cross product
* @method cross
* @param {Vector} v Vector to cross
* @return {Vector} Cross product of two vectors
*/
Vector.prototype.cross = function(v) {
	return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
};
/**
* Returns the length of vector
* @method length
* @return {float} legth of vector
*/
Vector.prototype.length = function() {
	return Math.sqrt(this.dot(this));
};

/**
* Returns the unit
* @method unit
* @return {Vector} Vector divided by its length
*/
Vector.prototype.unit = function() {
	return this.divide(this.length());
};
/**
* Returns the minimum value of vector axes
* @method min
* @return {float} min value of (x,y,z)
*/
Vector.prototype.min = function() {
	return Math.min(Math.min(this.x, this.y), this.z);
};
/**
* Returns the minimum value of vector axes
* @method min
* @return {float} min value of (x,y,z)
*/
Vector.prototype.absmin = function() {
	return Math.min(Math.min(Math.abs(this.x), Math.abs(this.y)), Math.abs(this.z));
};
/**
* Returns the maximum value of vector axes
* @method max
* @return {float} max value of (x,y,z)
*/
Vector.prototype.max = function() {
	return Math.max(Math.max(this.x, this.y), this.z);
};
/**
* Returns the maximum value of vector absolute axes
* @method max
* @return {float} max value of (abs(x),abs(y),abs(z))
*/
Vector.prototype.absmax = function() {
	return Math.max(Math.max(Math.abs(this.x), Math.abs(this.y)), Math.abs(this.z));
};
/**
* Returns the normalized vector
* @method normalize
* @return {Vector} Vector normalized
*/
Vector.prototype.normalize = function() {
	return this.divide(this.absmax());
};
Vector.prototype.randomize = function() {
	return new Vector(this.x*Math.random(),this.y*Math.random(),this.z*Math.random())
};
Vector.prototype.toAngles = function() {
	return {
		theta : Math.atan2(this.z, this.x),
		phi : Math.asin(this.y / this.length())
	};
};
/**
* Returns the array of axes
* @method toArray
* @return {array[3]} Array [x,y,z]
*/
Vector.prototype.toArray = function(n) {
	return [this.x, this.y, this.z].slice(0, n || 3);
};
Vector.prototype.isZero = function() {
	return (this.x == 0.0 && this.y == 0.0 && this.z == 0.0)
}
Vector.prototype.copy = function(v){
	return new Vector(this.x, this.y, this.z)
}
Vector.copy = function(v){
	return new Vector(v.x, v.y, v.z)
}
/**
 * Gives distance between two Vector objects
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {float|*}
 */
Vector.distance = function(v,v2){
	if( v instanceof Vector && v2 instanceof Vector){
	}
	else{
		var v = new Vector(v[0],v[1],v[2]);
		var v2 = new Vector(v2[0],v2[1],v2[2]);
	}
	return v2.subtract(v).length();
}
Vector.distanceXZ = function(v,v2){
	if( v instanceof Vector && v2 instanceof Vector){
	}
	else{
		var v = new Vector(v[0],0.0,v[2]);
		var v2 = new Vector(v2[0],0.0,v2[2]);
	}
	return v2.subtract(v).length();
}
Vector.distanceXY = function(v,v2){
	if( v instanceof Vector && v2 instanceof Vector){
	}
	else{
		var v = new Vector(v[0],v[1],0.0);
		var v2 = new Vector(v2[0],v2[1],0.0);
	}
	return v2.subtract(v).length();
}
Vector.distanceYZ = function(v,v2){
	if( v instanceof Vector && v2 instanceof Vector){
	}
	else{
		var v = new Vector(0.0,v[1],v[2]);
		var v2 = new Vector(0.0,v2[1],v2[2]);
	}
	return v2.subtract(v).length();
}
// ### Static Methods
// `Vector.random()` returns a vector with a length of 1 and a statistically
// uniform direction. `Vector.lerp()` performs linear interpolation between
// two vectors.
Vector.fromAngles = function(theta, phi) {
	return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.random = function() {
	return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function(a, b) {
	return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function(a, b) {
	return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function(a, b, fraction) {
	return a.add(b.subtract(a).multiply(fraction));
};

Vector.fromArray = function(a) {
	return new Vector(a[0], a[1], a[2]);
};

/**
  * Vector4 class
  * @class Vector4
  * @constructor
  * @param {float} x X position
  * @param {float} y Y position
  * @param {float} z Z position
  * @param {float} w W position
*/
var Vector4 = function(x, y, z,w) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
    this.w = w || 1;
};
/**
* Dot product
* @method dot
* @param {Vector4} v Vector4
* @return {Vector4} Dot product of two vectors
*/
Vector4.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
};
/* End of Vector */
/**
  * Matrix3 class
  * @class Matrix3
  * @constructor
*/
var Matrix3 = function(){
	this.m = Array.prototype.concat.apply([],arguments);
	if(!this.m.length){
		this.m - [1,0,0,0,1,0,0,0,1];
	}
}
/**
* Exchanges columns for rows.
* @method transpose
* @return {Matrix3} Transposed matrix3
*/
Matrix3.prototype.transpose = function() {
	var m = this.m;
	return new Matrix3(m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]);
};

/**
  * Matrix class
  * @class Matrix
  * @constructor
*/
var Matrix = function() {
	this.m = Array.prototype.concat.apply([], arguments);
	if(!this.m.length) {
		this.m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	}
};

/**
* Returns the matrix that when multiplied with this matrix results in the
* identity matrix.
* @method inverse
* @return {Matrix} Inverted matrix
*/
Matrix.prototype.inverse = function() {
	var m = this.m, inv = new Matrix(m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10], -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10], m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6], -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6], -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10], m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10], -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6], m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6], m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9], -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9], m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5], -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5], -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9], m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9], -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5], m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5]);
	var det = m[0] * inv.m[0] + m[1] * inv.m[4] + m[2] * inv.m[8] + m[3] * inv.m[12];
	if(det == 0)
		return new Matrix();
	for(var i = 0; i < 16; i++)
	inv.m[i] /= det;
	return inv;
};


/**
* Returns the matrix that when multiplied with this matrix results in the
* identity matrix3.
* @method toInverseMat3
* @return {Matrix3} Inverted matrix3
*/
Matrix.prototype.toInverseMat3 = function () {
        // Cache the matrix values (makes for huge speed increases!)
        var mat = this.m
        var a00 = mat[0], a01 = mat[1], a02 = mat[2],
            a10 = mat[4], a11 = mat[5], a12 = mat[6],
            a20 = mat[8], a21 = mat[9], a22 = mat[10],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            d = a00 * b01 + a01 * b11 + a02 * b21,
            id;

        if (!d) { return null; }
        id = 1 / d;

        var dst = new Matrix3()
		dest = dst.m
        dest[0] = b01 * id;
        dest[1] = (-a22 * a01 + a02 * a21) * id;
        dest[2] = (a12 * a01 - a02 * a11) * id;
        dest[3] = b11 * id;
        dest[4] = (a22 * a00 - a02 * a20) * id;
        dest[5] = (-a12 * a00 + a02 * a10) * id;
        dest[6] = b21 * id;
        dest[7] = (-a21 * a00 + a01 * a20) * id;
        dest[8] = (a11 * a00 - a01 * a10) * id;
        return dst;
};
Matrix.prototype.nfm = function(){
    var mat = this.m
    var a00 = mat[0];
    var a01 = mat[1];
    var a02 = mat[2];
    var a10 = mat[4];
    var a11 = mat[5];
    var a12 = mat[6];
    var a20 = mat[8];
    var a21 = mat[9];
    var a22 = mat[10];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;
    var d = a00 * b01 + a01 * b11 + a02 * b21;
    var id = 1.0/d;
    var newm = new Matrix3();
    var dest = newm.m
    dest[0] = b01 * id;
    dest[1] = b11 * id;
    dest[2] = b21 * id;
    dest[3] = (-a22 * a01 + a02 * a21) * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a21 * a00 + a01 * a20) * id;
    dest[6] = (a12 * a01 - a02 * a11) * id;
    dest[7] = (-a12 * a00 + a02 * a10) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;
    return newm;
}
/**
* Exchanges columns for rows.
* @method transpose
* @return {Matrix} Transposed matrix
*/
Matrix.prototype.transpose = function() {
	var m = this.m;
	return new Matrix(m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]);
};

/**
* Concatenates the transforms for this matrix and `matrix`.
* @method multiply
* @param {Matrix} matrix Matrix to multiply
* @return {Matrix} Multiplied matrix
*/
Matrix.prototype.multiply = function(matrix) {
	var a = this.m, b = matrix.m;
	return new Matrix(a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15], a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15], a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15], a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]);
};
/**
* Transforms the vector as a point with a w coordinate of 1. This
* means translations will have an effect, for example.
* @method transformPoint
* @return {Vector} Transformed Vector
*/
Matrix.prototype.transformPoint = function(v) {
	var m = this.m;
	if( v instanceof Vector ){
	return new Vector(
	m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3],
	m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7],
	m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11]
	).divide(m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15]);
	}
	else{
	return new Vector(
		m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
	m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
	m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]
	).divide(m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15]);
	}
};

/**
* Transforms the vector as a vector with a w coordinate of 0. This
* means translations will have no effect, for example.
* @method transformVector
* @return {Vector} Transformed Vector
*/
Matrix.prototype.transformVector = function(v) {
	var m = this.m;
	return new Vector(m[0] * v.x + m[1] * v.y + m[2] * v.z, m[4] * v.x + m[5] * v.y + m[6] * v.z, m[8] * v.x + m[9] * v.y + m[10] * v.z);
};

/**
* Sets up a perspective transform, which makes far away objects appear smaller
* than nearby objects. The `aspect` argument is the width divided by the height
* of your viewport and `fov` is the top-to-bottom angle of the field of view in
* degrees.
* @method perspective
* @param {float} fov Field of View
* @param {float} aspect Aspect ratio
* @param {float} near Near plane
* @param {float} far Far plane
* @return {Matrix} Result matrix
*/
Matrix.perspective = function(fov, aspect, near, far) {
	var y = Math.tan(fov * Math.PI / 360) * near;
	var x = y * aspect;
	return Matrix.frustum(-x, x, -y, y, near, far);
};

/**
* Sets up a viewing frustum, which is shaped like a truncated pyramid with the
* camera where the point of the pyramid would be. This emulates the OpenGL
* @method frustum
* @param {float} l Left
* @param {float} r Right
* @param {float} b Bottom
* @param {float} t Top
* @param {float} n Near
* @param {float} f Far
* @return {Matrix} Result matrix
*/
Matrix.frustum = function(l, r, b, t, n, f) {
	return new Matrix(2 * n / ( r - l), 0, (r + l) / ( r - l), 0, 0, 2 * n / ( t - b), (t + b) / ( t - b), 0, 0, 0, -(f + n) / ( f - n), -2 * f * n / ( f - n), 0, 0, -1, 0);
};
/**
* Sets up an ortho perspective transform. The `aspect` argument is the width divided by the height
* of your viewport and `fov` is the top-to-bottom angle of the field of view in
* degrees.
* @method orthoPerspective
* @param {float} fov Field of View
* @param {float} aspect Aspect ratio
* @param {float} near Near plane
* @param {float} far Far plane
* @return {Matrix} Result matrix
*/
Matrix.orthoPerspective = function(fov,aspect,near,far) {
	var y = Math.tan(fov * Math.PI / 360) * near;
	var x = y * aspect;
	return Matrix.ortho(-x, x, -y, y, near, far);
};
/**
* Creates an orthographic projection, in which objects are the same size no
* matter how far away or nearby they are.
* @method ortho
* @param {float} l Left
* @param {float} r Right
* @param {float} b Bottom
* @param {float} t Top
* @param {float} n Near
* @param {float} f Far
* @return {Matrix} Result matrix
*/
Matrix.ortho = function(l, r, b, t, n, f) {
	return new Matrix(2 / ( r - l), 0, 0, (r + l) / ( r - l), 0, 2 / ( t - b), 0, (t + b) / ( t - b), 0, 0, -2 / ( f - n), (f + n) / ( f - n), 0, 0, 0, 1);
};
/**
* Creates a matrix that scales by the vector `x, y, z`.
* @method scale
* @param {float} x Vector X value
* @param {float} y Vector Y value
* @param {float} z Vector Z value
* @return {Matrix} Result matrix
*/
Matrix.scale = function(x, y, z) {
	return new Matrix(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
};
/**
* Creates a matrix that translates by the vector `x, y, z`.
* @method translate
* @param {float} x Vector X value
* @param {float} y Vector Y value
* @param {float} z Vector Z value
* @return {Matrix} Result matrix
*/
Matrix.translate = function(x, y, z) {
	return new Matrix(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
};
/**
* Creates a matrix that rotates by `a` degrees around the vector `x, y, z`.
* @method rotate
* @param {float} a Angle in degrees
* @param {float} x Vector X value
* @param {float} y Vector Y value
* @param {float} z Vector Z value
* @return {Matrix} Result matrix
*/
Matrix.rotate = function(a, x, y, z) {
	if(a && (x || y || z)) {
		var d = Math.sqrt(x * x + y * y + z * z);
		a *= Math.PI / 180;
		x /= d;
		y /= d;
		z /= d;
		var c = Math.cos(a), s = Math.sin(a), t = 1 - c;
		return new Matrix(x * x * t + c, x * y * t - z * s, x * z * t + y * s, 0, y * x * t + z * s, y * y * t + c, y * z * t - x * s, 0, z * x * t - y * s, z * y * t + x * s, z * z * t + c, 0, 0, 0, 0, 1);
	} else {
		return new Matrix();
	}
};
/**
* Creates a matrix that rotates in three axes `x, y, z`.
* @method rotate
* @param {float} xAngle in degrees
* @param {float} yAngle in degrees
* @param {float} zAngle in degrees
* @return {Matrix} Result matrix
*/
Matrix.prototype.rotateVector = function(xAngle,yAngle,zAngle) {
    var m = this
	m = m.multiply(Matrix.rotate(xAngle, 1, 0, 0));
    m = m.multiply(Matrix.rotate(yAngle, 0, 1, 0));
    m = m.multiply(Matrix.rotate(zAngle, 0, 0, 1));
    return m
};
/**
* Create a matrix that puts the camera at the eye point `ex, ey, ez` looking
* toward the center point `cx, cy, cz` with an up direction of `ux, uy, uz`.
* @method lookAt
* @param {Vector} e Eye point
* @param {Vector} c Center point
* @param {Vector} u Up vector
* @return {Matrix} Result matrix
*/
Matrix.lookAt = function(e,c,u) {
	var f = e.subtract(c).unit();
	var s = u.cross(f).unit();
	var t = f.cross(s).unit();
	return new Matrix(s.x, s.y, s.z, -s.dot(e), t.x, t.y, t.z, -t.dot(e), f.x, f.y, f.z, -f.dot(e), 0, 0, 0, 1);
};

/**
  * Quaternion class
  * @class Quaternion
  * @constructor
*/
Quaternion = function(x, y, z, w, epsilon){
	if( arguments.length > 3){
		epsilon = epsilon || Number.EPSILON
		var mag = x * x + y * y + z * z + w*w;
		if (Math.abs(mag - 1) > epsilon) {
            magSqrt = Math.sqrt(mag);
            x /= magSqrt;
            y /= magSqrt;
            z /= magSqrt;
            w /= magSqrt;
        }
	}
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
	this.w = w || 1.0;
}
/**
@method getMatrix
Returns the quaternion matrix
@return {Matrix}
*/
Quaternion.prototype.getMatrix = function(){
	var x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz;

	var rotMatrix = new Matrix()
	rotMatrix.m[15] = 1.0

	x2 = this.x+this.x;
	y2 = this.y+this.y
	z2 = this.z + this.z

	wx = x2*this.w
	wy = y2*this.w
	wz = z2*this.z
	xx = x2*this.x
	xy = y2*this.x
	xz = z2*this.x
	yy = y2*this.y
	yz = z2*this.y
	zz = z2*this.z

	rotMatrix[0] = 1.0 - (yy + zz)
	rotMatrix[4] =xy - wz
	rotMatrix[8] =xz + wy

	rotMatrix[1] =xy + wz
	rotMatrix[5] =1.0 - (xx + zz)
	rotMatrix[9] =yz - wx

	rotMatrix[2] =xz - wy
	rotMatrix[6] =yz + wx
	rotMatrix[10] =1.0 - (xx + yy)

	return rotMatrix
}
/**
@method negative
Returns negative quaternion
@return {Quaternion}
*/
Quaternion.prototype.negative = function(){
	return new Quaternion(-this.x, -this.y, -this.z, -this.w);
}
/**
@method subtract
@param q {Quaternion}
Subtracts one quaternion from another
@return {Quaternion}
*/
Quaternion.prototype.subtract = function(q){
	return new Quaternion(this.x-q.x,this.y-q.y,this.z-q.z,this.w-q.w)
}
/**
@method add
@param q {Quaternion}
Adds 2 quaternions
@return {Quaternion}
*/
Quaternion.prototype.add = function(q){
	return new Quaternion(this.x+q.x,this.y+q.y,this.z+q.z,this.w+q.w)
}
/**
@method multiply
@param q {Quaternion}
Multiplies 2 quaternions
@return {Quaternion}
*/
Quaternion.prototype.multiply = function(q) {
	var b = q instanceof Quaternion
	return new Quaternion(( b ? q.w*this.x + q.x*this.w - q.y*this.z + q.z*this.y : this.x*q),
						  ( b ? q.w*this.y + q.y*this.w - q.z*this.x + q.x*this.z : this.y*q),
						  ( b ? q.w*this.z + q.z*this.w - q.x*this.y + q.y*this.x : this.z*q),
						  ( b ? q.w*this.w - q.x*this.w - q.y*this.y - q.z*this.z : this.w*q))
}
/**
@method divide
@param q {Quaternion}
Divides 2 quaternions
@return {Quaternion}
*/
Quaternion.prototype.divide = function(q) {
	var b = q instanceof Quaternion
	return new Quaternion(( b ? q.w*this.x + q.x*this.w - q.y*this.z + q.z*this.y : q),
						  ( b ? q.w*this.y + q.y*this.w - q.z*this.x + q.x*this.z : q),
						  ( b ? q.w*this.z + q.z*this.w - q.x*this.y + q.y*this.x : q),
						  ( b ? q.w*this.w - q.x*this.w - q.y*this.y - q.z*this.z : q))
};
/**
@method magnitudeSquared
Returns the squared length of quaternion
@return {Float}
*/
Quaternion.prototype.magnitudeSquared = function(){
	return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w
}
/**
@method magnitude
Returns the length of quaternion
@return {Float}
*/
Quaternion.prototype.magnitude = function(){
	return Math.sqrt(this.magnitudeSquared());
}
/**
@method inverse
Returns inverted quaternion
@return {Quaternion}
*/
Quaternion.prototype.inverse = function(){
	var msqr = this.magnitudeSquared()
	return new Quaternion(-this.x/msqr, -this.y/msqr, -this.z/msqr, -this.w/msqr);
}
/**
@method rotateVector
@param v {Vector}
Rotate Vector with quaternion
@return {Vector}
*/
Quaternion.prototype.rotateVector = function(v){
	qVector = new Quaternion(v.x,v.y,v.z,0.0)
	qPrim = this.negative()
	mult = this.multiply(qVector).multiply(qPrim)
	return new Vector(mult.x,mult.y,mult.z)
}
/**
@method getQuaternionFromEulerAnglesRad
@param x {Float}
@param y {Float}
@param z {Float}
Create quaternion from rotation XYZ in Radians
@return {Quaternion}
*/
Quaternion.getQuaternionFromEulerAnglesRad = function(x,y,z){
	var w,c1,s1,c2,s2,c3,s3,c1c2,s1s2
	c1 = Math.cos(x/2)
	s1 = Math.sin(x/2)
	c2 = Math.cos(y/2)
	s2 = Math.sin(y/2)
	c3 = Math.cos(z/2)
	s3 = Math.sin(z/2)
	c1c2 = c1*c2
	s1s2 = s1*s2
	w = c1c2*c3+s1s2*s3
	x = s1*c2*c3-c1*s2*s3
	y = c1*s2*c3+s1*c2*s3
	z = c1c2*s3-s1s2*c3
	return new Quaternion(x,y,z,w)
}
/**
@method getQuaternionFromEulerAnglesRad
@param x {Float}
@param y {Float}
@param z {Float}
Create quaternion from rotation XYZ in Degrees
@return {Quaternion}
*/
Quaternion.getQuaternionFromEulerDeg = function(x,y,z){
	return Quaternion.getQuaternionFromEulerAnglesRad(Math.degToRad*x,Math.degToRad*y,Math.degToRad*z)
}
/**
@method getQuaternionFromAxisAngle
@param v {Vector}
Create quaternion from axis angle in radians
@return {Quaternion}
*/
Quaternion.getQuaternionFromAxisAngle = function(v,fi){
	var x,y,z,w,rad,scale,vec
	if(v.isZero){
		return new Quaternion()
	}
	var vLen = v.length()
	if(Math.abs(vLen-1.0) > Number.EPSILON){
		vec = v.unit()
	}
	rad = fi /2.0
	w = Math.cos(rad)
	scale = Math.sin(rad)
	x = vec.x*scale;
	y = vec.y*scale;
	z = vec.z*scale;
	return new Quaternion(x,y,z,w)
}
/**
@method getQuaternionFromAxisAngle
@param v {Vector}
Create quaternion from axis angle in degrees
@return {Quaternion}
*/
Quaternion.getQuaternionFromAxisAngleDeg = function(v,fi){
	return Quaternion.getQuaternionFromAxisAngle(v,Math.degToRad*fi)
}
/**
@method getQuaternionFromMatrix
@param  m {Matrix}
Create quaternion from Matrix
@return {Quaternion}
*/
Quaternion.getQuaternionFromMatrix= function(m){
	var qw,qx,qy,qz
	var matrix = m.m
	var trace = matrix[0] + matrix[5] + matrix[10];
	if (trace > 0) {
		S = Math.sqrt(trace + 1.0) * 2; // S=4*qw
		qw = 0.25 * S;
		qx = (matrix[9] - matrix[6]) / S;
		qy = (matrix[2] - matrix[8]) / S;
		qz = (matrix[4] - matrix[1]) / S;
	} else if ((matrix[0] > matrix[5])&(matrix[0] > matrix[10])) {
		S = Math.sqrt(1.0 + matrix[0] - matrix[5] - matrix[10]) * 2; // S=4*qx
		qw = (matrix[9] - matrix[6]) / S;
		qx = 0.25 * S;
		qy = (matrix[1] + matrix[4]) / S;
		qz = (matrix[2] + matrix[8]) / S;
	} else if (matrix[5] > matrix[10]) {
		S = Math.sqrt(1.0 + matrix[5] - matrix[0] - matrix[10]) * 2; // S=4*qy
		qw = (matrix[2] - matrix[8]) / S;
		qx = (matrix[1] + matrix[4]) / S;
		qy = 0.25 * S;
		qz = (matrix[6] + matrix[9]) / S;
	} else {
		S = Math.sqrt(1.0 + matrix[10] - matrix[0] - matrix[5]) * 2; // S=4*qz
		qw = (matrix[4] - matrix[1]) / S;
		qx = (matrix[2] + matrix[8]) / S;
		qy = (matrix[6] + matrix[9]) / S;
		qz = 0.25 * S;
	}
	return new Quaternion(qx, qy, qz, qw);
}
/**
@method getQuaternionFromSpherical
@param  latitude {Float}
@param  longtitude {Float}
@param  angle {Float}
Create quaternion from spherical coordinates
@return {Quaternion}
*/
Quaternion.getQuaternionFromSpherical = function(latitude,longitude,angle) {
		var sin_a,cos_a,sin_lat,cos_lat,sin_long,cos_long,qx,qy,qz,qw
        sin_a = Math.sin(angle / 2.0)
        cos_a = Math.cos(angle / 2.0)
        sin_lat = Math.sin(latitude)
        cos_lat = Math.cos(latitude)

        sin_long = Math.sin(longitude)
        cos_long = Math.cos(longitude)

        qx = sin_a * cos_lat * sin_long
        qy = sin_a * sin_lat
        qz = sin_a * sin_lat * cos_long
        qw = cos_a
        return new Quaternion(qx, qy, qz, qw)
}
/**
@method getRotationTo
@param fromV {Vector}
@param toV {Vector}
get Quaternion from rotation from one Vector to another.
@return {Quaternion}
*/
Quaternion.getRotationTo = function(fromV,toV){
	var c = fromV.cross(toV)
	var d = fromV.dot(toV)
	return new Quaternion(c.x,c.y,c.z,d+Math.sqrt(fromV.dot(fromV)*toV.dot(toV)))
}
/**
  * Frustum class
  * @class Frustum
  * @constructor
*/
Frustum = function(){
    this.planes = new Array(6)
    this.corners = new Array(8)
}
Frustum.prototype.fromPerspectiveMatrix = function(matrix){
    var mat = matrix.m
        this.planes[0] = new Vector4(mat[8]+mat[12], mat[9]+mat[13], mat[10]+mat[14], mat[11]+mat[15]);
        this.planes[1] = new Vector4(-mat[8]+mat[12], -mat[9]+mat[13], -mat[10]+mat[14], -mat[11]+mat[15]);
        this.planes[2] = new Vector4(mat[4]+mat[12], mat[5]+mat[13], mat[6]+mat[14], mat[7]+mat[15]);
        this.planes[3] = new Vector4(-mat[4]+mat[12], -mat[5]+mat[13], -mat[6]+mat[14], -mat[7]+mat[15]);
        this.planes[4] = new Vector4(mat[0]+mat[12], mat[1]+mat[13], mat[2]+mat[14], mat[3]+mat[15]);
        this.planes[5] = new Vector4(-mat[0]+mat[12], -mat[1]+mat[13], -mat[2]+mat[14], -mat[3]+mat[15]);
}
Frustum.prototype.boxInFrustum = function(box){
    for(var p in this.planes){
        var checkPlane = this.planes[p]
        var out = 0;
        out += ((checkPlane.dot(new Vector4(box.min.x, box.min.y, box.min.z, 1.0) ) < 0.0 )?1:0);
        if (out == 0)
            continue;
        out += ((checkPlane.dot(new Vector4(box.max.x, box.min.y, box.min.z, 1.0) ) < 0.0 )?1:0);
        if (out == 1)
            continue;
        out += ((checkPlane.dot(new Vector4(box.min.x, box.max.y, box.min.z, 1.0) ) < 0.0 )?1:0);
        if (out == 2)
            continue;
        out += ((checkPlane.dot(new Vector4(box.max.x, box.max.y, box.min.z, 1.0) ) < 0.0 )?1:0);
        if (out == 3)
            continue;
        out += ((checkPlane.dot(new Vector4(box.min.x, box.min.y, box.max.z, 1.0) ) < 0.0 )?1:0);
        if (out == 4)
            continue;
        out += ((checkPlane.dot(new Vector4(box.max.x, box.min.y, box.max.z, 1.0) ) < 0.0 )?1:0);
        if (out == 5)
            continue;
        out += ((checkPlane.dot(new Vector4(box.min.x, box.max.y, box.max.z, 1.0) ) < 0.0 )?1:0);
        if (out == 6)
            continue;
        out += ((checkPlane.dot(new Vector4(box.max.x, box.max.y, box.max.z, 1.0) ) < 0.0 )?1:0);
        if( out==8 ) return false;
    }
    return true
}
Frustum.prototype.sphereInFrustum = function(sphere){
    for(var p in this.planes){
        var checkPlane = this.planes[p]
        var sc = sphere.center
        fDistance = checkPlane.x*sc.x+checkPlane.y*sc.y+checkPlane.z*sc.z+checkPlane.d
		if(fDistance < -sphere.radius){
			return false;
        }
    }
    return true
}

/**
 @module aexolGL
 */
/**
 * MObject class
 * @class MObject
 * @constructor
 * @param {MObject} parent of MObject object<br>
 */
MObject = function (parent) {
    this.children = []
    if (parent) {
        this.setParent(parent)
    }
}
/**
 Sets parent on MObject and unbinds current parent in RenderTree
 @method addChilds
 @param mobject {MObject} mobject object to add as a child to RenderTree
 */
MObject.prototype.addChilds = function (mobject) {
    if (this.children.indexOf(mobject) == -1) {
        this.children.push(mobject)
    }
}
/**
 Sets parent on MObject and unbinds current parent in RenderTree.
 Usually this is done inside GameObject, but you have also possibility
 to construct RenderTree by yourself.
 @method setParent
 @param parent {MObject} parent object
 @example
 world = new Scene()
 gshader = new basicShader()
 someMaterial = new Material({})
 gshader.setParent(world)
 someMaterial.setParent(world)
 */
MObject.prototype.setParent = function (parent) {
    if (this.parent == parent) {
        return
    }
    if (this.parent != null) {
        this.parent.removeChild(this)
    }
    this.parent = parent
    parent.addChilds(this)
}
MObject.prototype.removeChild = function (child) {
    this.children.splice(this.children.indexOf(child), 1)
}
/**
 Removes MObject from RenderTree
 @method remove
 */
MObject.prototype.remove = function () {
    this.parent.removeChild(this)
}
/**
 * Aex class - Aex objects hold the modelView `Matrix`
 * @class Aex
 * @extends MObject
 * @constructor
 * @param [options={}] {Dict} Dictionary of options when creating Aex object
 * @return {Aex} Returns Aex Object
 * @example
 *      var aex = new Aex({
 *          uniforms:{
 *              tiling:[2.0,2.0]
 *          }
 *      })
 */
Aex = function (options) {
    MObject.call(this)
    this.texture = null;
    this.wireframe = 0;
    this.modelView = new Matrix();
    this.aabb = {};
    this._size = new Vector(1.0, 1.0, 1.0);
    this._rotation = new Vector(0.0, 0.0, 0.0);
    this._position = new Vector(0.0, 0.0, 0.0);
    this.parentMatrix = new Matrix()
    this.uniforms = {tiling: [1.0, 1.0], material: {}}
    var t = this

    for (var st in Material._settable) {
        var propertyName = Material._settable[st]
        Object.defineProperty(this.uniforms, propertyName, {
            set: defineDynamicProperty("material", propertyName)
        })
    }
    this.aTextures = {}
    this.uniformsDone = 0
    for (var i in options) {
        var o = options[i];
        this[i] = o;
    }
    this.__defineGetter__("aabb", function () {
        var ab = this.parent.aabb;
        var abb = {
            min: ab.min.multiply(this.size).add(this.position),
            max: ab.max.multiply(this.size).add(this.position)
        }
        return abb
    });
    this.__defineGetter__("sphere", function () {
        var sphere = this.parent.sphere;
        var sp = {
            radius: sphere.radius * this.size.max(),
            center: sphere.center.add(this.position)
        }
        return sp
    });
    /**
     * Position of object
     * @property position
     * @type Vector
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.position = new Vector(1.0,2.0,3.0)
     */
    this.__defineSetter__("position", function (val) {
        this._position = val
    });
    this.__defineGetter__("position", function () {
        return this._position
    });
    /**
     * x Position of object
     * @property x
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.x = 20.0
     */
    this.__defineSetter__("x", function (val) {
        this._position.x = val
        this.setModelView()
    });
    /**
     * y Position of object
     * @property y
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.y = 20.0
     */
    this.__defineSetter__("y", function (val) {
        this._position.y = val
        this.setModelView()
    });
    /**
     * z Position of object
     * @property z
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.z = 20.0
     */
    this.__defineSetter__("z", function (val) {
        this._position.z = val
        this.setModelView()
    });
    this.__defineGetter__("x", function () {
        return this._position.x
    });
    this.__defineGetter__("y", function () {
        return this._position.y
    });
    this.__defineGetter__("z", function () {
        return this._position.z
    });
    /**
     * Rotation of object
     * @property rotation
     * @type Vector
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.rotation = new Vector(0.0,90.0,0.0)
     */
    this.__defineSetter__("rotation", function (val) {
        this._rotation = val
    });
    this.__defineGetter__("rotation", function () {
        return this._rotation
    });

    /**
     * x Rotation of object
     * @property rotX
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.rotX = 20.0
     */
    this.__defineSetter__("rotX", function (val) {
        this._rotation.x = val
        this.setModelView()
    });
    /**
     * y Rotation of object
     * @property rotY
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.rotY = 20.0
     */
    this.__defineSetter__("rotY", function (val) {
        this._rotation.y = val;
        this.setModelView()
    });
    /**
     * z Rotation of object
     * @property rotZ
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.rotZ = 20.0
     */
    this.__defineSetter__("rotZ", function (val) {
        this._rotation.z = val
        this.setModelView()
    });
    this.__defineGetter__("rotX", function () {
        return this._rotation.x
    });
    this.__defineGetter__("rotY", function () {
        return this._rotation.y
    });
    this.__defineGetter__("rotZ", function () {
        return this._rotation.z
    });

    this.__defineSetter__("size", function (val) {
        this._size = val;
    });
    this.__defineGetter__("size", function () {
        return this._size
    });
    /**
     * x scale of object
     * @property scaleX
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.scaleX = 2.0
     */
    this.__defineSetter__("scaleX", function (val) {
        this._size.x = val;
        this.setModelView()
    });
    /**
     * y scale of object
     * @property scaleY
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.scaleY = 2.0
     */
    this.__defineSetter__("scaleY", function (val) {
        this._size.y = val
        this.setModelView()
    });
    /**
     * z scale of object
     * @property scaleZ
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new Aex()
     *     game.scaleZ = 2.0
     */
    this.__defineSetter__("scaleZ", function (val) {
        this._size.z = val
        this.setModelView()
    });
    this.__defineGetter__("scaleX", function () {
        return this._size.x
    });
    this.__defineGetter__("scaleY", function () {
        return this._size.y
    });
    this.__defineGetter__("scaleZ", function () {
        return this._size.z
    });
}
Aex.prototype = Object.create(MObject.prototype);
Aex.prototype.constructor = Aex
Aex.prototype.getAABB = function () {
    return this.parent.getAABB()
}
/**
 * Force set shader uniforms
 * @method setUniforms
 * @example
 *      var aex = new Aex()
 *      aex.setUniforms()
 */
Aex.prototype.setUniforms = function () {
    this.uniforms._gl_ModelViewMatrix = this.modelView.m
    this.uniforms.NormalMatrix = this.NormalMatrix.m
    gl.currentShader.uniforms(this.uniforms);
}
/**
 * Centers pivot of an Aex to parent Mesh
 * @method centerPivot
 */
Aex.prototype.centerPivot = function () {
    if (this.parent) {
        var cc = this.parent.getCenter();
        var ccN  = cc.negative()
        this.parent.move(ccN.x,ccN.y,ccN.z);
        this.move(cc.x,cc.y,cc.z);
    }
    return this
}
/**
 * Move object
 * @method move
 * @param x - x axis
 * @param y - y axis
 * @param z - z axis
 * @param r - relative transform
 * @example
 *      var aex = new Aex()
 *      aex.move(0,1,2)
 */
Aex.prototype.move = function (x, y, z, r) {
    if (r) {
        this.position = this.position.add(new Vector(x, y, z))
    }
    else {
        this.position = new Vector(x, y, z)
    }
    this.setModelView()
}
/**
 * Rotate object
 * @method rotate
 * @param x - angle around x axis
 * @param y - angle around y axis
 * @param z - angle around z axis
 * @param r - relative transform
 * @example
 *      var aex = new Aex()
 *      aex.rotate(0,1,2)
 */
Aex.prototype.rotate = function (x, y, z, r) {
    if (r) {
        this.rotation = this.rotation.add(new Vector(x, y, z))
    }
    else {
        this.rotation = new Vector(x, y, z)
    }
    this.setModelView()
}
/**
 * Scale object
 * @method scale
 * @param x - x axis
 * @param y - y axis
 * @param z - z axis
 * @param r - relative transform
 * @example
 *      var aex = new Aex()
 *      aex.scale(0,1,2)
 */
Aex.prototype.scale = function (x, y, z, r) {
    if (r) {
        this.size = this.size.add(new Vector(x, y, z))
    }
    else {
        this.size = new Vector(x, y, z)
    }
    this.setModelView()
}
/**
 * Rotate object around point
 * @method rotateAroundPoint
 * @param {Vector} center pivot point location
 * @param angle - rotation in degrees
 * @param x - usage of x axis
 * @param y -  usage of y axis
 * @param z -  usage of z axis
 * @example
 *      var aex = new Aex()
 *      aex.rotateAroundPoint(new Vector(0,1,1),90,0,1,0)
 */
Aex.prototype.rotateAroundPoint = function (center, x, y, z) {
    var vNewPosition = new Vector();
    var angle = Math.max(Math.abs(x),Math.abs(y),Math.abs(z));

    var xx = x/angle;
    var yy = y/angle;
    var zz = z/angle;
    var vPos = this.position.subtract(center);
    // Calculate the sine and cosine of the angle once
    var cosTheta = Math.cos(angle * Math.degToRad);
    var sinTheta = Math.sin(angle * Math.degToRad);

    // Find the new x position for the new rotated point
    vNewPosition.x = (cosTheta + (1 - cosTheta) * xx * xx) * vPos.x;
    vNewPosition.x += ((1 - cosTheta) * xx * yy - zz * sinTheta) * vPos.y;
    vNewPosition.x += ((1 - cosTheta) * xx * zz + yy * sinTheta) * vPos.z;

    // Find the new y position for the new rotated point
    vNewPosition.y = ((1 - cosTheta) * xx * yy + zz * sinTheta) * vPos.x;
    vNewPosition.y += (cosTheta + (1 - cosTheta) * yy * yy) * vPos.y;
    vNewPosition.y += ((1 - cosTheta) * yy * zz - xx * sinTheta) * vPos.z;

    // Find the new z position for the new rotated point
    vNewPosition.z = ((1 - cosTheta) * xx * zz - yy * sinTheta) * vPos.x;
    vNewPosition.z += ((1 - cosTheta) * yy * zz + xx * sinTheta) * vPos.y;
    vNewPosition.z += (cosTheta + (1 - cosTheta) * zz * zz) * vPos.z;

    gl.estra = [vPos,x,y,z,this.position,vNewPosition,cosTheta,sinTheta,angle]
    this.position = vNewPosition;
    this.rotate(x,y,z,1);
    return this
}
/**
 * Sets aex modelview and Normal matrix. Internal function done after transformations as move, rotate etc..
 * @internal
 * @method setModelView
 */
Aex.prototype.setModelView = function () {
    var m = this.parentMatrix
    m = m.multiply(Matrix.scale(this.size.x, this.size.y, this.size.z));
    m = m.multiply(Matrix.rotate(this.rotation.x, 1, 0, 0));
    m = m.multiply(Matrix.rotate(this.rotation.y, 0, 1, 0));
    m = m.multiply(Matrix.rotate(this.rotation.z, 0, 0, 1));
    m = m.multiply(Matrix.translate(this.position.x, this.position.y, this.position.z));
    this.modelView = m
    this.NormalMatrix = this.modelView.toInverseMat3()

}
/**
 * Draw the Aex inside draw function of your Scene
 * @internal
 * @method draw
 */
Aex.prototype.draw = function (uniforms) {
    if (gl.frustum.sphereInFrustum(this.sphere) == true) {
        if (uniforms) {
            gl.currentShader.uniforms(uniforms)
        }
        this.setUniforms()
        var triangleBL = gl.indexBuffers.triangles.buffer.length
        gl.drawElements(gl.TRIANGLES, triangleBL, gl.UNSIGNED_SHORT, 0);
        for (var child in this.children) {
            this.children[child].draw()
        }
    }
}
/**
 * Scene class
 * @class Scene
 * @constructor
 * @example
 *      var world = new Scene()
 */
Scene = function () {
    MObject.call(this)
    this._globalShaderInit = 0
    this._init = false
}
Scene.prototype = Object.create(MObject.prototype);
Scene.prototype.constructor = Scene
Scene.prototype.init = function () {
    canvasInit()
}
/**
 * Traverse all items
 * @private
 * @method traverse
 */
Scene.prototype.traverse = function () {
    function stepDown(tt) {
        if (tt.children.length > 0) {
            for (var child in tt.children) {
                stepDown(tt.children[child])
            }
        }
    }

    stepDown(this)
}
/**
 * Draw all items inside Scene with connected camera
 * @method draw
 * @param {Camera} [camera] showing drawed items
 */
Scene.prototype.draw = function (camera) {
    if (!this._init) {
        this.init()
        this._init = true
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    var dic = {}
    if (camera) {
            camera.transforms()
            dic = camera.uniforms
        }
    for (var child in this.children) {
        gl.frame += 1
        this.children[child].draw(dic)
    }
}
/**
 * Draw all items inside Scene with connected camera
 * @method drawOverride
 * @param {Shader} [shader] Shader to override for all items
 * @param {Dict} uniforms to pass to shader
 */
Scene.prototype.drawOverride = function (shader, uniforms) {
    shader.useProgram()
    shader.uniforms(uniforms);
    shader.uniformsSet = {}
    meshTable = []
    function checkDown(node) {
        if (node instanceof Mesh) {
            meshTable.push(node)
        }
        else {
            if (node.children.length > 0) {
                for (var c in node.children) {
                    checkDown(node.children[c])
                }
            }
        }
    }

    checkDown(this)
    gl.extradata = meshTable
    for (var c in meshTable) {
        meshTable[c].draw()
    }
}

/**
 * @module Buffer
 */
/**
  * Indexer class (internal)
  * @class Indexer
  * @constructor
*/
Indexer = function() {
	this.unique = [];
	this.indices = [];
	this.map = {};
};
/** 
* add
* @method add
* @param {obj} obj
*/
Indexer.prototype.add = function(obj) {
	var key = JSON.stringify(obj);
	if(!( key in this.map)) {
		this.map[key] = this.unique.length;
		this.unique.push(obj);
	}
	return this.map[key];
};
/**
  * Buffer class (internal)
  * @class Buffer
  * @constructor
*/
Buffer = function(target, type) {
	this.buffer = null;
	this.target = target;
	this.type = type;
	this.data = [];
};
/** 
* compile
* @method compile
* @param {type} type Type of data 
*/
Buffer.prototype.compile = function(type) {
	var data = new Array();
	for(var i = 0, chunk = 10000; i < this.data.length; i += chunk) {
		data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk));
	}
		var spacing = this.data.length ? data.length / this.data.length : 0;
   		if (spacing != Math.round(spacing)) throw 'buffer elements not of consistent size, average size is ' + spacing;
		this.buffer = this.buffer || gl.createBuffer();
		this.buffer.length = data.length;
		this.buffer.spacing = data.length / this.data.length;
		gl.bindBuffer(this.target, this.buffer);
		gl.bufferData(this.target, new this.type(data), type || gl.STATIC_DRAW);
};
/**
 @module Mesh
 */
/**
 * Mesh class contains buffers for 3d objects
 * @class Mesh
 * @extends MObject
 * @constructor
 * @param [options={}] {Dict} Dictionary of options when creating Aex object<br>
 * @return {Mesh} Returns Mesh Object
 * @example
 *     //Draw a simple triangle
 *     var mesh = new Mesh()
 *     mesh.vertices = [[0,0,0],[1,1,0],[0,0,-1]]
 *     mesh.coords = [[0.0,0.0],[1.0,1.0],[0.0,0.0]]
 *     mesh.traingles = [[0,1,2]]
 *     mesh.computeNormals()
 *     mesh.compile()
 */
Mesh = function (options) {
    MObject.call(this)
    options = options || {};
    this.transformationStack = [];
    this.vertexBuffers = {};
    this.indexBuffers = {};
    this.cameraCoords = [];
    this._init = false
    this.position = new Vector(0.0, 0.0, 0.0);
    this.size = new Vector(1.0, 1.0, 1.0);
    this.tweakers = {};
    this.undoStack = [];
    this.attributes = [];
    this.scaledUV = 1.0;
    mLs = [];
    this.addVertexBuffer('vertices', 'Vertex');
    if (!('coords' in options) || options.coords)
        this.addVertexBuffer('coords', 'TexCoord');
    if (!('normals' in options) || options.normals)
        this.addVertexBuffer('normals', 'Normal');
    this.locations = {'Vertex': 0, 'Normal': 1, 'TexCoord': 2}
    this.addIndexBuffer('triangles');
    this.addIndexBuffer('lines');
    return this
};
Mesh.prototype = Object.create(MObject.prototype);
Mesh.prototype.constructor = Mesh
/**
 * Drawes a Mesh
 * @method draw
 * @param {String} name Name of buffer
 * @param {String} attribute gl name
 */
Mesh.prototype.draw = function (uniforms) {
    var mode = gl.TRIANGLES
    for (var attribute in this.vertexBuffers) {
        var buffer = this.vertexBuffers[attribute];
        var location = this.locations[attribute];
        if (this.vertexBuffers[attribute].buffer == null)
            continue;
        this.attributes[attribute] = location;
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        gl.vertexAttribPointer(location, buffer.buffer.spacing, gl.FLOAT, false, 0, 0);
    }
    for (var attribute in this.attributes) {
        if (!( attribute in this.vertexBuffers)) {
            gl.disableVertexAttribArray(this.attributes[attribute]);
        }
    }
    // Disable unused attribute pointers.
    gl.indexBuffers = this.indexBuffers
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.indexBuffers.triangles.buffer);
    for (var child in this.children) {
        this.children[child].draw(uniforms)
    }
};
/**
 * Creates a vertex Buffer
 * for example:
 * this.addVertexBuffer('normals', 'gl_Normal');
 * @method addVertexBuffer
 * @param {String} name Name of buffer
 * @param {String} attribute gl name
 */
Mesh.prototype.addVertexBuffer = function (name, attribute) {
    var buffer = this.vertexBuffers[attribute] = new Buffer(gl.ARRAY_BUFFER, Float32Array);
    buffer.name = name;
    this[name] = [];
};
/**
 * Creates a index Buffer
 * for example:
 * this.addIndexBuffer('triangles');
 * @method addIndexBuffer
 * @param {String} name Name of buffer
 */
Mesh.prototype.addIndexBuffer = function (name) {
    var buffer = this.indexBuffers[name] = new Buffer(gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
    this[name] = [];
};
/**
 * Recompile the mesh ( for example: if vertices were edited )
 * @method compile
 */
Mesh.prototype.compile = function () {
    for (var attribute in this.vertexBuffers) {
        var buffer = this.vertexBuffers[attribute];
        buffer.data = this[buffer.name];
        buffer.compile();
    }

    for (var name in this.indexBuffers) {
        var buffer = this.indexBuffers[name];
        buffer.data = this[name];
        buffer.compile();
    }

    this.aabb = this.getAABB()
    this.sphere = this.getBoundingSphere(this.aabb);
};
/**
 * Transform the mesh with matrix
 * @method transform
 * @param {Matrix} matV Transformation matrix
 */
Mesh.prototype.transform = function (matV, r) {

    for (var vert in this.vertices) {
        this.setVertex(vert, matV.transformPoint(this.vertices[vert]).toArray());
    }
    if (this.normals) {
        var invTrans = matV.inverse().transpose();
        this.normals = this.normals.map(function (n) {
            return invTrans.transformVector(Vector.fromArray(n)).unit().toArray();
        });
    }
    this.compile();
    return this;
}
Mesh.prototype._transform = function (matV, r) {

    for (var vert in this.vertices) {
        this.setVertex(vert, matV.transformPoint(this.vertices[vert]).toArray());
    }
    if (this.normals) {
        var invTrans = matV.inverse().transpose();
        this.normals = this.normals.map(function (n) {
            return invTrans.transformVector(Vector.fromArray(n)).unit().toArray();
        });
    }
    return this;
}
/**
 * Moves mesh
 * @method move
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.move = function (x, y, z) {
    return this.transform(Matrix.translate(x, y, z), 1)
}
/**
 * Rotates mesh
 * @method rotate
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.rotate = function (x, y, z) {
    var m = this.transform(Matrix.rotate(x, 1, 0, 0), 1)
    m = m.transform(Matrix.rotate(y, 0, 1, 0), 1)
    m = m.transform(Matrix.rotate(z, 0, 0, 1), 1)
    return m
}
/**
 * Scales mesh
 * @method scale
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.scale = function (x, y, z) {
    return this.transform(Matrix.scale(x, y, z), 1)
}
/**
 * Scales uniformly mesh
 * @method scaleUniform
 * @param {float} f
 */
Mesh.prototype.scaleUniform = function (f) {
    return this.transform(Matrix.scale(f, f, f), 1)
}
/**
 * Recompute normals
 * @method computeNormals
 */
Mesh.prototype.computeNormals = function () {
    if (!this.normals)
        this.addVertexBuffer('normals', 'Normal');
    for (var i = 0; i < this.vertices.length; i++) {
        this.normals[i] = new Vector();
    }
    for (var i = 0; i < this.triangles.length; i++) {
        var t = this.triangles[i];
        var a = Vector.fromArray(this.vertices[t[0]]);
        var b = Vector.fromArray(this.vertices[t[1]]);
        var c = Vector.fromArray(this.vertices[t[2]]);
        var normal = b.subtract(a).cross(c.subtract(a)).unit();
        this.normals[t[0]] = this.normals[t[0]].add(normal);
        this.normals[t[1]] = this.normals[t[1]].add(normal);
        this.normals[t[2]] = this.normals[t[2]].add(normal);
    }
    for (var i = 0; i < this.vertices.length; i++) {
        this.normals[i] = this.normals[i].unit().toArray();
    }
    this.compile();
    return this;
};
/**
 * Recompute wireframe
 * @method computeWireframe
 */
Mesh.prototype.computeWireframe = function () {
    var indexer = new Indexer();
    for (var i = 0; i < this.triangles.length; i++) {
        var t = this.triangles[i];
        for (var j = 0; j < t.length; j++) {
            var a = t[j], b = t[(j + 1) % t.length];
            indexer.add([Math.min(a, b), Math.max(a, b)]);
        }
    }
    this.lines = indexer.unique;
    this.compile();
    return this;
};
/**
 * Get mesh bounding box
 * @method getAABB
 */
Mesh.prototype.getAABB = function () {
    var aabb = {
        min: new Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    };
    aabb.max = aabb.min.negative();
    for (var i = 0; i < this.vertices.length; i++) {
        var v = Vector.fromArray(this.vertices[i]);
        aabb.min = Vector.min(aabb.min, v);
        aabb.max = Vector.max(aabb.max, v);
    }
    return aabb;
};
/**
 * Get mesh bounding sphere
 * @method getBoundingSphere
 * @param aabb
 */
Mesh.prototype.getBoundingSphere = function (aabb) {
    var sphere = {
        center: aabb.min.add(aabb.max).divide(2),
        radius: 0
    };
    for (var i = 0; i < this.vertices.length; i++) {
        sphere.radius = Math.max(sphere.radius, Vector.fromArray(this.vertices[i]).subtract(sphere.center).length());
    }
    return sphere;
};
/**
 * Get center point of meshcar.t
 * @method getCenter
 */
Mesh.prototype.getCenter = function () {
    var bb = this.getAABB()
    translationV = bb.min.add(bb.max).divide(2);
    return translationV;
};
/**
 * Get vertex by id
 * @method getVertex
 * @param {int} id Vertex id
 * @return {array[3]} position of vertex
 */
Mesh.prototype.getVertex = function (id) {
    return this.vertices[id];
}
Mesh.prototype.mirrorVertex = function (id) {
    bb = this.getAABB()
    var mid = bb.min.x + (bb.max.x - bb.min.x) / 2.0
    if (this.vertices[id][0] < mid) {
        xRet = mid + (mid - this.vertices[id][0]);
    }
    else {
        xRet = mid - (this.vertices[id][0] - mid);
    }
    ;
    return this.getClosestVertex(new Vector(xRet, this.vertices[id][1], this.vertices[id][2]), 0.1);
}
Mesh.prototype.mirrorUV = function (id) {
    return this.getClosestUV([gl.canvas.width * (0.5 + (0.5 - this.coords[id][0])), gl.canvas.height * this.coords[id][1]], 0.05)
}
/**
 * Check if there are two vertices in the same place( useful to recognize bad import)
 * @method checkRepeat
 */
Mesh.prototype.checkRepeat = function () {
    var repeat = -1;
    for (var vert in this.vertices) {
        if (this.vertices[vert] == this.vertices[0]) {
            repeat += 1;
        }
    }
    return repeat;
}
/**
 * Get vertex by id
 * @method getVertex
 * @param {int} id Vertex id
 * @return {Vector} position of vertex
 */
Mesh.prototype.getVertexV = function (id) {
    return new Vector(this.vertices[id][0], this.vertices[id][1], this.vertices[id][2]);
}
/**
 * Set Position of Vertex
 * @method setVertex
 * @param {int} id Vertex id
 * @param {Vector or array} vector New vertex position
 */
Mesh.prototype.setVertex = function (id, vector) {
    if (vector instanceof Vector)
        this.vertices[id] = vector.toArray()
    else
        this.vertices[id] = vector;
}
/**
 Create a plane
 @method plane
 @static
 @param {Integer} detailX X segments
 @param {Integer} detailY Y segments
 @param {Dict} options additional options
 @return {Mesh} Compiled mesh (plane)
 @example
 someMesh = Mesh.plane(10,10)
 */
Mesh.plane = function (detailX, detailY, options) {
    var mesh = new Mesh(options);
    detailX = detailX || 1;
    detailY = detailY || 1;

    for (var y = 0; y <= detailY; y++) {
        var t = y / detailY;
        for (var x = 0; x <= detailX; x++) {
            var s = x / detailX;
            mesh.vertices.push([2 * s - 1, 2 * t - 1, 0]);
            if (mesh.coords)
                mesh.coords.push([s, t]);
            if (mesh.normals)
                mesh.normals.push([0, 0, 1]);
            if (x < detailX && y < detailY) {
                var i = x + y * (detailX + 1);
                mesh.triangles.push([i, i + 1, i + detailX + 1]);
                mesh.triangles.push([i + detailX + 1, i + 1, i + detailX + 2]);
            }
        }
    }

    mesh.compile();
    return mesh;
};
var cubeData = [
    [0, 4, 2, 6, -1, 0, 0],         // -x
    [1, 3, 5, 7, +1, 0, 0],         // +x
    [0, 1, 4, 5, 0, -1, 0],         // -y
    [2, 6, 3, 7, 0, +1, 0],         // +y
    [0, 2, 1, 3, 0, 0, -1],         // -z
    [4, 5, 6, 7, 0, 0, +1]
];

function pickOctant(i) {
    return new Vector((i & 1) * 2 - 1, (i & 2) - 1, (i & 4) / 2 - 1);
}
/**
 Create a cube
 @method cube
 @static
 @return {Mesh} Compiled mesh (cube)
 @example
 someMesh = Mesh.cube()
 */
Mesh.cube = function () {
    var mesh = new Mesh();

    for (var i = 0; i < cubeData.length; i++) {
        var data = cubeData[i], v = i * 4;
        for (var j = 0; j < 4; j++) {
            var d = data[j];
            mesh.vertices.push(pickOctant(d).toArray());
            if (mesh.coords)
                mesh.coords.push([j & 1, (j & 2) / 2]);
            if (mesh.normals)
                mesh.normals.push([data[4], data[5], data[6]]);
        }
        mesh.triangles.push([v, v + 1, v + 2]);
        mesh.triangles.push([v + 2, v + 1, v + 3]);
    }

    mesh.compile();
    return mesh;
};

/**
 * Coombine two meshes into one
 * @method combine
 * @param {Mesh} mesh additional mesh
 * @param {Boolean} noCompile flag if set to true doesnt compile mesh
 * @return {Mesh} Compiled mesh (cube)
 */
Mesh.prototype.combine = function (mesh, noCompile) {
    this.vertices = this.vertices.concat(mesh.vertices)
    if (this.coords)
        this.coords = this.coords.concat(mesh.coords)
    this.normals = this.normals.concat(mesh.normals)
    for (var t in mesh.triangles) {
        mesh.triangles[t][0] += this.triangles.length * 2
        mesh.triangles[t][1] += this.triangles.length * 2
        mesh.triangles[t][2] += this.triangles.length * 2
    }
    this.triangles = this.triangles.concat(mesh.triangles)
    if (noCompile) {
    } else {
        this.compile();
    }
    return this;
};

/**
 Create a sphere
 @method sphere
 @static
 @param {int} detail sphere resolution
 @param {Dict} options additional options
 @return {Mesh} Compiled mesh (sphere)
 @example
 someMesh = Mesh.sphere(10)
 */
Mesh.sphere = function (detail, options) {
    function tri(a, b, c) {
        return flip ? [a, c, b] : [a, b, c];
    }

    function fix(x) {
        return x + ( x - x * x) / 2;
    }

    var mesh = new Mesh(options);
    var indexer = new Indexer();
    detail = detail || 6;

    for (var octant = 0; octant < 8; octant++) {
        var scale = pickOctant(octant);
        var flip = scale.x * scale.y * scale.z > 0;
        var data = [];
        for (var i = 0; i <= detail; i++) {
            // Generate a row of vertices on the surface of the sphere
            // using barycentric coordinates.
            for (var j = 0; i + j <= detail; j++) {
                var a = i / detail;
                var b = j / detail;
                var c = ( detail - i - j) / detail;
                var vertex = {
                    vertex: new Vector(fix(a), fix(b), fix(c)).unit().multiply(scale).toArray()
                };
                if (mesh.coords)
                    vertex.coord = scale.y > 0 ? [1 - a, c] : [c, 1 - a];
                data.push(indexer.add(vertex));
            }

            // Generate triangles from this row and the previous row.
            if (i > 0) {
                for (var j = 0; i + j <= detail; j++) {
                    var a = ( i - 1) * (detail + 1) + (( i - 1) - ( i - 1) * ( i - 1)) / 2 + j;
                    var b = i * (detail + 1) + ( i - i * i) / 2 + j;
                    mesh.triangles.push(tri(data[a], data[a + 1], data[b]));
                    if (i + j < detail) {
                        mesh.triangles.push(tri(data[b], data[a + 1], data[b + 1]));
                    }
                }
            }
        }
    }

    // Reconstruct the geometry from the indexer.
    mesh.vertices = indexer.unique.map(function (v) {
        return v.vertex;
    });
    if (mesh.coords)
        mesh.coords = indexer.unique.map(function (v) {
            return v.coord;
        });
    if (mesh.normals)
        mesh.normals = mesh.vertices;
    mesh.compile();
    return mesh;
};
/**
 * Load 3d model from json
 * @method load
 * @param {String} json model in json format
 * @param {Dict} options additional options
 * @return {Mesh} Compiled mesh (loaded model)
 */
Mesh.load = function (jsn, options) {
    var json = aLoadJSON(jsn)
    options = options || {};
    if (!json.coords)
        options.coords = false;
    if (!json.normals)
        options.normals = false;
    var mesh = new Mesh(options);
    mesh.vertices = json.vertices;
    mesh.coords = json.coords;
    mesh.normals = json.normals;
    mesh.triangles = json.triangles
    mesh.lines = json.lines || [];
    mesh.compile();
    return mesh;
};
/**
 * Copy mesh
 * @method load
 * @param {Mesh} mesh to copy
 * @return {Mesh} Compiled mesh (copied model)
 */
Mesh.copy = function (mesh) {
    options = options || {};
    if (!mesh.coords)
        options.coords = false;
    if (!mesh.normals)
        options.normals = false;
    var mesh1 = new Mesh(options);
    mesh1.vertices = mesh.vertices;
    mesh1.coords = mesh.coords;
    mesh1.normals = mesh.normals;
    mesh1.triangles = mesh.triangles
    mesh1.lines = mesh.lines || [];
    mesh1.compile();
    return mesh1;
};
/**
 * Load 3d model from itself
 * @method load
 * @param {String} dict of model
 * @param {Dict} options additional options
 * @return {Mesh} Compiled mesh (loaded model)
 */
Mesh.loadStatic = function (jsn, options) {
    var json = jsn
    options = options || {"coords": true};
    if (!json.coords)
        options.coords = false;
    if (!json.normals)
        options.normals = false;
    var mesh = new Mesh(options);
    mesh.vertices = json.vertices;
    mesh.coords = json.coords;
    mesh.normals = json.normals;
    mesh.triangles = json.triangles
    mesh.compile();
    return mesh;
};

/**
 Load 3d model from obj
 @method obj
 @param {String} url path to .obj file
 @param {Function} callback function that happen after successful mesh loading
 @param {Dict} [opts] optional parameters listed in example
 @example
 characterJaw = new GameObject(world, {
        shader: gshader,
        material: planetMat,
        mesh: ludekMesh2,
    })
 Mesh.obj("obj/jaw.obj", function (e) {
        var meshy = e
        meshy.rotate(0, 90, 0)
        meshy.scale(-0.25, 0.25, 0.25)
        meshy.move(0, 0.05, 0)
        characterJaw.mesh = meshy
    })
 */
Mesh.obj = function (url, callback, readmode) {
    Resource.load(url, function (e) {
        var data1 = Resource.parse.fromOBJ(e,readmode || "g")
        Mesh.fromData(data1,callback)
    })
}

Mesh.fromData = function(data1,callback,opts){
  var meshes = {}
  var count = 0
  for (var m in data1) {
      count += 1
      var data = data1[m];
      options = {"coords": true};
      if (!data.coords)
          options.coords = false;
      if (!data.normals)
          options.normals = false;
      var mesh = new Mesh();
      mesh.vertices = data.vertices;
      mesh.coords = data.coords;
      mesh.normals = data.normals;
      mesh.triangles = data.triangles;
      mesh.compile();
      meshes[m] = mesh;
  }
  if (count < 2) {
      var mm = ""
      for (var m in meshes) {
          mm = meshes[m]
      }
      callback(mm)
  } else {
      if (opts) {
          if (opts.loadAsTable) {
              var meshesT = []
              for (var m in meshes) {
                  mm = meshes[m]
                  meshesT.push(mm)
              }
              callback(meshesT)
          }
          else {
              callback(meshes)
          }
      } else {
          callback(meshes)
      }
  }
}

/**
All animations are executed during window.logic loop
@module Animation
*/
/**
Class for animating `GameObject`'s to desired state
@class Animation
@constructor
@param parent {GameObject} Parent in render tree
@param time {Int} time in miliseconds
@param [options={}] options of Animation
@example
    var world = new Scene()
    var gameobject = new GameObject(world,{})
    var ani = new Animation(gameobject, 500, {
        x: planet.x + Math.sin(this.angle * Math.degToRad) * (pll - 1),
        y: planet.y + Math.cos(this.angle * Math.degToRad) * (pll - 1),
        onComplete: function (e) {
            e.remove()
        }
    })
    ani.run()
*/
Animation = function(parent,time,options){
	this.parent = parent
	this.runs = false
	this.to = {}
	this.from = {}
	this.type = "standard"
	this.interval = {}
	this.settings = {
		onComplete:function(){},
		loops:1
	}
	this.keyOptions = ["loops","onComplete","r"]
	for(var o in options){
		if( this.keyOptions.indexOf(o) == -1 ){
			var val = options[o]
			this.time = time*(60/1000)
			this.to[o] = val
			this.from[o] = Object.byString(this.parent, o);
			this.interval[o] = (1/this.time)*(val-this.from[o])
		}else{
			this.settings[o] = options[o]
		}
		
	}
	parent.addAnimation(this)
}
Animation.prototype =  Object.create(MObject.prototype);
Animation.prototype.constructor = Animation
/**
Checks if animation should run and fires it when ready.
@private
@method execute
*/
Animation.prototype.execute = function(){
	if(this.runs){
		if(gl.frame < this.end){
			for( var f in this.from ){
				var vi = Object.byString(this.parent,f)+this.interval[f]		
				setDict(this.parent,f,vi)
			}
		}
		else{
			var loop = this.settings.loops
			if( loop == -1){
				this.run()
			}
			else if(loop>1){
				this.settings.loops -= 1
				this.run()
			}
			else if(loop == 1){
				this.runs = false
				this.settings.onComplete(this.parent)
			}
			else{
			}
		}
	}
}
/**
Runs animation
@private
@method run
*/
Animation.prototype.run = function(){
	this.runs = true
	this.start = gl.frame
	this.end = gl.frame +this.time
}
function regexMap(regex, text, callback) {
    while ((result = regex.exec(text)) != null) {
        callback(result);
    }
}
// Insert the header after any extensions, since those must come first.
function fix(header, source) {
    var match = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(source);
    source = match ? match[1] + header + source.substr(match[1].length) : header + source;
    regexMap(/\bgl_\w+\b/g, header, function(result) {
        source = source.replace(new RegExp(result, 'g'), '_' + result);
    });
    return source;
}

/**
  * Shader class
  * @class Shader
  * @constructor
  * @param {String} vertexSource Source of vertex shader
  * @param {String} fragmentSource Source of fragment shader
  * @param {String} addons additional attributes
*/
shframe= -1
Shader = function(vertexSource,fragmentSource,noBuild) {
	MObject.call(this)
	this.cp = -1.0;
    this.uniformsSet = {}
    this.construct = {
                        "varying":[],
                        "uniforms":[],
                        "defines":[],
                        "structs":{},
                        "mainFragment":fragmentSource,
                        "mainVertex":vertexSource
                    }
	this.header = 'uniform mat4 gl_ModelViewMatrix;uniform mat4 gl_ProjectionMatrix;uniform mat4 gl_ModelViewProjectionMatrix;uniform mat3 NormalMatrix;';
    this.vertexHeader = 'precision highp float; attribute vec3 Vertex;attribute vec2 TexCoord;attribute vec3 Normal;' + this.header;
	this.fragmentHeader = 'precision highp float;' + this.header;
    if(noBuild){

    }else{
        this._build();
    }
};
Shader.prototype =  Object.create(MObject.prototype);
Shader.prototype.constructor = Shader
Shader.prototype.addUniform = function(type,name){
    this.construct.uniforms.push([type,name])
}
Shader.prototype.define = function(name){
    this.construct.defines.push(name)
}
Shader.prototype.addVarying = function(type,name){
    this.construct.varying.push([type,name])
}
Shader.prototype.addStruct = function(name,struct){
    this.construct.structs[name] = [];
    if(struct){
        this.construct.structs[name] = struct
    }
}
Shader.prototype.addToStruct = function(structName,type,name){
    this.construct.structs[structName].push([type,name])
}
Shader.prototype.addVertexSource = function(source){
    this.construct.mainVertex = source
}
Shader.prototype.addFragmentSource = function(source){
    this.construct.mainFragment = source
}
Shader.prototype.reconstruct = function(){
    this.vertexLines = "";
    this.fragmentLines = "";
    for(var v in this.construct.defines){
        var vv = this.construct.defines[v]
        var line = "\n#define "+vv+" 1 \n"
        this.fragmentLines += line
    }
    for(var v in this.construct.varying){
        var vv = this.construct.varying[v]
        var line = "varying "+vv[0]+" "+vv[1]+";\n"
        this.vertexLines += line;
        this.fragmentLines += line
    }
    for(var st in this.construct.structs){
        var ss = this.construct.structs[st]
        var line = "struct "+st+"{\n"
        for(var svalue in ss){
            var ll = ss[svalue]
            line += "\t"+ll[0]+" "+ll[1]+";\n"
        }
        line += "};\n"
        this.fragmentLines += line
        this.vertexLines += line
    }
    for(var u in this.construct.uniforms){
        var uu = this.construct.uniforms[u]
        var line = "uniform "+uu[0]+" "+uu[1]+";\n"
        this.fragmentLines += line
        this.vertexLines += line
    }
    this.vertexLines += this.construct.mainVertex
    this.fragmentLines += this.construct.mainFragment
}
Shader.prototype._build = function(){
    this.reconstruct()
	var vertexSource = fix(this.vertexHeader, this.vertexLines);
    var fragmentSource = fix(this.fragmentHeader, this.fragmentLines);
    function compileSource(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('compile error: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    this.program = gl.createProgram();
    gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
    gl.bindAttribLocation(this.program,0,"Vertex")
    gl.bindAttribLocation(this.program,1,"Normal")
    gl.bindAttribLocation(this.program,2,"TexCoord")
    gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);
	gl.enableVertexAttribArray(2);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        gl.extradatae = ('link error: ' + gl.getProgramInfoLog(this.program));
    }
    this.attributes = {};
    this.uniformLocations ={};
    var isSampler = {};
    regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, vertexSource + fragmentSource, function(groups) {
        isSampler[groups[2]] = 1;
    });
    this.isSampler = isSampler;
    this.needsMVP = (vertexSource + fragmentSource).indexOf('gl_ModelViewProjectionMatrix') != -1;
}
var isArray = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

var isNumber = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Number]';
}
Shader.prototype._checkUniforms = function(value,location,name,lname){
		if( value instanceof Vector) {
			value = [value.x, value.y, value.z];
		} else if( value instanceof Matrix) {
			value = value.m;
		}
		var checkname = lname
		if( compare(this.uniformsSet[checkname], value) ){
			return
		}else{
			this.uniformsSet[checkname] = value
		}
		if(isArray(value)) {
		
			switch (value.length) {
				case 1:
					gl.uniform1fv(location, new Float32Array(value));
					break;
				case 2:
					gl.uniform2fv(location, new Float32Array(value));
					break;
				case 3:
					gl.uniform3fv(location, new Float32Array(value));
					break;
				case 4:
					gl.uniform4fv(location, new Float32Array(value));
					break;
				// Matrices are automatically transposed, since WebGL uses column-major
				// indices instead of row-major indices.
				case 9:
					gl.uniformMatrix3fv(location, false, new Float32Array([value[0], value[3], value[6], value[1], value[4], value[7], value[2], value[5], value[8]]));
					break;
				case 16:
					gl.uniformMatrix4fv(location, false, new Float32Array([value[0], value[4], value[8], value[12], value[1], value[5], value[9], value[13], value[2], value[6], value[10], value[14], value[3], value[7], value[11], value[15]]));
					break;
				default:
					__error('don\'t know how to load uniform "' + name + '" of length ' + value.length);
			}
		} else if(isNumber(value)) {
			(this.isSampler[name] ? gl.uniform1i : gl.uniform1f).call(gl, location, value);
		} else if(typeof(value) == "boolean"){
			gl.uniform1i(location,(value == true?1:0))
		} else {
			if(value == null){
			}
			else{
			console.log(name,value==null)
			__error('attempted to set uniform "' + name + '" to invalid value ' + value);
			}
		}
}
Shader.prototype.useProgram = function(){
        gl.useProgram(this.program);
	    gl.currentShader = this
	    gl.currentProgram = this.program
} 
/**
* Set shader uniforms
* @method uniforms
* @param {Dict} uniforms Dictionary of uniforms of shader
*/
Shader.prototype.uniforms = function(uniforms) {
	for(var name in uniforms) {
		var value = uniforms[name];
		if(value instanceof Object && !isArray(value) && !(value instanceof Matrix) && !(arr instanceof Vector)){
		    var id = value["id"]?value["id"]:""
			this.uniformLocations[name] = this.uniformLocations[name] || {}
			for( us in value){
                if(us=="id"){
                    continue
                }
				var location = this.uniformLocations[name][us] || gl.getUniformLocation(this.program, name+'.'+us);
				if(!location){
					this.uniformsSet[name+us] = value[us]
                    continue;
                }
				this.uniformLocations[name][us] = location;
				var val = value[us]
				this._checkUniforms(val,location,name,name+us)
			}
		}
		else if(isArray(value) &&( (value[0] instanceof Object) ||  (isArray(value[0])) ) ){
			for(var i=0;i<value.length;i++){
				var arr = value[i];
				if(arr instanceof Object && !isArray(arr) && !(arr instanceof Matrix) && !(arr instanceof Vector)){
					this.uniformLocations[name] = this.uniformLocations[name] || []
					for( us in arr){
						this.uniformLocations[name][i] = this.uniformLocations[name][i] || {}
						var location = this.uniformLocations[name][i][us] || gl.getUniformLocation(this.program, name+'['+i+']'+'.'+us);
						if(!location)
							continue;
						this.uniformLocations[name][us] = location;
						var val = arr[us]
						this._checkUniforms(val,location,name,name+us+i)
					}
				}else{
					this.uniformLocations[name] = this.uniformLocations[name] || []
					var location = this.uniformLocations[name][i] || gl.getUniformLocation(this.program, name+'['+i+']');
					if(!location)
						continue;
					this.uniformLocations[name][i] = location;
					this._checkUniforms(value,location,name,name+i)
				}
			}
		}
		else{
			var location = this.uniformLocations[name] || gl.getUniformLocation(this.program, name);
			if(!location)
				continue;
			this.uniformLocations[name] = location;
			this._checkUniforms(value,location,name,name)
		}
	}

	return this;
};
/** 
* Draw with this shader
* @method draw
*/
Shader.prototype.draw = function(uniforms) {
    this.useProgram()
    var dic = uniforms ||{};
    this.uniforms(dic);
    this.uniformsSet = {}
    for( var child in this.children ){
    	this.children[child].draw()
    }
};

function loadFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}

function loadFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
}
/** 
* Loads shader from .fs files
* @method fromFile
* @param {String} vertexUrl
* @param {String} fragmentUrl
*/

Shader.fromFile = function(vertexUrl,fragmentUrl,callback){
	var shader
	loadFiles([vertexUrl, fragmentUrl], function (shaderText) {
		shader = new Shader(shaderText[0],shaderText[1])
		callback(shader)
	}, function (url) {
		console.log('Failed to download "' + url + '"');
	});
}
/**
 * Texture class
 * @class Texture
 * @constructor
 */
Texture = function (options) {
    this.options = options || {};
    this.id = gl.createTexture();
    this.binded = false
    this.format = this.options.format || gl.RGBA;
    this.type = this.options.type || gl.UNSIGNED_BYTE;
};
Texture.prototype.handle2DTexture = function () {
    var options = this.options;
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, this.image || null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.filter || options.magFilter || gl.LINEAR);
    if (powerof2(this.image.width) && powerof2(this.image.height)) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter || options.minFilter || gl.LINEAR_MIPMAP_LINEAR);
    }else{
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter || options.minFilter || gl.LINEAR);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap || options.wrapS || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap || options.wrapT || gl.CLAMP_TO_EDGE);
    if (powerof2(this.image.width) && powerof2(this.image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D)
    }
    gl.bindTexture(gl.TEXTURE_2D, null)
}
Texture.prototype.handle = function () {
    if (this.isAtlas) {
        this.handleAtlas()
    } else {
        this.handle2DTexture()
    }
}
Texture.prototype.handleAtlas = function () {
    var options = this.options;
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, this.image || null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.filter || options.magFilter || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter || options.minFilter || gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap || options.wrapS || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap || options.wrapT || gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D)
}
Texture.prototype.handleZB = function () {
    var options = this.options;
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.filter || options.magFilter || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter || options.minFilter || gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap || options.wrapS || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap || options.wrapT || gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
}
Texture.prototype.handleZBCube = function () {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format, this.width, this.height, 0,
        this.format, this.type, null);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
Texture.prototype.handleCube = function () {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.format,
        this.format, this.type, this.cube[0]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.format,
        this.format, this.type, this.cube[1]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.format,
        this.format, this.type, this.cube[2]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.format,
        this.format, this.type, this.cube[3]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.format,
        this.format, this.type, this.cube[4]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.format,
        this.format, this.type, this.cube[5]);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
}
Texture.bindTexture2D = function (t) {
    var binder = gl.nTexture;
    gl.activeTexture(gl.TEXTURE0 + (gl.nTexture));
    gl.bindTexture(gl.TEXTURE_2D, t.id);
    gl.nTexture += 1;
    gl.nTexture = gl.nTexture % gl.MAX_NUMBER_OF_TEXTURES;
    return binder;
}
Texture.bindTextureCube = function (t) {
    var binder = gl.cbTexture;
    gl.activeTexture(gl.TEXTURE0 + (gl.cbTexture));
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, t.id);
    gl.cbTexture += 1;
    gl.cbTexture = gl.cbTexture % gl.MAX_NUMBER_OF_TEXTURES;
    return binder;
}
Texture.prototype.bind = function (unit) {
    if (!this.binded) {
        gl.nTexture += 1;
        this.binded = true;
        this.binder = gl.nTexture;
        gl.activeTexture(gl.TEXTURE0 + this.binder);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
}
Texture.prototype.bindCube = function () {
    if (!this.binded) {
        gl.nTexture += 1;
        this.binded = true;
        this.binder = gl.nTexture;
        gl.activeTexture(gl.TEXTURE0 + this.binder);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);
    }
}
Texture.prototype.unbindCube = function () {
    if (this.binded) {
        gl.nTexture -= 1;
        this.binded = false;
        gl.activeTexture(gl.TEXTURE0 + this.binder);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
}
Texture.prototype.unbind = function (unit) {
    if (this.binded) {
        gl.nTexture -= 1;
        this.binded = false;
        gl.activeTexture(gl.TEXTURE0 + this.binder);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
};
Texture.prototype.remove = function () {
    TXTS[this.binder] = "empty"
}
/**
 * Creates a texture from image file
 * @method fromImage
 * @param {String} src path to image file
 * @param {Dict} options
 * @example
 *      var imageSuper = Texture.fromImage("img/imgsuper.png",{
 *          wrap: gl.CLAMP_TO_EDGE,
 *          filter: gl.LINEAR_MIPMAP_LINEAR
 *      })
 * @example
 *      var imageSuper = Texture.fromImage("img/imgsuper.png",{
 *          wrap: gl.REPEAT,
 *          filter: gl.LINEAR
 *      })
 */
Texture.fromImage = function (src, options) {
    options = options || {};
    var texture = new Texture(0, 0, options);
    texture.image = new Image();
    texture.complete = 0
    texture.options = options
    Resource.load(src, function (e) {
        texture.image.src = window.URL.createObjectURL(e);
        texture.image.onload = function () {
            texture.image = this
            texture.complete = 1
        }
    })
    return texture;
};
Texture.fromCanvas = function (canvas, options) {
    var texture = new Texture(0, 0, options);
    texture.image = canvas
    texture.complete = 1
    return texture
}
/**
 * Creates a texture cube image files
 * @method fromCube
 * @param {String[]} srcs array to 6 path to image files
 * @param {Dict} options
 * @example
 *      var imageSuper = Texture.fromCube(["cube1.png",
 *                                         "cube2.png",
 *                                         "cube3.png",
 *                                         "cube4.png",
 *                                         "cube5.png",
 *                                         "cube6.png"],{})
 */
Texture.fromCube = function (srcs, options) {
    options = options || {};
    var texture = new Texture(0, 0, options);
    texture.cube = []
    texture.complete = 0
    for (var s in srcs) {
        Resource.load(srcs[s], function (e) {
            texture.cube.push(new Image())
            texture.cube[texture.complete].src = window.URL.createObjectURL(e);
            texture.cube[texture.complete].onload = function () {
                texture.cube[texture.complete] = this
            }
                texture.complete += 1;
        })
    }
    return texture;
};
/**
 * Creates a texture from image blob
 * @method fromBlob
 * @param {String} blob image blov
 * @param {Dict} options
 */
Texture.fromBlob = function (blob, options) {
    options = options || {};
    var texture = new Texture(0, 0, options);
    texture.image = new Image();
    texture.complete = 0
    texture.options = options
    texture.image.src = blob
    texture.image.onload = function () {
        texture.image = this
        texture.complete = 1
    }
    return texture;
};
/**
 * Creates a texture atlas
 * @static
 * @method Atlas
 * @param {String} srcImage image file name
 * @param {String} srcJSON JSON file name
 * @param {Dict} options
 * @example
 *      var imageAtlas = Texture.Atlas("map.png","map.json")
 *      var image = Texture.fromAtlas(imageAtlas,"foot.png")
 *      podstawaMat = new Material({color: [0.3,0.9,0.9]})
 *  var tat = Texture.Atlas("into.png","into.json")
 *  podstawaMat.setTexture("diffuse",tat,"tap to play.png")
 */
Texture.Atlas = function (srcImage, srcJSON, options) {
    var texture = new Texture(0, 0, options);
    texture.image = new Image();
    texture.complete = 0
    gl.loadedElements[srcImage] = 0
    texture.options = options || {};
    texture.isAtlas = true
    Resource.load(src, function (e) {
        texture.image.src = window.URL.createObjectURL(e);
        texture.image.onload = function () {
            texture.image = this
            texture.resolution = {w: this.width, h: this.height}
            texture.complete = -1
            Resource.load(srcJSON, function (e) {
                texture.json = JSON.parse(e)
                texture.uvd = {}
                for (var j in texture.json) {
                    var tjs = texture.json[j]
                    var xx = tjs["x"] / texture.resolution.w
                    var yy = tjs["y"] / texture.resolution.h
                    texture.uvd[j] = [xx, xx + tjs["width"] / texture.resolution.w, yy, yy + tjs["height"] / texture.resolution.h]
                }
                texture.complete = 1
            })
        }
    })

    return texture
}

var SHDS = [];
for (var t = 0; t < 500; t++) {
    SHDS.push("empty");
}
function getShNum() {
    for (var i = 1; i < SHDS.length + 1; i++) {
        if (SHDS[i] == "empty") {
            SHDS[i] = "shader"
            return i
        }
    }
}

/**
 * Material class
 * @class Material
 * @constructor
 * @param {Object} settings Options for the material
 */
Material = function (settings) {
    MObject.call(this)
    this.shaderId = getShNum()
    this.compl = 0
    /**
     * @property settings
     * @type Object
     * @example
     *      mat = new Material()
     *      mat.settings{{
    *         color: [1.0,0.0,0.0],
    *         specularWeight: 1.0,
    *         reflectionWeight: 1.0,
    *         alpha:1.0
    *         }}
     */
    this.settings = {
        id : this.shaderId+"",
        color: [1.0, 1.0, 1.0],
        specularWeight: 1.0,
        mappingType: 1.0,
        shininess:15.0,
        alpha: 1.0
    }
    this._textures={}
    if (settings) {
        for (var o in settings) {
            var so = settings[o]
            if (so instanceof Texture) {
                this.setTexture(o,so);
            }
            else {
                this.settings[o] = settings[o]
            }
        }
    }
}
Material.prototype = Object.create(MObject.prototype);
Material.prototype.constructor = Material
/**
 * Draw material
 * @method draw
 */
Material.prototype.draw = function () {
    var all = this.completeTextures()
    if (all) {
        this.bindAll()
        var dic ={}
        dic["material"] = this.settings
        for(var tx in this._textures){
            var tex = this._textures[tx]
            if (tex instanceof Texture) {
                dic[tx] = tex.binder
                if(tex.isAtlas){
                    dic["atlas"] = tex.uvd[this.atlasName]
                }
            }
        }
        for (var child in this.children) {
            this.children[child].draw(dic)
        }
        this.unbindAll()
    }
}
/**
 * Set diffuse texture
 * @method setDiffuse
 * @param {String} channel texture channel ( "diffuse", "specular", "bump", "cube" )
 * @param {Texture} tex Texture to set on diffuse channel
 * @param {String} name required if texture is atlas
 */
Material.prototype.setTexture = function(channel,tex,name){
    if(tex instanceof Texture){
        this.compl = -1
    }
    this._textures[channel] = tex;
    if(tex.isAtlas){
        this.atlasName = name
    }
}
/**
 * Set diffuse texture
 * @method setDiffuse
 * @param {Texture} tex Texture to set on diffuse channel
 */
Material.prototype.setDiffuse = function (tex,name) {
    this.setTexture("diffuse",tex,name)
}
/**
 * Set bump texture
 * @method setBump
 * @param {Texture} tex Texture to set on bump channel
 */
Material.prototype.setBump = function (tex,name) {
    this.setTexture("bump",tex,name)
}
/**
 * Set specular texture
 * @method setSpecular
 * @param {Texture} tex Texture to set on specular channel
 */
Material.prototype.setSpecular = function (tex,name) {
    this.setTexture("specular",tex,name)
}
/**
 * Set cube environment texture
 * @method setCube
 * @param {Texture} tex Texture to set on environment channel
 */
Material.prototype.setCube = function (cube,name) {
    this.setTexture("cube",cube,name)
}
Material.prototype.bindAll = function () {
    for(var tx in this._textures){
        var tex = this._textures[tx]
        if (tex instanceof Texture) {
            if(tx == "cube"){
                tex.bindCube()
            }else{
                tex.bind()
            }
            this[tx] = tex.binder
        }
    }
}
Material.prototype.unbindAll = function () {
    for(var tx in this._textures){
        var tex = this._textures[tx]
        if (tex instanceof Texture) {
            if(tx == "cube"){
                tex.unbindCube()
            }else{
                tex.unbind()
            }
        }
    }
}
Material.prototype.completeTextures = function () {
    var compmax = 0
    var comps = 0
    for(var tx in this._textures){
        var tex = this._textures[tx]
        compmax +=1
        if (tex instanceof Texture) {
            if(tx  != "cube"){
                if(tex.complete == 1){
                        tex.handle()
                        tex.complete =2
                }else if(tex.complete == 2){
                        comps +=1
                }
            }else{
                if(tex.complete == 6){
                        tex.handleCube()
                        tex.complete =12
                }else if(tex.complete == 12){
                        comps +=1
                }
            }
        }
    }
    if (compmax == 0) {
        return true
    } else {
        return ((comps / compmax) == 1.0 ? true : false)
    }
}
/**
 * Set Material shader uniforms
 * @method uniforms
 * @param {Dict} uniforms Dictionary of uniforms of shader
 */
Material.prototype.uniforms = function (uni) {
    var dic = uni || {}
    gl.currentShader.uniforms(dic)
}
Material._settable = [
    "color",
    "specularWeight",
    "mappingType",
    "alpha",
    "shininess"
]

/**
 @module Light
 */
/**
 @class Light
 @extends MObject
 @constructor
 @param tableOptions {Dict} light options
 @example
 light = new Light({
		lightPosition: new Vector(1.3,4.0,-2.0),
		attenuation: 40.0,
		intensity: 1.33,
		lightType:1.0,
		color: [0.8,1.0,1.0]
	})
 Example 2:
 @example
 light = new Light([
 {
     lightPosition: new Vector(1.3,4.0,-2.0),
     attenuation: 400.0,
     intensity: 1.2,
     color: [0.8,1.0,1.0]
 },
 {
     lightPosition: new Vector(0.1,2.0,3.0),
     attenuation: 100.0,
     intensity: .33,
     color: [0.8,0.2,1.0]
 },
 {
     lightPosition: new Vector(-1.3,4.0,-2.0),
     attenuation: 140.0,
     intensity: 1.33,
     color: [0.8,1.0,1.0]
 }
 ])
  Example 3 creating ambient light:
 @example
 light = new Light([
 {
     intensity: 1.2,
     lightType:2.0,
     color: [0.8,1.0,1.0]
 },
 ])
 */
Light = function (tableOptions) {
    MObject.call(this)
    this.lights = []
    this.shadows = new Array(32)
    this.ssse = 0
    if (tableOptions instanceof Array) {
        for (var l in tableOptions) {
            var tabs = {}
            var options = tableOptions[l];
            tabs.lightPosition = new Vector();
            tabs.attenuation = 20.0
            tabs.intensity = 1.0
            tabs.color = [1.0, 1.0, 0.9]
            tabs.shadow = false
            tabs.lightType = 1
            if (options) {
                for (var o in options) {
                    tabs[o] = options[o]
                }
            }
            this.lights.push(tabs)
        }
    } else {
        var tabs = {}
        tabs.lightPosition = new Vector(0, 1, -10);
        tabs.attenuation = 20.0
        tabs.intensity = 1.0
        tabs.color = [1.0, 1.0, 0.0]
        tabs.shadow = false
        tabs.lightType = 1
        if (tableOptions) {
            for (var o in tableOptions) {
                tabs[o] = tableOptions[o]
            }
        }
        this.lights.push(tabs)
    }
}
Light.prototype = Object.create(MObject.prototype);
Light.prototype.constructor = Light
Light.prototype.draw = function (uniforms) {
    var dic = uniforms || {}
    this.bindAll(dic)
    dic["lights"] = this.lights;
    dic["numlights"] = this.lights.length
    for (var child in this.children) {
        this.children[child].draw(dic)
    }
     this.unbindAll()
}
Light.prototype.bindAll = function (dic) {
    if(this.shadows.complete == 12){
        this.shadows.bindCube()
        dic["shadows"] = this.shadows.binder;
    }
}
Light.prototype.unbindAll = function (){
    if(this.shadows.complete == 12){
        this.shadows.unbindCube()
    }
}
/**
 * sets shadow for light system( 1 shadowmap per system allowed now )
 * @method set Shadow
 * @param {Shadow} shadow
 */
Light.prototype.setShadow = function (shadow) {
    this.shadows = shadow.map.texture
}
/**
 @method fGI
 @static
 Creates fake global Illumination system
 @param sun {Boolean} if true sun will be drawn
 */
Light.fGI = function (options, sun) {
    var lightTable = []
    var radius = 10
    for (var k = 1; k < 3; k++) {
        for (var i = 1; i < 6; i++) {
            var angle = (i / 6) * 6.28
            var lig = {
                lightPosition: new Vector(Math.sin(angle) * radius, k * 3, Math.cos(angle) * radius).toArray(),
                intensity: .3,
                color: [0.7, 0.7, 0.9],
                attenuation: 23.8,
            }
            lightTable.push(lig)
        }
    }
    if (sun) {
        var lig = {
            lightPosition: new Vector(100, 20, 100).toArray(),
            intensity: .76,
            color: [1.0, 0.7, 0.2],
            attenuation: 1005.8,
        }
        lightTable.push(lig)
    }
    return new Light(lightTable)
}
Light.minifGI = function (radius, size, intensity, position) {
    var lightTable = []
    for (var k = 1; k < 2; k++) {
        for (var i = 1; i < 3; i++) {
            var angle = (i / 3) * 6.28
            var lig = {
                lightPosition: new Vector(Math.sin(angle) * radius, k * 3, Math.cos(angle) * radius).toArray(),
                intensity: intensity,
                color: [0.7, 0.7, 0.9],
                attenuation: size
            }
            lightTable.push(lig)
        }
    }
    if (position) {
        for (var l in lightTable) {
            var lig = lightTable[l]
            lig.lightPosition = Vector.fromArray(lig.lightPosition).add(position).toArray()
        }
    }
    return new Light(lightTable)
}
/**
 @module ShaderLibrary
 */
var basicText = function () {
    return new Shader('\
			varying vec2 vTex;\
			varying vec4 vPosition;\
			varying vec3 vNormal;\
			void main(void) {\
			vNormal = Normal;\
			vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			vTex = TexCoord;\
			gl_Position = gl_ProjectionMatrix * vPosition;\
			}', 'varying vec2 vTex;\
			varying vec4 vPosition;\
			varying vec3 vNormal;\
			struct Material\
			{\
				vec3 color;\
				float shininess;\
				bool useDiffuse;\
				bool useSpecular;\
				bool useLights;\
				float specularWeight;\
				bool useBump;\
				float bumpWeight;\
				bool useDof;\
				float mappingType;\
				float dofWeight;\
				bool useRefraction;\
				float refraction;\
				float alpha;\
			};\
			uniform sampler2D diffuse;\
			uniform Material material;\
			uniform vec2 tiling;\
			void main(void) {\
				vec2 tiler;\
				if(tiling.x == 0.0){\
					tiler = vTex;\
				}\
				else{\
					tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
				}\
				vec4 clr = vec4(material.color,1.0);\
				if(material.useDiffuse){\
					clr = texture2D(diffuse, tiler);\
				};\
				gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
			}');
};
var basicShaderDepth = function () {
    return new Shader('\
			varying vec4 vPosition;\
			void main(void) {\
			vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			gl_Position = gl_ProjectionMatrix * vPosition;\
			}', 'varying vec4 vPosition;\
			uniform float zNear;\
			uniform float zFar;\
			float LinearDepthConstant = 1.0 / (zFar - zNear);\
			vec4 pack (float depth)\
			{\
				const vec4 bias = vec4(1.0 / 255.0,\
							1.0 / 255.0,\
							1.0 / 255.0,\
							0.0);\
			\
				float r = depth;\
				float g = fract(r * 255.0);\
				float b = fract(g * 255.0);\
				float a = fract(b * 255.0);\
				vec4 colour = vec4(r, g, b, a);\
				\
				return colour - (colour.yzww * bias);\
			}\
			float rand(vec2 co){\
    			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
			}\
			void main(void) {\
				float linearDepth = length(vPosition) * LinearDepthConstant;\
				vec4 clr = vec4(normalize(vPosition.xyz)/10.0,1.0);\
				gl_FragColor = vec4(linearDepth,linearDepth,linearDepth,1.0);\
			}');
};
/**
 * Constructs shader - This is done this way to minify the shader structure
 * @method basicShader
 * @param {Object} options Options of shader construction
 * @example
 *     //Simple shader considering light and diffuse texture
 *     var shader = basicShader({
 *          useBump: false,
 *          useDiffuse: false,
 *          useAtlas: false,
 *          useSpecular: false,
 *          useLights: false,
 *          useTiling: false,
 *          useReflection:false,
 *          useSky:false
 *     });
 */
var basicShader = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false
    }
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("float", "nrmY")
    bShader.addVarying("vec3", "dZ")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "vNormal")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVertexSource('\
			void main(void) {\
			    normalEye = normalize(NormalMatrix*Normal);\
			    vNormal = Normal;\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    dZ = (gl_ProjectionMatrix * vPosition).xyz;\
			    nrmY = abs(Normal.y);\
			    vTex = TexCoord;\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    if (settings.useLights) {
        bShader.addStruct("Light")
        bShader.addToStruct("Light", "vec3", "lightPosition")
        bShader.addToStruct("Light", "vec3", "color")
        bShader.addToStruct("Light", "float", "attenuation")
        bShader.addToStruct("Light", "float", "intensity")
        bShader.addToStruct("Light", "float", "lightType")
        bShader.addUniform("float", "numlights")
        bShader.addUniform("Light", "lights[32]")
        bShader.addToStruct("Light", "bool", "shadow")
        if (settings.useShadow) {
            bShader.addUniform("samplerCube", "shadows")
        }
    }
    bShader.addToStruct("Material", "float", "shininess")
    bShader.addToStruct("Material", "float", "mappingType")
    bShader.addToStruct("Material", "float", "alpha")
    bShader.addToStruct("Material", "float", "specularWeight")
    bShader.addUniform("Material", "material")
    bShader.addUniform("float", "cameraNear")
    bShader.addUniform("float", "cameraFar")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    if (settings.useSpecular) {
        bShader.addUniform("sampler2D", "specular")
    }
    if (settings.useBump) {
        bShader.addUniform("sampler2D", "bump")
        bShader.addToStruct("Material", "float", "bumpWeight")
    }
    if (settings.useReflection || settings.useSky) {
        bShader.addUniform("samplerCube", "cube")
        bShader.addToStruct("Material", "float", "reflectionWeight")
    }
    if (settings.useFog) {
        bShader.addStruct("Fog")
        bShader.addToStruct("Fog", "vec2", "zMinMax")
        bShader.addToStruct("Fog", "vec3", "color")
        bShader.addToStruct("Fog", "float", "intensity")
        bShader.addUniform("Fog", "fog")
    }
    var fragSource = '\
			float rand(vec2 co){\
    			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
			}' + (settings.useShadow ? 'float shadowFac(vec3 ld){\
			vec3 ld2 = vec3(-ld.x,ld.y,ld.z);\
			float sd = textureCube(shadows,ld2).r;\
			float eps = 1.0/cameraFar;\
			float distance = length(ld)/cameraFar;\
			if(distance<=(sd+eps)){\
			    return 1.0;\
			}\
			else{\
			    return 0.5;\
			}\
			}' : '') +
        (settings.useLights ?
            'vec3 lightPow(Light li,vec2 til){\
                vec3 vpos = vPosition.xyz;\
                vec3 lp = li.lightPosition;\
                vec3 lightSub = lp-vpos;\
                float distance = length(lightSub);\
                float att = max(li.attenuation-distance,0.0)/li.attenuation;\
				vec3 lightDirection = normalize(lightSub);\
				vec3 eyeDirection = normalize(-dZ.xyz);\
				float dW = max(0.0,dot(normalEye,lightDirection));\
        		vec3 reflectionDirection = reflect(-lightDirection, normalEye);\
        		float shininess = material.shininess;\
            float specularT = 0.0;\
            vec3 returnedLight = vec3(0.0,0.0,0.0);\
        		' + (settings.useBump ? '\
				vec3 bmpp = texture2D(bump, til).xyz;\
				bmpp = (bmpp -0.5) * 2.0;\
				dW = dW*bmpp.x*(material.bumpWeight)+dW*(1.0-material.bumpWeight);' : '') +
                'if(dW>0.0){'
                + (settings.useSpecular ? '\
       				specularT = texture2D(specular, til).r*pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess/4.0);\
             }' : '\
        		    specularT = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess/4.0);\
              }\
        		') + (settings.useShadow ? '\
        		    if(li.shadow){\
       				    dW = dW*shadowFac(lightSub);\
       				}' : '') +
                'returnedLight = li.color*dW + specularT*material.specularWeight;\
                returnedLight *= att;\
                returnedLight *= li.intensity;\
                return returnedLight;\
            }' : '') +
        'void main(void) {\
            vec2 tiler;' + (settings.useAtlas ? "\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
            " : "\
            tiler = vTex;") +
        (settings.useTiling ?
            'tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
            ' : '') + (settings.boxMapping ? '\
					if(abs(vNormal.z)>0.5){\
						tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
					}else{\
						if(abs(vNormal.y)>0.5){\
							tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
						}\
						else{\
							tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
						}\
					}' : '') + '\
				vec3 dWei = vec3(0.0,0.0,0.0);\
				vec4 clr = vec4(material.color,1.0);\
				' + (settings.useDiffuse ? 'clr = texture2D(diffuse, tiler);\
				clr = vec4(clr.rgb*material.color,clr.a);' : '') + (settings.useReflection ? '\
        vec3 thh = reflect(dZ,normalEye);\
		vec4 txc = textureCube(cube,thh);\
		clr = vec4(clr.rgb*(1.0-material.reflectionWeight)+txc.rgb*material.reflectionWeight,clr.a);\
        ' : '') + (settings.useLights ?
        '\
        for(int i = 0;i<32;i++){\
            if( i >= int(numlights)){\
            break;\
            };\
            Light li = lights[i];\
            if(li.lightType == 1.0){\
            dWei += lightPow(li,tiler);\
            }else{\
            dWei += li.color*li.intensity;\
            }\
        };' : 'dWei = vec3(1.0,1.0,1.0);') + (settings.useSky ? '\
        vec3 thh = vPosition.xyz;\
		vec4 txc = textureCube(cube,thh);\
		clr = vec4(clr.rgb*(1.0-material.reflectionWeight)+txc.rgb*material.reflectionWeight,clr.a);\
        ' : '') + 'clr = vec4(clr.rgb*dWei,clr.a);' + (settings.useFog ? '\
        float depth = vPosition.z/fog.zMinMax.y;\
		clr = vec4(clr.rgb+fog.color*depth*fog.intensity,clr.a);\
        ' : '') + '\
        gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
var OrenNayar = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false,
        boxMapping:false,
    }
    var bShader = new Shader("", "", 1)
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
            if (options[o] == true){
                bShader.define(o);
            }
        }
    }
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVarying("vec3", "vNormal")
    bShader.addVertexSource('\
            void main(void) {\
                normalEye = normalize(NormalMatrix*Normal);\
                vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
                vTex = TexCoord;\
                vNormal = Normal;\
                gl_Position = gl_ProjectionMatrix * vPosition;\
            }')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    bShader.addStruct("Light")
    bShader.addToStruct("Light", "vec3", "lightPosition")
    bShader.addToStruct("Light", "vec3", "color")
    bShader.addToStruct("Light", "float", "attenuation")
    bShader.addToStruct("Light", "float", "intensity")
    bShader.addToStruct("Light", "float", "lightType")
    bShader.addUniform("float", "numlights")
    bShader.addUniform("Light", "lights[32]")
    bShader.addToStruct("Light", "bool", "shadow")
    bShader.addToStruct("Material", "float", "roughness")
    bShader.addToStruct("Material", "float", "albedo")
    bShader.addToStruct("Material", "float", "alpha")
    bShader.addUniform("Material", "material")
    bShader.addUniform("float", "cameraNear")
    bShader.addUniform("float", "cameraFar")
    bShader.addUniform("vec3", "cameraPosition")
    bShader.addUniform("vec3", "cameraDirection")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    if (settings.useReflection || settings.useSky) {
        bShader.addUniform("samplerCube", "cube")
        bShader.addToStruct("Material", "float", "reflectionWeight")
    }
    var fragSource =  "\
    float orenNayarDiffuse(\
      vec3 lightDirection,\
      vec3 viewDirection,\
      vec3 surfaceNormal,\
      float roughness,\
      float albedo) {\
      float LdotV = dot(lightDirection, viewDirection);\
      float NdotL = dot(lightDirection, surfaceNormal);\
      float NdotV = dot(surfaceNormal, viewDirection);\
      float s = LdotV - NdotL * NdotV;\
      float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));\
      float sigma2 = roughness * roughness;\
      float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\
      float B = 0.45 * sigma2 / (sigma2 + 0.09);\
      float result = albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14;\
      return result;\
    }\
    \n#ifdef useShadow\n\
    float shadowFac(vec3 ld){\
            vec3 ld2 = vec3(-ld.x,ld.y,ld.z);\
            float sd = textureCube(shadows,ld2).r;\
            float eps = 1.0/cameraFar;\
            float distance = length(ld)/cameraFar;\
            if(distance<=(sd+eps)){\
                return 1.0;\
            }\
            else{\
                return 0.5;\
            }\
    }\
    \n#endif\n\
    void main(void) {\
        vec2 tiler;\
        tiler = vTex;\
        \n#ifdef useAtlas\n\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
        \n#endif\n\
        \n#ifdef useTiling\n\
            tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
        \n#endif\n\
        \n#ifdef boxMapping\n\
            if(abs(vNormal.z)>0.5){\
                tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
            }else{\
                if(abs(vNormal.y)>0.5){\
                    tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
                }\
                else{\
                    tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
                }\
            }\
        \n#endif\n\
        vec3 dWei = vec3(1.0,1.0,1.0);\
        vec4 clr = vec4(material.color,1.0);\
        \n#ifdef useDiffuse\n\
        clr = texture2D(diffuse, tiler);\
        clr = vec4(clr.rgb*material.color,clr.a);\
        \n#endif\n\
        \n#ifdef useLights\n\
            dWei = vec3(0.0,0.0,0.0);\
            for(int i = 0;i<32;i++){\
                if( i >= int(numlights)){\
                break;\
                };\
                Light li = lights[i];\
                if(li.lightType == 1.0){\
                    dWei += orenNayarDiffuse(normalize(li.lightPosition-vPosition.xyz),normalize(cameraPosition-vPosition.xyz),normalEye,material.roughness,material.albedo);\
                    \n#ifdef useShadow\n\
                    if(li.shadow){\
                        dWei = dW*shadowFac(lightSub);\
                    }\
                    \n#endif\n\
                }\
                else{\
                    dWei += li.color*li.intensity;\
                }\
            };\
        \n#endif\n\
        clr = vec4(clr.rgb*dWei,clr.a);\
        gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
    }";
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
var basicMobileShader = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false
    }
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "vNormal")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVertexSource('\
			void main(void) {\
			    normalEye = normalize(Normal*NormalMatrix);\
			    vNormal = Normal;\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    vTex = TexCoord;\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    bShader.addUniform("Material", "material")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    var fragSource =
        'void main(void) {\
            vec2 tiler;' + (settings.useAtlas ? "\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
            " : "\
            tiler = vTex;") +
        (settings.useTiling ?
            'tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
            ' : '') + (settings.boxMapping ? '\
					if(abs(vNormal.z)>0.5){\
						tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
					}else{\
						if(abs(vNormal.y)>0.5){\
							tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
						}\
						else{\
							tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
						}\
					}' : '') + '\
				vec3 dWei = vec3(0.0,0.0,0.0);\
				vec4 clr = vec4(material.color,1.0);\
				' + (settings.useDiffuse ? 'clr = texture2D(diffuse, tiler);\
				clr = vec4(clr.rgb*material.color,clr.a);' : '') + 'dWei = vec3(1.0,1.0,1.0);\
				clr = vec4(clr.rgb*dot(normalEye,normalize(vec3(2.0,10.0,10.0))),clr.a);' + '\
        gl_FragColor = vec4(clr.rgb,clr.a);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}

var ZBufferShader = function () {
    return new Shader('\
						varying vec4 vPos;\
						void main(){\
						vPos = gl_ModelViewMatrix * vec4(gl_Vertex, 1.0);\
						gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * vec4(gl_Vertex, 1.0);\
						}\
						', '\
						varying vec4 vPos;\
						uniform float zNear;\
						uniform float zFar;\
						void main(){\
							float factor;\
							factor = 1.0-abs(vPos.z-zNear)/abs(zFar-zNear);\
							if(vPos.z < zFar){\
								factor=0.0;\
							}\
							if(vPos.z > zNear){\
								factor=1.0;\
							}\
							gl_FragColor = vec4(1.0,factor,factor,1.0);\
						}\
						');
};
/**
 * ZBuffer class
 * @class ZBuffer
 * @constructor
 */
var ZBuffer = function (options) {
    this.width = 1024;
    this.height = 1024;
    for (var i in options) {
        this[i] = options[i]
    }
    this.buffer = gl.createFramebuffer();
    this.buffer.width = this.width;
    this.buffer.height = this.height;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    this.texture = new Texture();
    this.texture.width = this.width
    this.texture.height = this.height
    this.texture.handleZB();
    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.id, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
        gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.texture.complete = 0
}
/**
 * Bind cube framebuffer before drawing
 * @method bindCube
 * @param cubeFace Face of the cube ENUM
 */
ZBuffer.prototype.bindCube = function (cubeFace) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, cubeFace, this.texture.id, 0);
}
/**
 * Bind framebuffer before drawing
 * @method bind
 */
ZBuffer.prototype.bind = function () {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
}
/**
 * Unbind framebuffer
 * @method unbind
 */
ZBuffer.prototype.unbind = function () {
    gl.bindTexture(gl.TEXTURE_2D, this.texture.id);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
/**
 * ZBufferCube class
 * @class ZBuffer
 * @constructor
 */
var ZBufferCube = function (options) {
    this.width = 1024;
    this.height = 1024;
    this.position = new Vector()
    for (var i in options) {
        this[i] = options[i]
    }
    this.buffers = [];
    this.texture = new Texture();
    this.texture.width = this.width
    this.texture.height = this.height
    this.texture.handleZBCube();

    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    var arr = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
    for(var i=0;i<6;i++){
        var fb = gl.createFramebuffer()
        fb.width = this.width;
        fb.height = this.height;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,arr[i], this.texture.id, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
        this.buffers.push(fb)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.texture.complete = 0
}
/**
 * Bind framebuffer before drawing
 * @method bind
 */
ZBufferCube.prototype.bind = function (n) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffers[n]);
}
/**
 * Unbind framebuffer
 * @method unbind
 */
ZBufferCube.prototype.unbind = function () {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
/**
 * Draw Scene into framebuffer cube texture
 * @method draw
 * @param drawFunction(uniforms) drawFunction to pass uniforms to
 * @example
 *      var cube = new ZBufferCube()
 *      cube.draw(function(uniforms){
 *          world.draw();
 *      })
 * @example
 *      var cube = new ZBufferCube()
 *      var shaderOverride = basicShader({color:[1.0,0.0,0.0]})
 *      cube.draw(function(uniforms){
 *          world.drawOverride(shaderOverride,uniforms);
 *      })
 */
ZBufferCube.prototype.draw = function(drawFunction){
    var degs = [
        [0, 90, 0],
        [0, -90, 0],
        [90, 0, 0],
        [-90, 0, 0],
        [0, 0, 0],
        [0, 180, 0]
    ]
    for (var i = 0; i < 6; i++) {
        gl.viewport(0, 0, this.width, this.height);
        this.bind(i)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var m = Matrix.perspective(90.0, 1.0, 0.01, 100.0);
        m = m.rotateVector(degs[i][0], degs[i][1], degs[i][2]);
        m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
        drawFunction({
            _gl_ProjectionMatrix: m,
            lightPosition: this.position.toArray()
        })
        this.unbind()
    }
}

/**
 @module Shadow
 */

var shadowShader = function (options) {
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec4", "vPosition")
    bShader.addVertexSource('\
			void main(void) {\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')
    bShader.addUniform("float", "near")
    bShader.addUniform("float", "far")
    bShader.addUniform("vec3", "lightPosition")
    var fragSource = 'void main(void) {\
        vec3 vpos = vec3(vPosition.x,vPosition.y,vPosition.z);\
        vec3 lpp = lightPosition;\
        float distance = length(lpp-vpos);\
        float ndepth = distance/far;\
        gl_FragColor = vec4(ndepth,ndepth,ndepth,1.0);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
var varianceDepth = function (options) {
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec4", "vPosition")
    bShader.addVertexSource('\
			void main(void) {\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')
    bShader.addUniform("vec3", "lightPosition")
    var fragSource = '//\
        void main(){\
            vec3 vpos = vPosition.xyz;\
            vec3 lpp = lightPosition;\
            float distance = min(length(lpp-vpos),near);\
            float depth = max(min(distance/far,0.0),1.0);\
            float dx = dFdx(depth);\
            float dy = dFdy(depth);\
            gl_FragColor = vec4(depth, pow(depth, 2.0) + 0.25*(dx*dx + dy*dy), 0.0, 1.0);\
        }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
/**
 * @class Shadow
 * @param {Scene} scene
 * @param {Vector} lightPosition of pointLight
 * @param {float} [near] near shadow plane
 * @param {float} [far] far shadow plane
 * @param {int} [resolution] shadow map resolution
 * @constructor
 */
Shadow = function (scene, lightPosition,near,far,resolution) {
    this.map = new ZBufferCube({
        width:resolution || 512,
        height:resolution || 512
    })
    this.scene = scene
    this.far = far || 100.0
    this.near = near || 0.1
    this.shader = shadowShader()
    this.position = lightPosition
    this.projectionMatrix = Matrix.perspective(90.0, 1.0, this.near, this.far);
}
/**
 * draws shadow
 * @method draw
 */
Shadow.prototype.draw = function () {
    var degs = [
        [0, 90, 0],
        [0, -90, 0],
        [90, 0, 0],
        [-90, 0, 0],
        [0, 0, 0],
        [0, 180, 0]
    ]
    for (var i = 0; i < 6; i++) {
        gl.viewport(0, 0, this.map.width, this.map.height);
        this.map.bind(i)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var m = this.projectionMatrix
        m = m.rotateVector(degs[i][0], degs[i][1], degs[i][2]);
        m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
        this.scene.drawOverride(this.shader, {
            _gl_ProjectionMatrix: m.m,
            lightPosition: this.position.toArray(),
            near:this.near,
            far:this.far
        })
        this.map.unbind()
    }
}
/**
 * @module camera
 */
/**
  * Camera class
  * @class Camera
	* @extends Aex
  * @constructor
  * @param {float} [near] near Plane
  * @param {float} [far] far Plane
  * @param {float} [angle] angle of perspective camera
  * @example
  *     world = new Scene()
  *     camera = new Camera()
  *     camera.position = new Vector(0.1, -1, -10);
*/
Camera = function(near,far,angle) {
	this.__defineSetter__("projectionMatrix", function (val) {
		this.parentMatrix = val
	});
	this.__defineGetter__("projectionMatrix", function () {
		return this.parentMatrix
	});
	/**
	* Position of object
	* @property position
	* @type Vector
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.position = new Vector(1.0,2.0,3.0)
	*/
	this.__defineSetter__("position", function (val) {
		this._position = val
	});
	this.__defineGetter__("position", function () {
		return this._position
	});
	/**
	* x Position of object
	* @property x
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.x = 20.0
	*/
	this.__defineSetter__("x", function (val) {
		this._position.x = val
		this.setModelView()
	});
	/**
	* y Position of object
	* @property y
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.y = 20.0
	*/
	this.__defineSetter__("y", function (val) {
		this._position.y = val
		this.setModelView()
	});
	/**
	* z Position of object
	* @property z
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.z = 20.0
	*/
	this.__defineSetter__("z", function (val) {
		this._position.z = val
		this.setModelView()
	});
	this.__defineGetter__("x", function () {
		return this._position.x
	});
	this.__defineGetter__("y", function () {
		return this._position.y
	});
	this.__defineGetter__("z", function () {
		return this._position.z
	});
	/**
	* Rotation of object
	* @property rotation
	* @type Vector
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.rotation = new Vector(0.0,90.0,0.0)
	*/
	this.__defineSetter__("rotation", function (val) {
		this._rotation = val
	});
	this.__defineGetter__("rotation", function () {
		return this._rotation
	});

	/**
	* x Rotation of object
	* @property rotX
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.rotX = 20.0
	*/
	this.__defineSetter__("rotX", function (val) {
		this._rotation.x = val
		this.setModelView()
	});
	/**
	* y Rotation of object
	* @property rotY
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.rotY = 20.0
	*/
	this.__defineSetter__("rotY", function (val) {
		this._rotation.y = val;
		this.setModelView()
	});
	/**
	* z Rotation of object
	* @property rotZ
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.rotZ = 20.0
	*/
	this.__defineSetter__("rotZ", function (val) {
		this._rotation.z = val
		this.setModelView()
	});
	this.__defineGetter__("rotX", function () {
		return this._rotation.x
	});
	this.__defineGetter__("rotY", function () {
		return this._rotation.y
	});
	this.__defineGetter__("rotZ", function () {
		return this._rotation.z
	});

	this.__defineSetter__("size", function (val) {
		this._size = val;
	});
	this.__defineGetter__("size", function () {
		return this._size
	});
	/**
	* x scale of object
	* @property scaleX
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Aex()
	*     cam.scaleX = 2.0
	*/
	this.__defineSetter__("scaleX", function (val) {
		this._size.x = val;
		this.setModelView()
	});
	/**
	* y scale of object
	* @property scaleY
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.scaleY = 2.0
	*/
	this.__defineSetter__("scaleY", function (val) {
		this._size.y = val
		this.setModelView()
	});
	/**
	* z scale of object
	* @property scaleZ
	* @type Float
	* @example
	*     world = new Scene()
	*     cam = new Camera(0.1,100,45)
	*     cam.scaleZ = 2.0
	*/
	this.__defineSetter__("scaleZ", function (val) {
		this._size.z = val
		this.setModelView()
	});
	this.__defineGetter__("scaleX", function () {
		return this._size.x
	});
	this.__defineGetter__("scaleY", function () {
		return this._size.y
	});
	this.__defineGetter__("scaleZ", function () {
		return this._size.z
	});
	this.modelView = new Matrix();
	this.aabb = {};
	this._size = new Vector(1.0, 1.0, 1.0);
	this._rotation = new Vector(0.0, 0.0, 0.0);
	this._position = new Vector(0.0, 0.0, 0.0);
	this.cameraDefaultMouseController = false
    this.near = near || 0.1;
    this.far = far || 100.0;
    this.angle = angle || 45.0
    this.setPerspective()
		this.setDisplay()
		this.uniforms = {
        _gl_ProjectionMatrix:this.projectionMatrix,
        cameraNear:this.near,
        cameraFar:this.far
    }
}
Camera.prototype = Object.create(Aex.prototype);
Camera.prototype.constructor = Camera;
Camera.prototype.setModelView = function () {
	var m = this.parentMatrix
	m = m.multiply(Matrix.scale(this.size.x, this.size.y, this.size.z));
	m = m.multiply(Matrix.rotate(this.rotation.x, 1, 0, 0));
	m = m.multiply(Matrix.rotate(this.rotation.y, 0, 1, 0));
	m = m.multiply(Matrix.rotate(this.rotation.z, 0, 0, 1));
	m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
	this.modelView = m
	this.NormalMatrix = this.modelView.toInverseMat3()

}
/**
* set orthographic projection for camera
* @method setOrthoPerspective
*/
Camera.prototype.setOrthoPerspective = function(){
	this.projectionMatrix = Matrix.orthoPerspective(this.angle, gl.canvas.width / gl.canvas.height, this.near, this.far)
}
/**
* set perspective projection for camera
* @method setPerspective
*/
Camera.prototype.setPerspective = function(){
	this.projectionMatrix = Matrix.perspective(this.angle, gl.canvas.width / gl.canvas.height, this.near, this.far)
}
Camera.prototype.setToMatrix = function(m){
	this.projectionMatrix = m
}
/**
* put the camera at the eye point looking `e`
* toward the center point `c`  with an up direction of `u`.
* @method lookAt
* @param {Vector} e Eye point
* @param {Vector} c Center point
* @param {Vector} u Up vector
* @return {Matrix} Result matrix
*/
Camera.prototype.setLookAt = function(e,c,u){
	this.projectionMatrix = this.projectionMatrix.multiply(Matrix.lookAt(e,c,u))
	this.setModelView()
}
Camera.prototype.transforms = function(){
	if(this.cameraDefaultMouseController == true){
		this.onTransforms()
	}
	var m = this.modelView
	this.uniforms._gl_ProjectionMatrix = m.m
	gl.frustum.fromPerspectiveMatrix(m)
}

// BACKWARD COMPATIBILITY

/**
* Set table with screen dimensions and coordinates for 2D games
* @method setDisplay
*/
Camera.prototype.setDisplay = function() {
	var display = []
	display.height = Math.abs( 2 * this.position.z * Math.tan( (gl.angle * ( Math.PI/180))/2 ) )
	display.width = Math.abs( display.height * (gl.canvas.width/gl.canvas.height) )
	display.left = -display.width/2 - this.position.x
	display.right = display.width/2 - this.position.x
	display.top = display.height/2 - this.position.y
	display.bottom = -display.height/2 - this.position.y
	display.centerX = display.left + display.width/2
	display.centerY = display.top - display.height/2
	this.display = display
}
/**
* Set camera position
* @method setCameraPosition
*/
Camera.prototype.setCameraPosition = function(vec) {
	this.position = vec
	this.setDisplay()

}

Camera.prototype.onTransforms = function(){
	this.positionBefore= this.position
	this.yaw(this.yawStep)
	this.pitch(this.pitchStep)
	this.forward(this.forwardStep)
	this.forwardStep *= this.forwardReduce
	this.side(this.sideStep)
	this.updown(this.upStep)
	this.yawStep *= 0.78
	this.pitchStep *= 0.78
	this.setModelView()
}
Camera.prototype.forward = function(f) {
	if(f == 0.0){ return true }
	var fac = -f;
	yRad = this.rotY * (Math.PI / 180.0);
	xRad = this.rotX * (Math.PI / 180.0);
	yChange = fac * Math.sin(xRad);
	zChange = fac * Math.cos(yRad);
	xChange = -fac * Math.sin(yRad);
	this.position.y += yChange;
	this.position.z += zChange;
	this.position.x += xChange;
}

/**
* DEPRECATED use setters instead
* Move camera left & right
* @method side
* @param {float} f distance to move
*/
Camera.prototype.side = function(f) {
	if(f == 0.0){ return true }
	var fac = -f;
	yRad = this.rotation.y * (Math.PI / 180.0)
	zChange = fac * Math.sin(yRad);
	xChange = fac * Math.cos(yRad);
	this.position.z += zChange;
	this.position.x += xChange;
}
/**
* DEPRECATED use setters instead
* Move camera up & down
* @method updown
* @param {float} f distance to move
*/
Camera.prototype.updown = function(f) {
	if(f == 0.0){ return true }
	var fac = f;
	this.position.y += fac;
}
/**
* DEPRECATED use setters instead
* Rotate on local x axis
* @method pitch
* @param {float} change rotation
*/
Camera.prototype.pitch = function(change) {
	this.rotation.x += this.sensitivity * change;
}
/**
* DEPRECATED use setters instead
* Rotate on local y axis
* @method pitch
* @param {float} change rotation
*/
Camera.prototype.yaw = function(change) {
	this.rotation.y += this.sensitivity * change;
}
/**
* DEPRECATED use setters instead
* Rotate on local z axis
* @method roll
* @param {float} change rotation
*/
Camera.prototype.roll = function(change) {
	this.rotation.z += this.sensitivity * change;
}
/**
* DEPRECATED use setters instead
* Turn on standard camera mouse and WSAD operating
* @method on
* @param {float} factor sensitivity of camera
*/
Camera.prototype.on = function(factor) {
	this.cameraDefaultMouseController = true
	this.forwardStep = 0.0
	this.sideStep = 0.0
	this.upStep = 0.0
	this.forwardReduce = 1.0
	this.yawStep = 0.0;
	this.pitchStep = 0.0;
	this.sensitivity = 1.0
	this.tempX = null;
	this.tempY = null;
	this.md = 0;
	this.factor = factor || 0.1;
	var t = this;
	document.onkeydown = function(e) {
		var ev = e || window.event;
		if(ev.keyCode == 87) {
			t.forwardStep = t.factor
			t.forwardReduce =1.0
		}
		if(ev.keyCode == 83) {
			t.forwardStep = -t.factor
			t.forwardReduce =1.0
		}
		if(ev.keyCode == 68) {
			t.sideStep=-t.factor
		}
		if(ev.keyCode == 65) {
			t.sideStep=t.factor
		}
		if(ev.keyCode == 81) {
			t.upStep=t.factor
		}
		if(ev.keyCode == 69) {
			t.upStep=-t.factor
		}
	}
	document.onkeyup= function(e) {
		var ev = e || window.event;
		if(ev.keyCode == 87) {
			t.forwardReduce =0.78
		}
		if(ev.keyCode == 83) {
			t.forwardReduce =0.78
		}
		if(ev.keyCode == 68) {
			t.sideStep=0.0
		}
		if(ev.keyCode == 65) {
			t.sideStep=0.0
		}
		if(ev.keyCode == 81) {
			t.upStep=0.0
		}
		if(ev.keyCode == 69) {
			t.upStep=0.0
		}
	}
	mouseDown = function(e) {
		var x = e.clientX ? e.clientX : e.x;
		var y = e.clientY ? e.clientY : e.y;
		t.tempX = x;
		t.tempY = y;
		t.mD = e.button+1;
	}
	mouseMove = function(ev) {
		if(t.eC == 0 || (t.eC != 0 && t.mD != 0)) {
			if(t.tempX == null && t.tempY == null) {
				t.tempX = ev.clientX;
				t.tempY = ev.clientY;
			}
			var curX = ev.clientX;
			var curY = ev.clientY;
			var deltaX = (t.tempX - curX) * t.sensitivity;
			var deltaY = (t.tempY - curY) * t.sensitivity;
			t.tempX = curX;
			t.tempY = curY;
			if( t.mD ==1){
				t.yawStep = -deltaX;
				t.pitchStep = -deltaY;
			}
			else if(  t.mD ==2){
				t.side(deltaX*0.05);
				t.updown(deltaY*0.05);
			}

		}
	}
	mouseUp = function(e) {
		t.mD = 0;
	}
	gl.canvas.addEventListener('mousedown', mouseDown, false);
	gl.canvas.addEventListener('mousemove', mouseMove, false);
	gl.canvas.addEventListener('mouseup', mouseUp, false);
}

/**
 * aexolGL class
 * @class aexolGL
 * @constructor
 * @param {Dict} options Options
 */
aexolGL = function(options) {
    this.settings = {}
    gl.projectionMatrix = new Matrix();
    gl.uniformsSet = {}
    gl.frustum = new Frustum()
    gl.angle = 45
    gl.pause = false;
    this.matrix = null;

    gl.nTexture = 0;
    gl.cbTexture = 0;
    gl.nShader = 1

    gl.loadedElements = {}
    gl.progress = 0.0

    gl.MAX_NUMBER_OF_TEXTURES = 8;

    gl.frame = 0;
    /* End of GL overloads */
    var __error = function(text) {
      if (window.handleError)
        window.handleError(text);
      throw text;
    }
  }
  /**
   * Inits the framebuffer
   * @method initGL
   */
aexolGL.prototype.initGL = function() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  /**
   * Start the engine
   * @method init
   */
aexolGL.prototype.init = function() {
  var t = this
  this.initDefaultPreloader()

  function checkIfElementsAreLoaded() {
    var le = Resource.loadedElements
    var allLoaded = Object.keys(le).length
    if (allLoaded == 0) {
      t.defaultPreload(100);
      t.executeInit()
    } else {
      var ready = 0
      for (var l in le) {
        ready += le[l]
      }
      var percentage = ready / allLoaded
      if (percentage == 1.0) {
        t.defaultPreload((percentage * 100).toFixed(2));
        t.executeInit()
      } else {
        t.defaultPreload((percentage * 100).toFixed(2));
        setTimeout(checkIfElementsAreLoaded, 10)
      }
    }
  }

  setTimeout(checkIfElementsAreLoaded, 10)
}
aexolGL.prototype.initV2 = function() {
  var t = this
  this.initDefaultPreloader()

  function checkIfElementsAreLoaded() {
    var le = Resource.loadedElements
    var allLoaded = Object.keys(le).length
    if (allLoaded == 0) {
      t.defaultPreload(100);
      t.executeInitV2()
    } else {
      var ready = 0
      for (var l in le) {
        ready += le[l]
      }
      var percentage = ready / allLoaded
      if (percentage == 1.0) {
        t.defaultPreload((percentage * 100).toFixed(2));
        t.executeInitV2()
      } else {
        t.defaultPreload((percentage * 100).toFixed(2));
        setTimeout(checkIfElementsAreLoaded, 10)
      }
    }
  }

  setTimeout(checkIfElementsAreLoaded, 10)
}
AexolGL = function(canvasId, options) {
  var lastTime = 0;
  setGL(canvasId)
  agl = new aexolGL()
  agl.settings = {
    setup: function() {

    },
    logic: function() {

    },
    draw: function() {

    },
  };
  for (var o in options) {
    if (agl.settings.hasOwnProperty(o)) {
      agl.settings[o] = options[o]
    }
  }
  agl.settings.setup()
  agl.initGL()
  agl.initV2()
  return agl
}
aexolGL.prototype.executeInitV2 = function() {
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var that = this
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = Date.now(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
  gl.enable(gl.DEPTH_TEST);
  if (that.animframe) {
    window.cancelAnimationFrame(that.animframe);
  }
  (function animloop() {
    if (gl.pause == false) {
      that.settings.logic()
      that.settings.draw();
      gl.frame += 1;
    }
    that.animframe = window.requestAnimationFrame(animloop, gl.canvas);
  })();
}
aexolGL.prototype.executeInit = function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];

  }

  if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = function(callback, element) {

      var currTime = Date.now(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;

    };

  }


  if (!window.cancelAnimationFrame) {

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

  }
  var draw = function() {
    gl.viewport(0, 0, 800, 800);
  }
  gl.enable(gl.DEPTH_TEST);
  if (window.draw) {
    if (gl.animframe) {
      window.cancelAnimationFrame(gl.animframe);
    }
    (function animloop() {
      gl.GLTD = ""
      gl.GLTD = gl.GLTD + gl.GLT
      gl.GLT = ""
      if (gl.pause == false) {
        if (window.logic) {
          window.logic()
        }
        window.animations()
        window.draw();
        gl.frame += 1;
      }
      gl.animframe = window.requestAnimationFrame(animloop, gl.canvas);
    })();
  } else {
    draw();
  }
}
aexolGL.prototype.initDefaultPreloader = function() {
  if (!window.progress && !this.settings.progress) {
    this.progresstext = document.createElement("div")
    this.progresstext.style.color = "white"
    this.progresstext.style.zIndex = 999
    this.progresstext.style.letterSpacing = "2px"
    this.progresstext.style.fontVariant = "small-caps"
    this.progresstext.style.textAlign = "center"
    this.progresstext.style.position = "absolute"
    this.progresstext.style.lineHeight = "25px"
    this.progresstext.style.marginLeft = (gl.canvas.offsetLeft + gl.canvas.width / 2.0 - 71) + "px"
    this.progresstext.style.marginTop = (gl.canvas.height / 2.0 - 12) + "px"
    gl.canvas.parentNode.insertBefore(this.progresstext, gl.canvas)
  }
}
aexolGL.prototype.defaultPreload = function(e) {
  if (!this.settings.progress) {
    this.progresstext.innerHTML = "aexolgl is<br>loading " + e + "%"
    if (e == 100) {
      this.progresstext.remove()
    }
  } else {
    if(!window.progress){
      this.settings.progress(e)
    }
    else{
      window.progress
    }
  }
}

/**
@module Physics
*/
Physics = function(parent){
	MObject.call(this,parent)
}
Physics.prototype =  Object.create(MObject.prototype);
Physics.prototype.constructor = Physics
Body = function(parent,kind){
	MObject.call(this,parent)
}
Body.prototype =  Object.create(MObject.prototype);
Body.prototype.constructor = Body
/**
@module start
*/
function getImage(img){
	BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/path/to/image.png', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
	  if (this.status == 200) {
	    var bb = new BlobBuilder();
	    bb.append(this.response);
	    var blob = bb.getBlob('image/jpg');
	  }
	};
	xhr.send();
}
/**
Starts webgl
@method glStart()
@static
*/
function glStart(setupFunction){
    setupFunction();
    var canvasFittedToScreen = false
    if (gl.canvas.width == window.innerWidth && gl.canvas.height == window.innerHeight){
        canvasFittedToScreen = true
    }
    window.onresize = function(event) {
        gl.canvas.width = window.innerWidth
        gl.canvas.height = window.innerHeight
        canvasInit()
    };
}

/**
 @module Game
 */
window.animations = function () {
    for (var g in GO) {
        var go = GO[g]
        if (go) {
            for (var a in go.animations) {
                var ani = go.animations[a]
                ani.execute()
            }
        }
    }
}
GO = []
/**
 Main class for creating objects in aexolGL engine. Takes care for connecting RenderTree objects.
 @class GameObject
 @constructor
 @param scene {Scene} scene where GameObject exists
 @example
     world = new Scene();
     gshader = new basicShader()
     skyMat = new Material({color:[0.4,0.7,1],shininess:13.0,specularWeight:0.0	})
     skyMesh = Mesh.sphere().scale(30.0,10.0,30.0)
     someLight = new Light({
            lightPosition: new Vector(1.3,4.0,-2.0),
            attenuation: 40.0,
            intensity: 1.33,
            color: [0.8,1.0,1.0]
        })
     sky = new GameObject(world,{
            shader:gshader,
            material:skyMat,
            mesh:skyMesh,
            light:someLight
        })
 */
GameObject = function (scene, options) {
    /**
     * Aex connected to this game object
     * @property aex
     * @type Aex
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.aex = new Aex()
     */
    this.__defineSetter__("aex", function (val) {
        if (!this._mesh) {
            throw "Specify mesh for your GameObject before connecting aex"
        }
        if (this._aex) {
            this._mesh.removeChild(this._aex)
        }
        this._aex = val;
        this._aex.setParent(this._mesh)
    });
    this.__defineGetter__("aex", function () {
        return this._aex;
    });
    /**
     * Mesh connected to this game object
     * @property mesh
     * @type Mesh
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.mesh = Mesh.sphere()
     */
    this.__defineSetter__("mesh", function (val) {
        if (!this._material) {
            throw "Specify material for your GameObject before connecting mesh"
        }
        if (this._mesh) {
            this._material.removeChild(this._mesh)
        }
        this._mesh = val;
        this._mesh.setParent(this._material)
        this._aex = this._aex || new Aex()
        this._aex.setParent(this._mesh)
    });
    this.__defineGetter__("mesh", function () {
        return this._mesh;
    });
    /**
     * Material connected to this game object
     * @property material
     * @type Material
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.material = new Material({})
     */
    this.__defineSetter__("material", function (val) {
        if (!this._shader) {
            throw "Specify shader for your GameObject before connecting material"
        }
        if (this._material) {
            if (this._light) {
                this._light.removeChild(this._material)
            } else {
                this._shader.removeChild(this._material)
            }
        }
        this._material = val;
        this._material.setParent(this._shader)
        if (this._mesh) {
            this._mesh.setParent(this._material)
        }
    });
    this.__defineGetter__("material", function () {
        return this._material;
    });
    /**
     * Shader connected to this game object
     * @property shader
     * @type Shader
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.shader = new Shader({})
     */
    this.__defineSetter__("shader", function (val) {
        if (this._shader) {
            if (this._light) {
                this._light.removeChild(this._shader)
            } else {
                this.scene.removeChild(this._shader)
            }
        }
        this._shader = val;
        if (this._light) {
            this._shader.setParent(this._light)
        } else {
            this._shader.setParent(this.scene)
        }
        if (this._material) {
            this._material.setParent(this._shader)
        }
    });
    this.__defineGetter__("shader", function () {
        return this._shader;
    });
    /**
     * Light system connected to this game object
     * @property light
     * @type Light
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.light = new Light({})
     */
    this.__defineSetter__("light", function (val) {
        if(this._light){
            this.scene.removeChild(this._light)
        }
        this._light = val;
        this._light.setParent(this.scene);
        if (this._shader) {
            this._shader.setParent(this._light)
        }
    });
    this.__defineGetter__("light", function () {
        return this._light;
    });
    /**
     * Uniforms of object
     * @property uniforms
     * @type Dict
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.uniforms["tiling"] = [1.0,10.0]
     * You can also set uniforms of the material easily
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{...})
     *     game.uniforms["color"] = [1.0,0.0,0.0]
     *     game.uniforms["alpha"] = 0.2
     */
    this.__defineSetter__("uniforms", function (val) {
        this._aex.uniforms = val;
    });
    this.__defineGetter__("uniforms", function () {
        return this._aex.uniforms;
    });
    /**
     * Position of object
     * @property position
     * @type Vector
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.position = new Vector(1.0,2.0,3.0)
     */
    this.__defineSetter__("position", function (val) {
        this._aex.position = val
        this.setModelView()
    });
    this.__defineGetter__("position", function () {
        return this.aex._position
    });
    /**
     * x Position of object
     * @property x
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.x = 20.0
     */
    this.__defineSetter__("x", function (val) {
        this._aex.position.x = val
        this.setModelView()
    });
    /**
     * y Position of object
     * @property y
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.y = 20.0
     */
    this.__defineSetter__("y", function (val) {
        this._aex.position.y = val
        this.setModelView()
    });
    /**
     * z Position of object
     * @property z
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.z = 20.0
     */
    this.__defineSetter__("z", function (val) {
        this._aex.position.z = val
        this.setModelView()
    });
    this.__defineGetter__("x", function () {
        return this.aex._position.x
    });
    this.__defineGetter__("y", function () {
        return this.aex._position.y
    });
    this.__defineGetter__("z", function () {
        return this.aex._position.z
    });
    /**
     * Rotation of object
     * @property rotation
     * @type Vector
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.rotation = new Vector(0.0,90.0,0.0)
     */
    this.__defineSetter__("rotation", function (val) {
        this._aex.rotation = val
        this.setModelView()
    });
    this.__defineGetter__("rotation", function () {
        return this.aex._rotation
    });

    /**
     * x Rotation of object
     * @property rotX
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.rotX = 20.0
     */
    this.__defineSetter__("rotX", function (val) {
        this._aex.rotation.x = val
        this.setModelView()
    });
    /**
     * y Rotation of object
     * @property rotY
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.rotY = 20.0
     */
    this.__defineSetter__("rotY", function (val) {
        this._aex.rotation.y = val;
        this.setModelView()
    });
    /**
     * z Rotation of object
     * @property rotZ
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.rotZ = 20.0
     */
    this.__defineSetter__("rotZ", function (val) {
        this._aex.rotation.z = val
        this.setModelView()
    });
    this.__defineGetter__("rotX", function () {
        return this.aex._rotation.x
    });
    this.__defineGetter__("rotY", function () {
        return this.aex._rotation.y
    });
    this.__defineGetter__("rotZ", function () {
        return this.aex._rotation.z
    });

    this.__defineSetter__("size", function (val) {
        this._aex.size = val;
        this.setModelView()
    });
    this.__defineGetter__("size", function () {
        return this.aex._size
    });
    /**
     * x scale of object
     * @property scaleX
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.scaleX = 2.0
     */
    this.__defineSetter__("scaleX", function (val) {
        this._aex.size.x = val;
        this.setModelView()
    });
    /**
     * y scale of object
     * @property scaleY
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.scaleY = 2.0
     */
    this.__defineSetter__("scaleY", function (val) {
        this._aex.size.y = val
        this.setModelView()
    });
    /**
     * z scale of object
     * @property scaleZ
     * @type Float
     * @example
     *     world = new Scene()
     *     game = new GameObject(world,{})
     *     game.scaleZ = 2.0
     */
    this.__defineSetter__("scaleZ", function (val) {
        this._aex.size.z = val
        this.setModelView()
    });
    this.__defineGetter__("scaleX", function () {
        return this.aex._size.x
    });
    this.__defineGetter__("scaleY", function () {
        return this.aex._size.y
    });
    this.__defineGetter__("scaleZ", function () {
        return this.aex._size.z
    });
    this.scene = scene
    if (options.light) {
        this.light = options.light
    }
    if (options.shader) {
        this.shader = options.shader
    }
    if (options.material) {
        this.material = options.material
    }
    if (options.mesh) {
        this.mesh = options.mesh
        this.aex = options.aex || new Aex()
        this.setModelView()
    }
    this.animations = []
    if (GO.indexOf(this) == -1) {
        GO.push(this)
    }
}
/**
 * Replace modelView in RenderNode
 * @method setModelView
 */
GameObject.prototype.setModelView = function () {
    this.aex.setModelView()
}
/**
 * Scale the object
 * @method scale
 * @param {float} x  Scale in x axis
 * @param {float} y  Scale in y axis
 * @param {float} z  Scale in z axis
 * @param {boolean} r  Scale relative to actual scale
 * @example
 *     world = new Scene()
 *     game = new GameObject(world,{})
 *     //absolute scale
 *     game.scale(1.2,1.2,1.3)
 *     //relative scale
 *     game.scale(0,1,0,1)
 */
GameObject.prototype.scale = function (x, y, z, r) {
    this.aex.scale(x,y,z,r)
    return this
}
/**
 * Scale the object uniform in all axes
 * @method scaleUniform
 * @param {float} f  Scale factor
 * @param {boolean} r  Scale relative to actual scale
 */
GameObject.prototype.scaleUniform = function (f, r) {
    this.aex.scaleUniform(f,r)
    return this
}
/**
 * Move the object
 * @method move
 * @param {float} x  Move in x axis
 * @param {float} y  Move in y axis
 * @param {float} z  Move in z axis
 * @param {boolean} r  Move relative to actual position
 * @example
 *     world = new Scene()
 *     game = new GameObject(world,{})
 *     //absolute move
 *     game.move(0,1,0)
 *     //relative move
 *     game.move(0,1,0,1)
 */
GameObject.prototype.move = function (x, y, z, r) {
    this.aex.move(x,y,z,r)
    return this
}
/**
 * Rotate the object (degrees)
 * @method rotate
 * @param {float} x  Rotate in x axis
 * @param {float} y  Rotate in y axis
 * @param {float} z  Rotate in z axis
 * @param {boolean} r  Rotate relative to actual rotation
 * @example
 *     world = new Scene()
 *     game = new GameObject(world,{})
 *     //absolute rotate
 *     game.rotate(0,1,0)
 *     //relative rotate
 *     game.rotate(0,1,0,1)
 */
GameObject.prototype.rotate = function (x, y, z, r) {
    this.aex.rotate(x,y,z,r);
    return this
}
GameObject.prototype.rotateAroundPoint = function (center,x,y,z) {
    this.aex.rotateAroundPoint(center,x,y,z);
    return this
}
/**
 * Adds animation to GameObject
 * @method addAnimation
 * @param {Animation} animation to add to animations.
 */
GameObject.prototype.addAnimation = function (animation) {
    this.animations.push(animation)
    return this
}
/**
 * Removes GameObject
 * @method remove
 */
GameObject.prototype.remove = function () {
    if (this.aex) {
        this.aex.remove()
    }
    GO.splice(GO.indexOf(this), 1);
}
/**
 * Main Class for constructing groups and hierarchy
 * @class Pivot
 * @extends Aex
 * @constructor
 * @example
 *      wheel = new Pivot()
 *      wheel2 = new Pivot()
 *      axis = new Pivot()
 *      wheel.add(rim).add(tire)
 *      wheel2.add(rim2).add(tire2)
 *      rear_axis.add(wheel).add(wheel2)
 */
Pivot = function () {
    Aex.call(this)
    this.group = []
}
Pivot.prototype = Object.create(Aex.prototype);
Pivot.prototype.constructor = Pivot;
/**
 * Method to add children Aex objects to
 * @method add
 * @param aex
 * @returns {Pivot}
 */
Pivot.prototype.add = function(aex){
    if(aex instanceof GameObject){
        aex = aex.aex
    }
    aex.parentMatrix = this.modelView
    aex.setModelView()
    this.group.push(aex)
    return this
}
/**
 * Sets modelview of pivot and its children items
 * @method setModelView
 * @returns {Pivot}
 */
Pivot.prototype.setModelView = function(){
    Aex.prototype.setModelView.apply(this)
    for(var a in this.group){
        var aex = this.group[a];
        aex.parentMatrix = this.modelView
        aex.setModelView()
    }
    return this
}
/**
 * Sets pivot to desired Vector in 3d space without moving the object
 * @method setPivot
 * @param v
 * @returns {Pivot}
 */
Pivot.prototype.setPivot = function(v){
    var rv = this.position.subtract(v)
    for(var a in this.group){
        var aex = this.group[a];
        aex.move(rv.x,rv.y,rv.z,1)
    }
    this.position = v
    this.setModelView()
    return this
}
/**
 * Sets pivot to center of contained objects
 * @method setPivotToCenter
 * @returns {Pivot}
 */
Pivot.prototype.setPivotToCenter = function(){
    var v = new Vector()
    var d = 0
    for(var a in this.group){
        var aex = this.group[a];
        v= v.add(aex.position)
        d+=1;
    }
    if(d>0){
        v = v.divide(d)
        this.setPivot(v)
    }
    return this
}

/**
 * @module Font
 */
/**
 * Label class creates single line text located in 3d space
 * @class Label
 * @extends GameObject
 * @constructor
 * @param scene {Scene} scene
 * @param string {String} string for single line text
 * @param font {String} font to use( Rememeber about loading fonts to document with @font-face )
 * @param size {Integer} font size
 * @example
 *     world = new Scene()
 *     score = new Label(world, "0","Helvetica", 240)
 */
Label = function (scene, string, font, size) {
    this._text = string
    this._size = size
    this._font = font
    this._color = "rgba(255,255,255,1)"
    this.generateCanvas()

    GameObject.call(this,
        scene, {
            shader: new basicShader({useDiffuse:true}),
            material: new Material({color: [1, 1, 1], diffuse: Texture.fromCanvas(this.canvas)}),
            mesh: Mesh.plane()
        })
    /**
     * @property color
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text color to red
     *     score.color = "rgb(255,0,0)"
     */
    this.__defineSetter__("color", function (val) {
        this._color = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property size
     * @type Integer
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change font size
     *     score.size = 42
     */
    this.__defineSetter__("size", function (val) {
        this._size = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property text
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text string
     *     score.text = "Hello worlds!"
     */
    this.__defineSetter__("text", function (val) {
        this._text = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property font
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text string
     *     score.font = "Helvetica"
     */
    this.__defineSetter__("font", function (val) {
        this._font = val;
        this.changeText()
        this.changeTexture()
    });
}
Label.prototype = Object.create(GameObject.prototype);
Label.prototype.constructor = Label
Label.prototype.generateCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024
    this.canvas.height = 1024
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    this.ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.changeText()
}
Label.prototype.changeText = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = this._size + "px " + this._font;
    this.ctx.fillStyle = this._color;
    this.ctx.fillText(this._text, this.canvas.width / 2, this.canvas.height / 2);
}
Label.prototype.changeTexture = function () {
    this.material.setDiffuse(Texture.fromCanvas(this.canvas))
}
/**
Javascript method of font loading
@method loadFont
@static
@param fontName {String} font name to be used later
@param url {String} url address of font
@example
    world = new Scene()
    font = Label.loadFont("medHelvetica.ttf")
    score = new Label(world, "0", 240)
*/
Label.loadFont = function (fontName, url) {
    var newStyle = document.createElement('style');
    var formatt = url.split(".")
    var format = formatt[formatt.length]
    newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: '" + fontName + "';\
    src: url('" + url + "') format(" + format + ");\
}\
\
"));
    document.head.appendChild(newStyle);
}
/**
 * @module materialLib
*/
BasicTextMaterial = function(options){
    var mat = new Material(options)
    return mat
}
/**
 * @module Resource
 */


/**
 * Resource manager for files containing static functions
 * @class Resource
 * @constructor
 */
var Resource = function(){

};
Resource.isLoading = false
Resource.queue = []
Resource.loadedElements = {}
Resource.loadNextElement=function(){
    var q = Resource.queue
    if(q.length != 0){
        var newElement = q.splice(0,1)[0]
        Resource.loadFunction(newElement[0],newElement[1])
    }else{
        Resource.isLoading = false
    }
}
Resource.loadFunction = function (path, resp) {
    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    var ext = path.split(".").pop()
    if(ext == "obj"){
        request.responseType = "arraybuffer";
    }else if(ext == "js" || ext=="json"){

    }else{
        request.responseType = "blob";
    }
    request.crossOrigin = "anonymous"
    gl.fisie = request.crossOrigin
    request.onload = function (e) {
        resp(e.target.response);
        Resource.loadedElements[path] = 1
        Resource.loadNextElement()
    };
    request.send();
}
/**
 * Loads objects and pass it to callbacks
 * @param [String] path to file
 * @param [Function] resp callback function
 */
Resource.load = function (path, resp) {
    Resource.loadedElements[path] = 0
    if(Resource.isLoading){
        Resource.queue.push([path,resp])
    }else{
        Resource.isLoading = true
        Resource.loadFunction(path,resp)
    }
}

Resource.save = function (buff, path) {
    var dataURI = "data:application/octet-stream;base64," + btoa(Resource.parse._buffToStr(buff));
    window.location.href = dataURI;
}

Resource.clone = function (o) {
    return JSON.parse(JSON.stringify(o));
}


Resource.bin = {};

Resource.bin.f = new Float32Array(1);
Resource.bin.fb = new Uint8Array(Resource.bin.f.buffer);

Resource.bin.rf = function (buff, off) {
    var f = Resource.bin.f, fb = Resource.bin.fb;
    for (var i = 0; i < 4; i++) fb[i] = buff[off + i];
    return f[0];
}
Resource.bin.rsl = function (buff, off) {
    return buff[off] | buff[off + 1] << 8;
}
Resource.bin.ril = function (buff, off) {
    return buff[off] | buff[off + 1] << 8 | buff[off + 2] << 16 | buff[off + 3] << 24;
}
Resource.bin.rASCII0 = function (buff, off) {
    var s = "";
    while (buff[off] != 0) s += String.fromCharCode(buff[off++]);
    return s;
}


Resource.bin.wf = function (buff, off, v) {
    var f = new Float32Array(buff.buffer, off, 1);
    f[0] = v;
}
Resource.bin.wsl = function (buff, off, v) {
    buff[off] = v;
    buff[off + 1] = v >> 8;
}
Resource.bin.wil = function (buff, off, v) {
    buff[off] = v;
    buff[off + 1] = v >> 8;
    buff[off + 2] = v >> 16;
    buff[off + 3] >> 24;
}
Resource.parse = {};

Resource.parse._buffToStr = function (buff) {
    var a = new Uint8Array(buff);
    var s = "";
    for (var i = 0; i < a.length; i++) s = s.concat(String.fromCharCode(a[i]));
    return s;
}

Resource.parse._strToBuff = function (str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) bufView[i] = str.charCodeAt(i);
    return buf;
}

Resource.parse._readLine = function (a, off)	// Uint8Array, offset
{
    var s = "";
    while (a[off] != 10) s += String.fromCharCode(a[off++]);
    return s;
}
Resource.parse.fromJSON = function (buff) {
    var json = JSON.parse(Resource.parse._buffToStr(buff));
    return json;
}

Resource.parse.toJSON = function (object) {
    var str = JSON.stringify(object);
    return Resource.parse._strToBuff(str);
}
function _ind(part) {
    var p = part.split("/")
    var indices = []
    for (var pp in p) {
        var ppp = p[pp]
        if (ppp) {
            indices.push(parseInt(ppp) - 1)
        } else {
            indices.push(-1)
        }
    }
    while (indices.length < 3) {
        indices.push(-1)
    }
    return indices.slice(0, 3)
}
Resource.parse.fromOBJ = function (buff,readmode) {
    groups = {}
    var cg = {from: 0, to: 0, triangles: []};
    var lastFrom = 0// current group
    var off = 0;
    var a = new Uint8Array(buff);
    var vertices = [];
    var normals = [];
    var coords = [];
    var facemode = "g"
    if(readmode){
      facemode = readmode
    }
    while (off < a.length) {
        var line = Resource.parse._readLine(a, off);
        off += line.length + 1;
        var cds = line.trim().split(" ");
        trimWhitespace(cds)
        if (cds[0] == facemode) {
            if (groups[cds[1]] == null){
                cg = { triangles: []};
                groups[cds[1]] = cg
            }else{
                cg = groups[cds[1]]
            }
        }
        if (cds[0] == "g2") {
            cg = {triangles: []};
            if (groups[cds[1]] == null) groups[cds[1]] = cg
        }
        if (cds[0] == "v") {
            var x = parseFloat(cds[1]);
            var y = parseFloat(cds[2]);
            var z = parseFloat(cds[3]);
            vertices.push([x, y, z]);
        }
        if (cds[0] == "vt") {
            var x = parseFloat(cds[1]);
            var y = 1 - parseFloat(cds[2]);
            coords.push([x, y]);
        }
        if (cds[0] == "vn") {
            var x = parseFloat(cds[1]);
            var y = parseFloat(cds[2]);
            var z = parseFloat(cds[3]);
            normals.push([x, y, z]);
        }
        if (cds[0] == "f") {
            indices = []
            for (var i = 1; i < cds.length; i++) {
                indices.push(_ind(cds[i]))
            }
            for (var i = 2; i < indices.length; i++) {
                cg.triangles.push([indices[0], indices[i - 1], indices[i]])
            }
        }
    }
    var returnGroup = {}
    for (var g in groups) {
        var currentGroup = groups[g]
        var vertexMap = {}
        var verts = []
        var uvs = []
        var norms = []
        var triangl = []
        var triangles = currentGroup.triangles
        for (var tt in triangles) {
            var abc = [0, 0, 0]
            var t = triangles[tt]
            for (var i = 0; i < 3; i++) {
                var v = t[i][0]
                var c = t[i][1]
                var n = t[i][2]
                vmap = [vertices[v], (n >= 0 && n < normals.length) ? normals[n] : [0, 0, 0], (c >= 0 && c < coords.length) ? coords[c] : [0, 0]]
                if (vmap in vertexMap) {

                } else {
                    vertexMap[vmap] = verts.length
                    verts.push(vmap[0])
                    norms.push(vmap[1])
                    uvs.push(vmap[2])
                }
                abc[i] = vertexMap[vmap]
            }
            triangl.push(abc)
        }
        returnGroup[g]={
            vertices: verts,
            coords: uvs,
            normals: norms,
            triangles: triangl
        }
    }

    return returnGroup;
}
Resource.parse.fromSTL = function(res) {
  console.log(res)
  var buffer = res;
  var vertices = [];
  var triangles = [];
  var vertexmap = {}
  var nTriBuff = buffer.slice(80, 84);
  var nTriView = new Uint32Array(nTriBuff);
  var nTri = nTriView[0];
  for (var i = 0; i < nTri; i++) {

    var triBuff = buffer.slice(84 + i * 50,
      84 + (i + 1) * 50 - 2);

    var triFloatBuff = new Float32Array(triBuff);

    var n = [triFloatBuff[0],
      triFloatBuff[1], triFloatBuff[2]
    ];
    var triangle = [];
    for (var j = 3; j < 12; j += 3) {
      var p = [triFloatBuff[j],
        triFloatBuff[j + 1], triFloatBuff[j + 2]
      ];
      if (vertexmap[p]) {} else {
        vertices.push(p)
        vertexmap[p] = vertices.length - 1
      }
      triangle.push(vertexmap[p])
    }
    triangles.push(triangle)
  }
  return [{
    "vertices": vertices,
    "triangles": triangles
  }];
};

Resource.parse.fromSTLASCI = function(res) {
  var vertices = [];
  var triangles = [];
  var state = '';
  var vertexmap = {}
  var lines = res.split('\n');
  for (var len = lines.length, i = 0; i < len; i++) {
    if (done) {
      break;
    }
    line = trim(lines[i]);
    parts = line.split(' ');
    switch (state) {
      case '':
        if (parts[0] !== 'solid') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "solid"');
          return;
        } else {
          name = parts[1];
          state = 'solid';
        }
        break;
      case 'solid':
        if (parts[0] !== 'facet' || parts[1] !== 'normal') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "facet normal"');
          return;
        } else {
          normal = [
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          ];
          state = 'facet normal';
        }
        break;
      case 'facet normal':
        if (parts[0] !== 'outer' || parts[1] !== 'loop') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "outer loop"');
          return;
        } else {
          state = 'vertex';
        }
        break;
      case 'vertex':
        if (parts[0] === 'vertex') {
          vertices.push([
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          ]);
        } else if (parts[0] === 'endloop') {
          triangles.push([vCount * 3, vCount * 3 + 1, vCount * 3 + 2]);
          vCount++;
          state = 'endloop';
        } else {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "vertex" or "endloop"');
          return;
        }
        break;
      case 'endloop':
        if (parts[0] !== 'endfacet') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "endfacet"');
          return;
        } else {
          state = 'endfacet';
        }
        break;
      case 'endfacet':
        if (parts[0] === 'endsolid') {
          done = true;
        } else if (parts[0] === 'facet' && parts[1] === 'normal') {
          normal = [
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          ];
          state = 'facet normal';
        } else {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "endsolid" or "facet normal"');
          return;
        }
        break;
      default:
        console.error('Invalid state "' + state + '"');
        break;
    }
  }
  return [{
    "vertices": vertices,
    "triangles": triangles
  }];
};
Resource.parse.from3DS = function (buff) {
    buff = new Uint8Array(buff);
    var res = {};
    if (Resource.bin.rsl(buff, 0) != 0x4d4d) return null;
    var lim = Resource.bin.ril(buff, 2);

    var off = 6;
    while (off < lim) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log(cid.toString(16), lng);

        if (cid == 0x3d3d) res.edit = Resource.parse.from3DS._edit3ds(buff, off, lng);
        if (cid == 0xb000) res.keyf = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._edit3ds = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t", cid.toString(16), lng);

        if (cid == 0x4000) {
            if (res.objects == null) res.objects = [];
            res.objects.push(Resource.parse.from3DS._edit_object(buff, off, lng));
        }
        //if(cid == 0xb000) res.KEYF3DS = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf3ds = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t", cid.toString(16), lng);

        //if(cid == 0x4000) { res.objects.push(Resource.parse.from3DS._edit_object(buff, off, lng)); }
        if (cid == 0xb002) {
            if (res.desc == null) res.desc = [];
            res.desc.push(Resource.parse.from3DS._keyf_objdes(buff, off, lng));
        }

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf_objdes = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t\t", cid.toString(16), lng);

        if (cid == 0xb010) res.hierarchy = Resource.parse.from3DS._keyf_objhierarch(buff, off, lng);
        if (cid == 0xb011) res.dummy_name = Resource.bin.rASCII0(buff, off + 6);
        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf_objhierarch = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    res.name = Resource.bin.rASCII0(buff, off);
    off += res.name.length + 1;
    res.hierarchy = Resource.bin.rsl(buff, off + 4);
    return res;
}

Resource.parse.from3DS._edit_object = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    res.name = Resource.bin.rASCII0(buff, off);
    off += res.name.length + 1;
    //console.log(res.name);
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t", cid.toString(16), lng);

        if (cid == 0x4100) res.mesh = Resource.parse.from3DS._obj_trimesh(buff, off, lng);
        //if(cid == 0xb000) res.KEYF3DS = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._obj_trimesh = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;

    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t\t", cid.toString(16), lng);

        if (cid == 0x4110) res.vertices = Resource.parse.from3DS._tri_vertexl(buff, off, lng);
        if (cid == 0x4120) res.indices = Resource.parse.from3DS._tri_facel1(buff, off, lng);
        if (cid == 0x4140) res.uvt = Resource.parse.from3DS._tri_mappingcoors(buff, off, lng);
        if (cid == 0x4160) res.local = Resource.parse.from3DS._tri_local(buff, off, lng);
        off += lng;
    }
    return res;
}

Resource.parse.from3DS._tri_vertexl = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rf(buff, off));
        res.push(Resource.bin.rf(buff, off + 4));
        res.push(Resource.bin.rf(buff, off + 8));
        off += 12;
    }
    return res;
}

Resource.parse.from3DS._tri_facel1 = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rsl(buff, off));
        res.push(Resource.bin.rsl(buff, off + 2));
        res.push(Resource.bin.rsl(buff, off + 4));
        off += 8;
    }
    return res;
}

Resource.parse.from3DS._tri_mappingcoors = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rf(buff, off));
        res.push(1 - Resource.bin.rf(buff, off + 4));
        off += 8;
    }
    return res;
}

Resource.parse.from3DS._tri_local = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    res.X = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.Y = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.Z = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.C = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    return res;
}
