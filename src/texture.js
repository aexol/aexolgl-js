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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.filter || options.minFilter || gl.LINEAR_MIPMAP_LINEAR);
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
        texture.image.src = src;
        texture.image.onload = function () {
            texture.image = this
            texture.complete = 1
        }
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
