/**
 * @module camera
 */
/**
  * Camera class
  * @class Camera
  * @constructor
  * @param {int} editorCam if other than 0 makes Camera react only when mouse buttons are pressed
  * @param {float} [near] near Plane
  * @param {float} [far] far Plane
  * @param {float} [angle] angle of perspective camera
  * @example
  *     world = new Scene()
  *     camera = new Camera()
  *     camera.position = new Vector(0.1, -1, -10);
*/
Camera = function(editorCam,near,far,angle) {
	this.position = new Vector(0, 0, 0);
    this.positionBefore = new Vector();
	this.rotation = new Vector(0, 0, 0);
	this.forwardStep = 0.0
	this.sideStep = 0.0
	this.upStep = 0.0
	this.factor = 0.09;
	 this.forwardReduce = 1.0
	this.name = "camera";
	this.sensitivity = 0.5;
	this.yawStep = 0.0;
	this.pitchStep = 0.0;
	this.mesh = null;
	this.background = null;
	this.tempX = null;
	this.tempY = null;
    this.near = near || 0.1;
    this.far = far || 100.0;
    this.angle = angle || 45.0
	this.eC = editorCam || 0;
	this.setDisplay()
    this.setProjectionMatrix()
    this.uniforms = {
        _gl_ProjectionMatrix:this.projectionMatrix,
        cameraNear:this.near,
        cameraFar:this.far
    }

}
Camera.prototype.setProjectionMatrix = function(){
    this.projectionMatrix = Matrix.perspective(this.angle, gl.canvas.width / gl.canvas.height, this.near, this.far)
}
/** 
* Set table with screen dimensions and coordinates for 2D games
* @method setDisplay
*/
Camera.prototype.setDisplay = function() {
	var display = []
    display.height = Math.abs( 2 * this.position.z * Math.tan( (gl.angle * ( Math.PI/180))/2 ) )
    display.width = Math.abs( display.height * (document.getElementById("agl").width/document.getElementById("agl").height) )
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
/**
* Move camera forward & backward
* @method forward
* @param {float} f distance to move
*/
Camera.prototype.forward = function(f) {
	if(f == 0.0){ return true }
	var fac = -f;
	yRad = this.rotation.y * (Math.PI / 180.0);
	xRad = this.rotation.x * (Math.PI / 180.0);
	yChange = fac * Math.sin(xRad);
	zChange = fac * Math.cos(yRad) * Math.cos(xRad);
	xChange = -fac * Math.sin(yRad);
	this.position.y += yChange;
	this.position.z += zChange;
	this.position.x += xChange;
}

/** 
* Move camera left & right
* @method side
* @param {float} f distance to move
*/
Camera.prototype.side = function(f) {
	if(f == 0.0){ return true }
	var fac = -f;
	yRad = this.rotation.y * (Math.PI / 180.0);
	zRad = this.rotation.z * (Math.PI / 180.0);
	yChange = fac * Math.sin(zRad);
	zChange = fac * Math.sin(yRad);
	xChange = fac * Math.cos(yRad) * Math.cos(zRad);
	this.position.y += yChange;
	this.position.z += zChange;
	this.position.x += xChange;
}
/** 
* Move camera up & down
* @method updown
* @param {float} f distance to move
*/
Camera.prototype.updown = function(f) {
	if(f == 0.0){ return true }
	var fac = f;
	this.position.y += fac;
    this.bounds()
}
/** 
* Rotate on local x axis
* @method pitch
* @param {float} change rotation
*/
Camera.prototype.pitch = function(change) {
	this.rotation.x += this.sensitivity * change;
}
/** 
* Rotate on local y axis
* @method pitch
* @param {float} change rotation
*/
Camera.prototype.yaw = function(change) {
	this.rotation.y += this.sensitivity * change;
}
/** 
* Rotate on local z axis
* @method roll
* @param {float} change rotation
*/
Camera.prototype.roll = function(change) {
	this.rotation.z += this.sensitivity * change;
}
/** 
* this method is called as the first method in scene draw call transforming the gl.projectionMatrix
* @method transforms
*/
Camera.prototype.transforms = function(){
    this.positionBefore= this.position
	this.yaw(this.yawStep)
	this.pitch(this.pitchStep)
	this.forward(this.forwardStep)
	this.forwardStep *= this.forwardReduce
	this.side(this.sideStep)
	this.updown(this.upStep)
	this.yawStep *= 0.78
	this.pitchStep *= 0.78
	var m = this.projectionMatrix
    var r = this.rotation
    m = m.rotateVector(r.x, r.y, r.z);
    m = m.multiply(Matrix.translate(-this.position.x, -this.position.y, -this.position.z));
    this.uniforms._gl_ProjectionMatrix = m.m
    gl.frustum.fromPerspectiveMatrix(m)
}
Camera.prototype.setBounds = function(b){
        this.bnds = b
}
Camera.prototype.bounds = function(){
        var BOUNDS = this.bnds
        if(BOUNDS){
            if (this.position.x > BOUNDS.max.x){
                this.position = this.positionBefore
            }
            else if (this.position.x < BOUNDS.min.x){
                this.position = this.positionBefore
            }
            else if (this.position.y > BOUNDS.max.y){
                this.position = this.positionBefore
            }
            else if (this.position.y < BOUNDS.min.y){
                this.position = this.positionBefore
            }
            else if (this.position.z > BOUNDS.max.z){
                this.position = this.positionBefore
            }
            else if (this.position.z < BOUNDS.min.z){
                this.position = this.positionBefore
            }
        }
}
/** 
* Turn on standard camera mouse and WSAD operating
* @method on
*/
Camera.prototype.on = function(factor) {
	var t = this;
	t.md = 0;
    t.factor = factor || t.factor;
	var fac = t.factor;
	var sen = t.sensitivity;
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