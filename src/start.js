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
