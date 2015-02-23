/**
@module start
*/
function getImage(img){
	BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/path/to/image.png', true);
	xhr.responseType = 'arraybuffer';
	
	xhr.onload = function(e) {
	  if (this.status == 200) {
	    var bb = new BlobBuilder();
	    bb.append(this.response);
	    var blob = bb.getBlob('image/jpg');
	  }
	};
	xhr.send();
}
/**
Starts webgl
@method glStart()
@static
*/
function glStart(setupFunction){
//	function init() {
//	  // quit if this function has already been called
//	  if (arguments.callee.done) return;
//
//	  // flag this function so we don't do the same thing twice
//	  arguments.callee.done = true;
//
//	  // kill the timer
//	  if (_timer) clearInterval(_timer);
//	  setupFunction();
//	};
//
//	/* for Mozilla/Opera9 */
//	if (document.addEventListener) {
//	  document.addEventListener("DOMContentLoaded", init, false);
//	}
//
//	/* for Safari */
//	if (/WebKit/i.test(navigator.userAgent)) { // sniff
//	  var _timer = setInterval(function() {
//	    if (/loaded|complete/.test(document.readyState)) {
//	      init(); // call the onload handler
//	    }
//	  }, 10);
//	}
//
//	/* for other browsers */
//	window.onload = init;
    setupFunction();
    var canvasFittedToScreen = false
    if (gl.canvas.width == window.innerWidth && gl.canvas.height == window.innerHeight){
        canvasFittedToScreen = true
    }
    window.onresize = function(event) {
        gl.canvas.width = window.innerWidth
        gl.canvas.height = window.innerHeight
        canvasInit()
    };
}
