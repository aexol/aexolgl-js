/**
 @module Mesh
 */
/**
 * Mesh class contains buffers for 3d objects
 * @class Mesh
 * @extends MObject
 * @constructor
 * @param [options={}] {Dict} Dictionary of options when creating Aex object<br>
 * @return {Mesh} Returns Mesh Object
 * @example
 *     //Draw a simple triangle
 *     var mesh = new Mesh()
 *     mesh.vertices = [[0,0,0],[1,1,0],[0,0,-1]]
 *     mesh.coords = [[0.0,0.0],[1.0,1.0],[0.0,0.0]]
 *     mesh.traingles = [[0,1,2]]
 *     mesh.computeNormals()
 *     mesh.compile()
 */
Mesh = function (options) {
    MObject.call(this)
    options = options || {};
    this.transformationStack = [];
    this.vertexBuffers = {};
    this.indexBuffers = {};
    this.cameraCoords = [];
    this._init = false
    this.position = new Vector(0.0, 0.0, 0.0);
    this.size = new Vector(1.0, 1.0, 1.0);
    this.tweakers = {};
    this.undoStack = [];
    this.attributes = [];
    this.scaledUV = 1.0;
    mLs = [];
    this.addVertexBuffer('vertices', 'Vertex');
    if (!('coords' in options) || options.coords)
        this.addVertexBuffer('coords', 'TexCoord');
    if (!('normals' in options) || options.normals)
        this.addVertexBuffer('normals', 'Normal');
    this.locations = {'Vertex': 0, 'Normal': 1, 'TexCoord': 2}
    this.addIndexBuffer('triangles');
    this.addIndexBuffer('lines');
    return this
};
Mesh.prototype = Object.create(MObject.prototype);
Mesh.prototype.constructor = Mesh
/**
 * Drawes a Mesh
 * @method draw
 * @param {String} name Name of buffer
 * @param {String} attribute gl name
 */
Mesh.prototype.draw = function (uniforms) {
    var mode = gl.TRIANGLES
    for (var attribute in this.vertexBuffers) {
        var buffer = this.vertexBuffers[attribute];
        var location = this.locations[attribute];
        if (this.vertexBuffers[attribute].buffer == null)
            continue;
        this.attributes[attribute] = location;
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
        gl.vertexAttribPointer(location, buffer.buffer.spacing, gl.FLOAT, false, 0, 0);
    }
    for (var attribute in this.attributes) {
        if (!( attribute in this.vertexBuffers)) {
            gl.disableVertexAttribArray(this.attributes[attribute]);
        }
    }
    // Disable unused attribute pointers.
    gl.indexBuffers = this.indexBuffers
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.indexBuffers.triangles.buffer);
    for (var child in this.children) {
        this.children[child].draw(uniforms)
    }
};
/**
 * Creates a vertex Buffer
 * for example:
 * this.addVertexBuffer('normals', 'gl_Normal');
 * @method addVertexBuffer
 * @param {String} name Name of buffer
 * @param {String} attribute gl name
 */
Mesh.prototype.addVertexBuffer = function (name, attribute) {
    var buffer = this.vertexBuffers[attribute] = new Buffer(gl.ARRAY_BUFFER, Float32Array);
    buffer.name = name;
    this[name] = [];
};
/**
 * Creates a index Buffer
 * for example:
 * this.addIndexBuffer('triangles');
 * @method addIndexBuffer
 * @param {String} name Name of buffer
 */
Mesh.prototype.addIndexBuffer = function (name) {
    var buffer = this.indexBuffers[name] = new Buffer(gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
    this[name] = [];
};
/**
 * Recompile the mesh ( for example: if vertices were edited )
 * @method compile
 */
Mesh.prototype.compile = function () {
    for (var attribute in this.vertexBuffers) {
        var buffer = this.vertexBuffers[attribute];
        buffer.data = this[buffer.name];
        buffer.compile();
    }

    for (var name in this.indexBuffers) {
        var buffer = this.indexBuffers[name];
        buffer.data = this[name];
        buffer.compile();
    }

    this.aabb = this.getAABB()
    this.sphere = this.getBoundingSphere(this.aabb);
};
/**
 * Transform the mesh with matrix
 * @method transform
 * @param {Matrix} matV Transformation matrix
 */
Mesh.prototype.transform = function (matV, r) {

    for (var vert in this.vertices) {
        this.setVertex(vert, matV.transformPoint(this.vertices[vert]).toArray());
    }
    if (this.normals) {
        var invTrans = matV.inverse().transpose();
        this.normals = this.normals.map(function (n) {
            return invTrans.transformVector(Vector.fromArray(n)).unit().toArray();
        });
    }
    this.compile();
    return this;
}
Mesh.prototype._transform = function (matV, r) {

    for (var vert in this.vertices) {
        this.setVertex(vert, matV.transformPoint(this.vertices[vert]).toArray());
    }
    if (this.normals) {
        var invTrans = matV.inverse().transpose();
        this.normals = this.normals.map(function (n) {
            return invTrans.transformVector(Vector.fromArray(n)).unit().toArray();
        });
    }
    return this;
}
/**
 * Moves mesh
 * @method move
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.move = function (x, y, z) {
    return this.transform(Matrix.translate(x, y, z), 1)
}
/**
 * Rotates mesh
 * @method rotate
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.rotate = function (x, y, z) {
    var m = this.transform(Matrix.rotate(x, 1, 0, 0), 1)
    m = m.transform(Matrix.rotate(y, 0, 1, 0), 1)
    m = m.transform(Matrix.rotate(z, 0, 0, 1), 1)
    return m
}
/**
 * Scales mesh
 * @method scale
 * @param {float} x
 * @param {float} y
 * @param {float} z
 */
Mesh.prototype.scale = function (x, y, z) {
    return this.transform(Matrix.scale(x, y, z), 1)
}
/**
 * Scales uniformly mesh
 * @method scaleUniform
 * @param {float} f
 */
Mesh.prototype.scaleUniform = function (f) {
    return this.transform(Matrix.scale(f, f, f), 1)
}
/**
 * Recompute normals
 * @method computeNormals
 */
Mesh.prototype.computeNormals = function () {
    if (!this.normals)
        this.addVertexBuffer('normals', 'Normal');
    for (var i = 0; i < this.vertices.length; i++) {
        this.normals[i] = new Vector();
    }
    for (var i = 0; i < this.triangles.length; i++) {
        var t = this.triangles[i];
        var a = Vector.fromArray(this.vertices[t[0]]);
        var b = Vector.fromArray(this.vertices[t[1]]);
        var c = Vector.fromArray(this.vertices[t[2]]);
        var normal = b.subtract(a).cross(c.subtract(a)).unit();
        this.normals[t[0]] = this.normals[t[0]].add(normal);
        this.normals[t[1]] = this.normals[t[1]].add(normal);
        this.normals[t[2]] = this.normals[t[2]].add(normal);
    }
    for (var i = 0; i < this.vertices.length; i++) {
        this.normals[i] = this.normals[i].unit().toArray();
    }
    this.compile();
    return this;
};
/**
 * Recompute wireframe
 * @method computeWireframe
 */
Mesh.prototype.computeWireframe = function () {
    var indexer = new Indexer();
    for (var i = 0; i < this.triangles.length; i++) {
        var t = this.triangles[i];
        for (var j = 0; j < t.length; j++) {
            var a = t[j], b = t[(j + 1) % t.length];
            indexer.add([Math.min(a, b), Math.max(a, b)]);
        }
    }
    this.lines = indexer.unique;
    this.compile();
    return this;
};
/**
 * Get mesh bounding box
 * @method getAABB
 */
Mesh.prototype.getAABB = function () {
    var aabb = {
        min: new Vector(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    };
    aabb.max = aabb.min.negative();
    for (var i = 0; i < this.vertices.length; i++) {
        var v = Vector.fromArray(this.vertices[i]);
        aabb.min = Vector.min(aabb.min, v);
        aabb.max = Vector.max(aabb.max, v);
    }
    return aabb;
};
/**
 * Get mesh bounding sphere
 * @method getBoundingSphere
 * @param aabb
 */
Mesh.prototype.getBoundingSphere = function (aabb) {
    var sphere = {
        center: aabb.min.add(aabb.max).divide(2),
        radius: 0
    };
    for (var i = 0; i < this.vertices.length; i++) {
        sphere.radius = Math.max(sphere.radius, Vector.fromArray(this.vertices[i]).subtract(sphere.center).length());
    }
    return sphere;
};
/**
 * Get center point of meshcar.t
 * @method getCenter
 */
Mesh.prototype.getCenter = function () {
    var bb = this.getAABB()
    translationV = bb.min.add(bb.max).divide(2);
    return translationV;
};
/**
 * Get vertex by id
 * @method getVertex
 * @param {int} id Vertex id
 * @return {array[3]} position of vertex
 */
Mesh.prototype.getVertex = function (id) {
    return this.vertices[id];
}
Mesh.prototype.mirrorVertex = function (id) {
    bb = this.getAABB()
    var mid = bb.min.x + (bb.max.x - bb.min.x) / 2.0
    if (this.vertices[id][0] < mid) {
        xRet = mid + (mid - this.vertices[id][0]);
    }
    else {
        xRet = mid - (this.vertices[id][0] - mid);
    }
    ;
    return this.getClosestVertex(new Vector(xRet, this.vertices[id][1], this.vertices[id][2]), 0.1);
}
Mesh.prototype.mirrorUV = function (id) {
    return this.getClosestUV([gl.canvas.width * (0.5 + (0.5 - this.coords[id][0])), gl.canvas.height * this.coords[id][1]], 0.05)
}
/**
 * Check if there are two vertices in the same place( useful to recognize bad import)
 * @method checkRepeat
 */
Mesh.prototype.checkRepeat = function () {
    var repeat = -1;
    for (var vert in this.vertices) {
        if (this.vertices[vert] == this.vertices[0]) {
            repeat += 1;
        }
    }
    return repeat;
}
/**
 * Get vertex by id
 * @method getVertex
 * @param {int} id Vertex id
 * @return {Vector} position of vertex
 */
Mesh.prototype.getVertexV = function (id) {
    return new Vector(this.vertices[id][0], this.vertices[id][1], this.vertices[id][2]);
}
/**
 * Set Position of Vertex
 * @method setVertex
 * @param {int} id Vertex id
 * @param {Vector or array} vector New vertex position
 */
Mesh.prototype.setVertex = function (id, vector) {
    if (vector instanceof Vector)
        this.vertices[id] = vector.toArray()
    else
        this.vertices[id] = vector;
}
/**
 Create a plane
 @method plane
 @static
 @param {Integer} detailX X segments
 @param {Integer} detailY Y segments
 @param {Dict} options additional options
 @return {Mesh} Compiled mesh (plane)
 @example
 someMesh = Mesh.plane(10,10)
 */
Mesh.plane = function (detailX, detailY, options) {
    var mesh = new Mesh(options);
    detailX = detailX || 1;
    detailY = detailY || 1;

    for (var y = 0; y <= detailY; y++) {
        var t = y / detailY;
        for (var x = 0; x <= detailX; x++) {
            var s = x / detailX;
            mesh.vertices.push([2 * s - 1, 2 * t - 1, 0]);
            if (mesh.coords)
                mesh.coords.push([s, t]);
            if (mesh.normals)
                mesh.normals.push([0, 0, 1]);
            if (x < detailX && y < detailY) {
                var i = x + y * (detailX + 1);
                mesh.triangles.push([i, i + 1, i + detailX + 1]);
                mesh.triangles.push([i + detailX + 1, i + 1, i + detailX + 2]);
            }
        }
    }

    mesh.compile();
    return mesh;
};
var cubeData = [
    [0, 4, 2, 6, -1, 0, 0],         // -x
    [1, 3, 5, 7, +1, 0, 0],         // +x
    [0, 1, 4, 5, 0, -1, 0],         // -y
    [2, 6, 3, 7, 0, +1, 0],         // +y
    [0, 2, 1, 3, 0, 0, -1],         // -z
    [4, 5, 6, 7, 0, 0, +1]
];

function pickOctant(i) {
    return new Vector((i & 1) * 2 - 1, (i & 2) - 1, (i & 4) / 2 - 1);
}
/**
 Create a cube
 @method cube
 @static
 @return {Mesh} Compiled mesh (cube)
 @example
 someMesh = Mesh.cube()
 */
Mesh.cube = function () {
    var mesh = new Mesh();

    for (var i = 0; i < cubeData.length; i++) {
        var data = cubeData[i], v = i * 4;
        for (var j = 0; j < 4; j++) {
            var d = data[j];
            mesh.vertices.push(pickOctant(d).toArray());
            if (mesh.coords)
                mesh.coords.push([j & 1, (j & 2) / 2]);
            if (mesh.normals)
                mesh.normals.push([data[4], data[5], data[6]]);
        }
        mesh.triangles.push([v, v + 1, v + 2]);
        mesh.triangles.push([v + 2, v + 1, v + 3]);
    }

    mesh.compile();
    return mesh;
};

/**
 * Coombine two meshes into one
 * @method combine
 * @param {Mesh} mesh additional mesh
 * @param {Boolean} noCompile flag if set to true doesnt compile mesh
 * @return {Mesh} Compiled mesh (cube)
 */
Mesh.prototype.combine = function (mesh, noCompile) {
    this.vertices = this.vertices.concat(mesh.vertices)
    if (this.coords)
        this.coords = this.coords.concat(mesh.coords)
    this.normals = this.normals.concat(mesh.normals)
    for (var t in mesh.triangles) {
        mesh.triangles[t][0] += this.triangles.length * 2
        mesh.triangles[t][1] += this.triangles.length * 2
        mesh.triangles[t][2] += this.triangles.length * 2
    }
    this.triangles = this.triangles.concat(mesh.triangles)
    if (noCompile) {
    } else {
        this.compile();
    }
    return this;
};

/**
 Create a sphere
 @method sphere
 @static
 @param {int} detail sphere resolution
 @param {Dict} options additional options
 @return {Mesh} Compiled mesh (sphere)
 @example
 someMesh = Mesh.sphere(10)
 */
Mesh.sphere = function (detail, options) {
    function tri(a, b, c) {
        return flip ? [a, c, b] : [a, b, c];
    }

    function fix(x) {
        return x + ( x - x * x) / 2;
    }

    var mesh = new Mesh(options);
    var indexer = new Indexer();
    detail = detail || 6;

    for (var octant = 0; octant < 8; octant++) {
        var scale = pickOctant(octant);
        var flip = scale.x * scale.y * scale.z > 0;
        var data = [];
        for (var i = 0; i <= detail; i++) {
            // Generate a row of vertices on the surface of the sphere
            // using barycentric coordinates.
            for (var j = 0; i + j <= detail; j++) {
                var a = i / detail;
                var b = j / detail;
                var c = ( detail - i - j) / detail;
                var vertex = {
                    vertex: new Vector(fix(a), fix(b), fix(c)).unit().multiply(scale).toArray()
                };
                if (mesh.coords)
                    vertex.coord = scale.y > 0 ? [1 - a, c] : [c, 1 - a];
                data.push(indexer.add(vertex));
            }

            // Generate triangles from this row and the previous row.
            if (i > 0) {
                for (var j = 0; i + j <= detail; j++) {
                    var a = ( i - 1) * (detail + 1) + (( i - 1) - ( i - 1) * ( i - 1)) / 2 + j;
                    var b = i * (detail + 1) + ( i - i * i) / 2 + j;
                    mesh.triangles.push(tri(data[a], data[a + 1], data[b]));
                    if (i + j < detail) {
                        mesh.triangles.push(tri(data[b], data[a + 1], data[b + 1]));
                    }
                }
            }
        }
    }

    // Reconstruct the geometry from the indexer.
    mesh.vertices = indexer.unique.map(function (v) {
        return v.vertex;
    });
    if (mesh.coords)
        mesh.coords = indexer.unique.map(function (v) {
            return v.coord;
        });
    if (mesh.normals)
        mesh.normals = mesh.vertices;
    mesh.compile();
    return mesh;
};
/**
 * Load 3d model from json
 * @method load
 * @param {String} json model in json format
 * @param {Dict} options additional options
 * @return {Mesh} Compiled mesh (loaded model)
 */
Mesh.load = function (jsn, options) {
    var json = aLoadJSON(jsn)
    options = options || {};
    if (!json.coords)
        options.coords = false;
    if (!json.normals)
        options.normals = false;
    var mesh = new Mesh(options);
    mesh.vertices = json.vertices;
    mesh.coords = json.coords;
    mesh.normals = json.normals;
    mesh.triangles = json.triangles
    mesh.lines = json.lines || [];
    mesh.compile();
    return mesh;
};
/**
 * Copy mesh
 * @method load
 * @param {Mesh} mesh to copy
 * @return {Mesh} Compiled mesh (copied model)
 */
Mesh.copy = function (mesh) {
    options = options || {};
    if (!mesh.coords)
        options.coords = false;
    if (!mesh.normals)
        options.normals = false;
    var mesh1 = new Mesh(options);
    mesh1.vertices = mesh.vertices;
    mesh1.coords = mesh.coords;
    mesh1.normals = mesh.normals;
    mesh1.triangles = mesh.triangles
    mesh1.lines = mesh.lines || [];
    mesh1.compile();
    return mesh1;
};
/**
 * Load 3d model from itself
 * @method load
 * @param {String} dict of model
 * @param {Dict} options additional options
 * @return {Mesh} Compiled mesh (loaded model)
 */
Mesh.loadStatic = function (jsn, options) {
    var json = jsn
    options = options || {"coords": true};
    if (!json.coords)
        options.coords = false;
    if (!json.normals)
        options.normals = false;
    var mesh = new Mesh(options);
    mesh.vertices = json.vertices;
    mesh.coords = json.coords;
    mesh.normals = json.normals;
    mesh.triangles = json.triangles
    mesh.compile();
    return mesh;
};

/**
 Load 3d model from obj
 @method obj
 @param {String} url path to .obj file
 @param {Function} callback function that happen after successful mesh loading
 @param {Dict} [opts] optional parameters listed in example
 @example
 characterJaw = new GameObject(world, {
        shader: gshader,
        material: planetMat,
        mesh: ludekMesh2,
    })
 Mesh.obj("obj/jaw.obj", function (e) {
        var meshy = e
        meshy.rotate(0, 90, 0)
        meshy.scale(-0.25, 0.25, 0.25)
        meshy.move(0, 0.05, 0)
        characterJaw.mesh = meshy
    })
 */
Mesh.obj = function (url, callback, opts) {
    Resource.load(url, function (e) {
        var data1 = Resource.parse.fromOBJ(e)
        var meshes = {}
        var count = 0
        for (var m in data1) {
            count += 1
            var data = data1[m];
            options = {"coords": true};
            if (!data.coords)
                options.coords = false;
            if (!data.normals)
                options.normals = false;
            var mesh = new Mesh();
            mesh.vertices = data.vertices;
            mesh.coords = data.coords;
            mesh.normals = data.normals;
            mesh.triangles = data.triangles;
            mesh.compile();
            meshes[m] = mesh;
        }
        if (count < 2) {
            var mm = ""
            for (var m in meshes) {
                mm = meshes[m]
            }
            callback(mm)
        } else {
            if (opts) {
                if (opts.loadAsTable) {
                    var meshesT = []
                    for (var m in meshes) {
                        mm = meshes[m]
                        meshesT.push(mm)
                    }
                    callback(meshesT)
                }
                else {
                    callback(meshes)
                }
            } else {
                callback(meshes)
            }
        }
    })
}