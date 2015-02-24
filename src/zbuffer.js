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
