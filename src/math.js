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
