var gl
/**
 * aexolGL class
 * @class aexolGL
 * @constructor
 * @param {Dict} options Options
 */
aexolGL = function(options) {
    this.settings = {}
    gl.projectionMatrix = new Matrix();
    gl.uniformsSet = {}
    gl.frustum = new Frustum()
    gl.angle = 45
    gl.pause = false;
    this.matrix = null;

    gl.nTexture = 0;
    gl.cbTexture = 0;
    gl.nShader = 1

    gl.loadedElements = {}
    gl.progress = 0.0

    gl.MAX_NUMBER_OF_TEXTURES = 8;

    gl.frame = 0;
    /* End of GL overloads */
    var __error = function(text) {
      if (window.handleError)
        window.handleError(text);
      throw text;
    }
  }
  /**
   * Inits the framebuffer
   * @method initGL
   */
aexolGL.prototype.initGL = function() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  /**
   * Start the engine
   * @method init
   */
aexolGL.prototype.init = function() {
  var t = this
  this.initDefaultPreloader()

  function checkIfElementsAreLoaded() {
    var le = Resource.loadedElements
    var allLoaded = Object.keys(le).length
    if (allLoaded == 0) {
      t.defaultPreload(100);
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
aexolGL.prototype.initV2 = function() {
  var t = this
  this.initDefaultPreloader()

  function checkIfElementsAreLoaded() {
    var le = Resource.loadedElements
    var allLoaded = Object.keys(le).length
    if (allLoaded == 0) {
      t.defaultPreload(100);
      t.executeInitV2()
    } else {
      var ready = 0
      for (var l in le) {
        ready += le[l]
      }
      var percentage = ready / allLoaded
      if (percentage == 1.0) {
        t.defaultPreload((percentage * 100).toFixed(2));
        t.executeInitV2()
      } else {
        t.defaultPreload((percentage * 100).toFixed(2));
        setTimeout(checkIfElementsAreLoaded, 10)
      }
    }
  }

  setTimeout(checkIfElementsAreLoaded, 10)
}
AexolGL = function(canvasId, options) {
  var lastTime = 0;
  gl = setGL(canvasId)
  agl = new aexolGL()
  agl.settings = {
    setup: function() {

    },
    logic: function() {

    },
    draw: function() {

    },
  };
  for (var o in options) {
    if (agl.settings.hasOwnProperty(o)) {
      agl.settings[o] = options[o]
    }
  }
  agl.settings.setup()
  agl.initGL()
  agl.initV2()
  return agl
}
aexolGL.prototype.executeInitV2 = function() {
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var that = this
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = Date.now(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
  gl.enable(gl.DEPTH_TEST);
  if (that.animframe) {
    window.cancelAnimationFrame(that.animframe);
  }
  (function animloop() {
    if (gl.pause == false) {
      that.settings.logic()
      that.settings.draw();
      gl.frame += 1;
    }
    that.animframe = window.requestAnimationFrame(animloop, gl.canvas);
  })();
}
aexolGL.prototype.executeInit = function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];

  }

  if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = function(callback, element) {

      var currTime = Date.now(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;

    };

  }


  if (!window.cancelAnimationFrame) {

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

  }
  var draw = function() {
    gl.viewport(0, 0, 800, 800);
  }
  gl.enable(gl.DEPTH_TEST);
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
aexolGL.prototype.initDefaultPreloader = function() {
  if (!window.progress && !this.settings.progress) {
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
aexolGL.prototype.defaultPreload = function(e) {
  if (!this.settings.progress) {
    this.progresstext.innerHTML = "aexolgl is<br>loading " + e + "%"
    if (e == 100) {
      this.progresstext.remove()
    }
  } else {
    if(!window.progress){
      this.settings.progress(e)
    }
    else{
      window.progress
    }
  }
}
