/**
 * @module Font
 */
/**
 * Label class creates single line text located in 3d space
 * @class Label
 * @extends GameObject
 * @constructor
 * @param scene {Scene} scene
 * @param string {String} string for single line text
 * @param font {String} font to use( Rememeber about loading fonts to document with @font-face )
 * @param size {Integer} font size
 * @example
 *     world = new Scene()
 *     score = new Label(world, "0","Helvetica", 240)
 */
Label = function (scene, string, font, size) {
    this._text = string
    this._size = size
    this._font = font
    this._color = "rgba(255,255,255,1)"
    this.generateCanvas()

    GameObject.call(this,
        scene, {
            shader: new basicShader({useDiffuse:true}),
            material: new Material({color: [1, 1, 1], diffuse: Texture.fromCanvas(this.canvas)}),
            mesh: Mesh.plane()
        })
    /**
     * @property color
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text color to red
     *     score.color = "rgb(255,0,0)"
     */
    this.__defineSetter__("color", function (val) {
        this._color = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property size
     * @type Integer
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change font size
     *     score.size = 42
     */
    this.__defineSetter__("size", function (val) {
        this._size = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property text
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text string
     *     score.text = "Hello worlds!"
     */
    this.__defineSetter__("text", function (val) {
        this._text = val;
        this.changeText()
        this.changeTexture()
    });
    /**
     * @property font
     * @type String
     * @example
     *     world = new Scene()
     *     score = new Label(world, "0","monospace", 240)
     *     //change text string
     *     score.font = "Helvetica"
     */
    this.__defineSetter__("font", function (val) {
        this._font = val;
        this.changeText()
        this.changeTexture()
    });
}
Label.prototype = Object.create(GameObject.prototype);
Label.prototype.constructor = Label
Label.prototype.generateCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024
    this.canvas.height = 1024
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    this.ctx.textBaseline = "middle";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.changeText()
}
Label.prototype.changeText = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = this._size + "px " + this._font;
    this.ctx.fillStyle = this._color;
    this.ctx.fillText(this._text, this.canvas.width / 2, this.canvas.height / 2);
}
Label.prototype.changeTexture = function () {
    this.material.setDiffuse(Texture.fromCanvas(this.canvas))
}
/**
Javascript method of font loading
@method loadFont
@static
@param fontName {String} font name to be used later
@param url {String} url address of font
@example
    world = new Scene()
    font = Label.loadFont("medHelvetica.ttf")
    score = new Label(world, "0", 240)
*/
Label.loadFont = function (fontName, url) {
    var newStyle = document.createElement('style');
    var formatt = url.split(".")
    var format = formatt[formatt.length]
    newStyle.appendChild(document.createTextNode("\
@font-face {\
    font-family: '" + fontName + "';\
    src: url('" + url + "') format(" + format + ");\
}\
\
"));
    document.head.appendChild(newStyle);
}