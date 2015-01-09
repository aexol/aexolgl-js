/**
 * aexolGL class
 * @class aexolGL
 * @constructor
 * @param {Dict} options Options
 */
aexolGL = function (options) {
    var defaults = {
        clearColor: [0.2, 0.2, 0.21, 1.0]
    };

    this.settings = {};

    this.programInfo = null;
    this.prefix = "aexol_";

    /* GL overloads */
    var ENUM = 0x12340000;
    gl.MODELVIEW = ENUM | 1;
    gl.PROJECTION = ENUM | 2;
    gl.modelviewMatrix = new Matrix();
    gl.projectionMatrix = new Matrix();
    gl.uniformsSet = {}
    gl.frustum = new Frustum()
    gl.gpuNormal = true;
    gl.GLT = ""
    gl.GLTD = ""
    gl.angle = 45
    gl.pause = false;
    this.matrix = null;
    gl.matrixMode = function (mode) {
        switch (mode) {
            case gl.MODELVIEW:
                this.matrix = 'modelviewMatrix';
                break;
            case gl.PROJECTION:
                this.matrix = 'projectionMatrix';
                break;
            default:
                __error('invalid matrix mode ' + mode);
        }
    };
    gl.loadIdentity = function () {
        gl[this.matrix].m = new Matrix().m;
    };
    gl.loadMatrix = function (m) {
        gl[this.matrix].m = m.m.slice();
    };
    gl.multMatrix = function (m) {
        gl[this.matrix].m = gl[this.matrix].multiply(m).m;
    };
    gl.perspective = function (fov, aspect, near, far) {
        var pM = Matrix.perspective(fov, aspect, near, far)
        gl.multMatrix(pM);
    };
    gl.ortho = function (l, r, b, t, n, f) {
        gl.multMatrix(Matrix.ortho(l, r, b, t, n, f));
    };
    gl.scale = function (x, y, z) {
        gl.multMatrix(Matrix.scale(x, y, z));
    };
    gl.translate = function (x, y, z) {
        gl.multMatrix(Matrix.translate(x, y, z));
    };
    gl.rotate = function (a, x, y, z) {
        gl.multMatrix(Matrix.rotate(a, x, y, z));
    };
    gl.setMatrix = function (m) {
        gl[this.matrix] = m
    }
    gl.lookAt = function (ex, ey, ez, cx, cy, cz, ux, uy, uz) {
        gl.multMatrix(Matrix.lookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz));
    };
    gl.project = function (objX, objY, objZ, modelview, projection, viewport) {
        modelview = modelview || gl.modelviewMatrix;
        projection = projection || gl.projectionMatrix;
        viewport = viewport || gl.getParameter(gl.VIEWPORT);
        var point = projection.transformPoint(modelview.transformPoint(new Vector(objX, objY, objZ)));
        return new Vector(viewport[0] + viewport[2] * (point.x * 0.5 + 0.5), viewport[1] + viewport[3] * (point.y * 0.5 + 0.5), point.z * 0.5 + 0.5);
    };
    gl.unProject = function (winX, winY, winZ, modelview, projection, viewport) {
        modelview = modelview || gl.modelviewMatrix;
        projection = projection || gl.projectionMatrix;
        viewport = viewport || gl.getParameter(gl.VIEWPORT);
        var point = new Vector(( winX - viewport[0]) / viewport[2] * 2 - 1, ( winY - viewport[1]) / viewport[3] * 2 - 1, winZ * 2 - 1);
        return projection.multiply(modelview).inverse().transformPoint(point);
    };
    gl.matrixMode(gl.MODELVIEW);
    gl.eventListener = null;
    gl.activeMeshes = [];
    gl.ZBuffer = null;
    gl.lights = [];
    gl.aexScene = [];
    gl.nTexture = 0;
    gl.cbTexture = 0;
    gl.nShader = 1

    gl.loadedElements = {}
    gl.progress = 0.0

    gl.MAX_NUMBER_OF_TEXTURES = 8;
    gl.texture2DStack = new Array(gl.MAX_NUMBER_OF_TEXTURES);
    gl.texture2DLast = -1;
    gl.textureCubeStack = new Array(gl.MAX_NUMBER_OF_TEXTURES);
    gl.textureCubeLast = -1;

    gl.lTexture = 1;
    gl.frame = 0;
    gl.mD = 0;
    gl.castRay = function (x, y, z, angle) {
        if (gl.canvas.width > gl.canvas.height) {
            var angleX = angle * (gl.canvas.width / gl.canvas.height);
            var angleY = angle;
        } else {
            var angleY = angle * (gl.canvas.height / gl.canvas.width);
            var angleX = angle;
        }
        var anglX = Math.tan(((gl.canvas.width / 2.0 - x) / (gl.canvas.width / 2.0)) * ((angleX / 2.0) / 180.0) * Math.PI) * z;
        var anglY = Math.tan(((gl.canvas.height / 2.0 - y) / (gl.canvas.height / 2.0)) * ((angleY / 2.0) / 180.0) * Math.PI) * z;
        return new Vector(anglX, anglY, z)
    };
    /* End of GL overloads */
    var __error = function (text) {
        if (window.handleError)
            window.handleError(text);
        throw text;
    }
}
/**
 * Inits the framebuffer
 * @method initGL
 */
aexolGL.prototype.initGL = function () {
    gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
/**
 * Start the engine
 * @method init
 */
aexolGL.prototype.init = function () {
    var t = this
    this.initDefaultPreloader()
    function checkIfElementsAreLoaded() {
        var le = Resource.loadedElements
        var allLoaded = Object.keys(le).length
        if (allLoaded == 0) {
            t.defaultPreload((percentage * 100).toFixed(2));
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
aexolGL.prototype.executeInit = function () {
    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

    }

    if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function (callback, element) {

            var currTime = Date.now(), timeToCall = Math.max(0, 16 - ( currTime - lastTime ));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;

        };

    }


    if (!window.cancelAnimationFrame) {

        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };

    }
    var draw = function () {
        gl.viewport(0, 0, 800, 800);
    }
    gl.enable(gl.DEPTH_TEST);
    if (window.renderMaps) {
        window.renderMaps()
    }
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
aexolGL.prototype.initDefaultPreloader = function () {
    if (!window.progress) {
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
aexolGL.prototype.defaultPreload = function (e) {
    if (!window.progress) {
        this.progresstext.innerHTML = "aexolgl is<br>loading " + e + "%"
        if (e == 100) {
            this.progresstext.remove()
        }
    } else {
        window.progress(e)
    }
}
