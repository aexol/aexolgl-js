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
    m = m.multiply(Matrix.translate(this.position.x, this.position.y, this.position.z));
    m = m.multiply(Matrix.rotate(this.rotation.x, 1, 0, 0));
    m = m.multiply(Matrix.rotate(this.rotation.y, 0, 1, 0));
    m = m.multiply(Matrix.rotate(this.rotation.z, 0, 0, 1));
    m = m.multiply(Matrix.scale(this.size.x, this.size.y, this.size.z));
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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