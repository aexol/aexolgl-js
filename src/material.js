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