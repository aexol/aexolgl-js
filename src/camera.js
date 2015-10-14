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
	this.uniforms._cameraPosition = this.position.toArray()
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
