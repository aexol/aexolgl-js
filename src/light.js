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
