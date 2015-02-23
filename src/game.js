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
