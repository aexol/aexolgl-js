function regexMap(regex, text, callback) {
    while ((result = regex.exec(text)) != null) {
        callback(result);
    }
}
// Insert the header after any extensions, since those must come first.
function fix(header, source) {
    var match = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(source);
    source = match ? match[1] + header + source.substr(match[1].length) : header + source;
    regexMap(/\bgl_\w+\b/g, header, function(result) {
        source = source.replace(new RegExp(result, 'g'), '_' + result);
    });
    return source;
}

/**
  * Shader class
  * @class Shader
  * @constructor
  * @param {String} vertexSource Source of vertex shader
  * @param {String} fragmentSource Source of fragment shader
  * @param {String} addons additional attributes
*/
shframe= -1
Shader = function(vertexSource,fragmentSource,noBuild) {
	MObject.call(this)
	this.cp = -1.0;
    this.uniformsSet = {}
    this.construct = {
                        "varying":[],
                        "uniforms":[],
                        "structs":{},
                        "mainFragment":fragmentSource,
                        "mainVertex":vertexSource
                    }
	this.header = 'uniform mat4 gl_ModelViewMatrix;uniform mat4 gl_ProjectionMatrix;uniform mat4 gl_ModelViewProjectionMatrix;uniform mat3 NormalMatrix;';
    this.vertexHeader = 'precision highp float; attribute vec3 Vertex;attribute vec2 TexCoord;attribute vec3 Normal;' + this.header;
	this.fragmentHeader = 'precision highp float;' + this.header;
    if(noBuild){

    }else{
        this._build();
    }
};
Shader.prototype =  Object.create(MObject.prototype);
Shader.prototype.constructor = Shader
Shader.prototype.addUniform = function(type,name){
    this.construct.uniforms.push([type,name])
}
Shader.prototype.addVarying = function(type,name){
    this.construct.varying.push([type,name])
}
Shader.prototype.addStruct = function(name,struct){
    this.construct.structs[name] = [];
    if(struct){
        this.construct.structs[name] = struct
    }
}
Shader.prototype.addToStruct = function(structName,type,name){
    this.construct.structs[structName].push([type,name])
}
Shader.prototype.addVertexSource = function(source){
    this.construct.mainVertex = source
}
Shader.prototype.addFragmentSource = function(source){
    this.construct.mainFragment = source
}
Shader.prototype.reconstruct = function(){
    this.vertexLines = "";
    this.fragmentLines = "";
    for(var v in this.construct.varying){
        var vv = this.construct.varying[v]
        var line = "varying "+vv[0]+" "+vv[1]+";\n"
        this.vertexLines += line;
        this.fragmentLines += line
    }
    for(var st in this.construct.structs){
        var ss = this.construct.structs[st]
        var line = "struct "+st+"{\n"
        for(var svalue in ss){
            var ll = ss[svalue]
            line += "\t"+ll[0]+" "+ll[1]+";\n"
        }
        line += "};\n"
        this.fragmentLines += line
        this.vertexLines += line
    }
    for(var u in this.construct.uniforms){
        var uu = this.construct.uniforms[u]
        var line = "uniform "+uu[0]+" "+uu[1]+";\n"
        this.fragmentLines += line
        this.vertexLines += line
    }
    this.vertexLines += this.construct.mainVertex
    this.fragmentLines += this.construct.mainFragment
}
Shader.prototype._build = function(){
    this.reconstruct()
	var vertexSource = fix(this.vertexHeader, this.vertexLines);
    var fragmentSource = fix(this.fragmentHeader, this.fragmentLines);
    function compileSource(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('compile error: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    this.program = gl.createProgram();
    gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
    gl.bindAttribLocation(this.program,0,"Vertex")
    gl.bindAttribLocation(this.program,1,"Normal")
    gl.bindAttribLocation(this.program,2,"TexCoord")
    gl.enableVertexAttribArray(0);
	gl.enableVertexAttribArray(1);
	gl.enableVertexAttribArray(2);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        gl.extradatae = ('link error: ' + gl.getProgramInfoLog(this.program));
    }
    this.attributes = {};
    this.uniformLocations ={};
    var isSampler = {};
    regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, vertexSource + fragmentSource, function(groups) {
        isSampler[groups[2]] = 1;
    });
    this.isSampler = isSampler;
    this.needsMVP = (vertexSource + fragmentSource).indexOf('gl_ModelViewProjectionMatrix') != -1;
}
var isArray = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

var isNumber = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Number]';
}
Shader.prototype._checkUniforms = function(value,location,name,lname){
		if( value instanceof Vector) {
			value = [value.x, value.y, value.z];
		} else if( value instanceof Matrix) {
			value = value.m;
		}
		var checkname = lname
		if( compare(this.uniformsSet[checkname], value) ){
			return
		}else{
			this.uniformsSet[checkname] = value
		}
		if(isArray(value)) {
		
			switch (value.length) {
				case 1:
					gl.uniform1fv(location, new Float32Array(value));
					break;
				case 2:
					gl.uniform2fv(location, new Float32Array(value));
					break;
				case 3:
					gl.uniform3fv(location, new Float32Array(value));
					break;
				case 4:
					gl.uniform4fv(location, new Float32Array(value));
					break;
				// Matrices are automatically transposed, since WebGL uses column-major
				// indices instead of row-major indices.
				case 9:
					gl.uniformMatrix3fv(location, false, new Float32Array([value[0], value[3], value[6], value[1], value[4], value[7], value[2], value[5], value[8]]));
					break;
				case 16:
					gl.uniformMatrix4fv(location, false, new Float32Array([value[0], value[4], value[8], value[12], value[1], value[5], value[9], value[13], value[2], value[6], value[10], value[14], value[3], value[7], value[11], value[15]]));
					break;
				default:
					__error('don\'t know how to load uniform "' + name + '" of length ' + value.length);
			}
		} else if(isNumber(value)) {
			(this.isSampler[name] ? gl.uniform1i : gl.uniform1f).call(gl, location, value);
		} else if(typeof(value) == "boolean"){
			gl.uniform1i(location,(value == true?1:0))
		} else {
			if(value == null){
			}
			else{
			console.log(name,value==null)
			__error('attempted to set uniform "' + name + '" to invalid value ' + value);
			}
		}
}
Shader.prototype.useProgram = function(){
        gl.useProgram(this.program);
	    gl.currentShader = this
	    gl.currentProgram = this.program
} 
/**
* Set shader uniforms
* @method uniforms
* @param {Dict} uniforms Dictionary of uniforms of shader
*/
Shader.prototype.uniforms = function(uniforms) {
	for(var name in uniforms) {
		var value = uniforms[name];
		if(value instanceof Object && !isArray(value) && !(value instanceof Matrix) && !(arr instanceof Vector)){
		    var id = value["id"]?value["id"]:""
			this.uniformLocations[name] = this.uniformLocations[name] || {}
			for( us in value){
                if(us=="id"){
                    continue
                }
				var location = this.uniformLocations[name][us] || gl.getUniformLocation(this.program, name+'.'+us);
				if(!location){
					this.uniformsSet[name+us] = value[us]
                    continue;
                }
				this.uniformLocations[name][us] = location;
				var val = value[us]
				this._checkUniforms(val,location,name,name+us)
			}
		}
		else if(isArray(value) &&( (value[0] instanceof Object) ||  (isArray(value[0])) ) ){
			for(var i=0;i<value.length;i++){
				var arr = value[i];
				if(arr instanceof Object && !isArray(arr) && !(arr instanceof Matrix) && !(arr instanceof Vector)){
					this.uniformLocations[name] = this.uniformLocations[name] || []
					for( us in arr){
						this.uniformLocations[name][i] = this.uniformLocations[name][i] || {}
						var location = this.uniformLocations[name][i][us] || gl.getUniformLocation(this.program, name+'['+i+']'+'.'+us);
						if(!location)
							continue;
						this.uniformLocations[name][us] = location;
						var val = arr[us]
						this._checkUniforms(val,location,name,name+us+i)
					}
				}else{
					this.uniformLocations[name] = this.uniformLocations[name] || []
					var location = this.uniformLocations[name][i] || gl.getUniformLocation(this.program, name+'['+i+']');
					if(!location)
						continue;
					this.uniformLocations[name][i] = location;
					this._checkUniforms(value,location,name,name+i)
				}
			}
		}
		else{
			var location = this.uniformLocations[name] || gl.getUniformLocation(this.program, name);
			if(!location)
				continue;
			this.uniformLocations[name] = location;
			this._checkUniforms(value,location,name,name)
		}
	}

	return this;
};
/** 
* Draw with this shader
* @method draw
*/
Shader.prototype.draw = function(uniforms) {
    this.useProgram()
    var dic = uniforms ||{};
    this.uniforms(dic);
    this.uniformsSet = {}
    for( var child in this.children ){
    	this.children[child].draw()
    }
};

function loadFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}

function loadFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
}
/** 
* Loads shader from .fs files
* @method fromFile
* @param {String} vertexUrl
* @param {String} fragmentUrl
*/

Shader.fromFile = function(vertexUrl,fragmentUrl,callback){
	var shader
	loadFiles([vertexUrl, fragmentUrl], function (shaderText) {
		shader = new Shader(shaderText[0],shaderText[1])
		callback(shader)
	}, function (url) {
		console.log('Failed to download "' + url + '"');
	});
}