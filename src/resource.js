/**
 * @module Resource
 */


/**
 * Resource manager for files containing static functions
 * @class Resource
 * @constructor
 */
var Resource = function(){

};
Resource.isLoading = false
Resource.queue = []
Resource.loadedElements = {}
Resource.loadNextElement=function(){
    var q = Resource.queue
    if(q.length != 0){
        var newElement = q.splice(0,1)[0]
        Resource.loadFunction(newElement[0],newElement[1])
    }else{
        Resource.isLoading = false
    }
}
Resource.loadFunction = function (path, resp) {
    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    var ext = path.split(".").pop()
    if(ext == "obj"){
        request.responseType = "arraybuffer";
    }else if(ext == "js" || ext=="json"){

    }else{
        request.responseType = "blob";
    }
    request.onload = function (e) {
        resp(e.target.response);
        Resource.loadedElements[path] = 1
        Resource.loadNextElement()
    };
    request.send();
}
/**
 * Loads objects and pass it to callbacks
 * @param [String] path to file
 * @param [Function] resp callback function
 */
Resource.load = function (path, resp) {
    Resource.loadedElements[path] = 0
    if(Resource.isLoading){
        Resource.queue.push([path,resp])
    }else{
        Resource.isLoading = true
        Resource.loadFunction(path,resp)
    }
}

Resource.save = function (buff, path) {
    var dataURI = "data:application/octet-stream;base64," + btoa(Resource.parse._buffToStr(buff));
    window.location.href = dataURI;
}

Resource.clone = function (o) {
    return JSON.parse(JSON.stringify(o));
}


Resource.bin = {};

Resource.bin.f = new Float32Array(1);
Resource.bin.fb = new Uint8Array(Resource.bin.f.buffer);

Resource.bin.rf = function (buff, off) {
    var f = Resource.bin.f, fb = Resource.bin.fb;
    for (var i = 0; i < 4; i++) fb[i] = buff[off + i];
    return f[0];
}
Resource.bin.rsl = function (buff, off) {
    return buff[off] | buff[off + 1] << 8;
}
Resource.bin.ril = function (buff, off) {
    return buff[off] | buff[off + 1] << 8 | buff[off + 2] << 16 | buff[off + 3] << 24;
}
Resource.bin.rASCII0 = function (buff, off) {
    var s = "";
    while (buff[off] != 0) s += String.fromCharCode(buff[off++]);
    return s;
}


Resource.bin.wf = function (buff, off, v) {
    var f = new Float32Array(buff.buffer, off, 1);
    f[0] = v;
}
Resource.bin.wsl = function (buff, off, v) {
    buff[off] = v;
    buff[off + 1] = v >> 8;
}
Resource.bin.wil = function (buff, off, v) {
    buff[off] = v;
    buff[off + 1] = v >> 8;
    buff[off + 2] = v >> 16;
    buff[off + 3] >> 24;
}
Resource.parse = {};

Resource.parse._buffToStr = function (buff) {
    var a = new Uint8Array(buff);
    var s = "";
    for (var i = 0; i < a.length; i++) s = s.concat(String.fromCharCode(a[i]));
    return s;
}

Resource.parse._strToBuff = function (str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) bufView[i] = str.charCodeAt(i);
    return buf;
}

Resource.parse._readLine = function (a, off)	// Uint8Array, offset
{
    var s = "";
    while (a[off] != 10) s += String.fromCharCode(a[off++]);
    return s;
}
Resource.parse.fromJSON = function (buff) {
    var json = JSON.parse(Resource.parse._buffToStr(buff));
    return json;
}

Resource.parse.toJSON = function (object) {
    var str = JSON.stringify(object);
    return Resource.parse._strToBuff(str);
}
function _ind(part) {
    var p = part.split("/")
    var indices = []
    for (var pp in p) {
        var ppp = p[pp]
        if (ppp) {
            indices.push(parseInt(ppp) - 1)
        } else {
            indices.push(-1)
        }
    }
    while (indices.length < 3) {
        indices.push(-1)
    }
    return indices.slice(0, 3)
}
Resource.parse.fromOBJ = function (buff,readmode) {
    groups = {}
    var cg = {from: 0, to: 0, triangles: []};
    var lastFrom = 0// current group
    var off = 0;
    var a = new Uint8Array(buff);
    var vertices = [];
    var normals = [];
    var coords = [];
    var facemode = "g"
    if(readmode){
      facemode = readmode
    }
    while (off < a.length) {
        var line = Resource.parse._readLine(a, off);
        off += line.length + 1;
        var cds = line.trim().split(" ");
        trimWhitespace(cds)
        if (cds[0] == facemode) {
            if (groups[cds[1]] == null){
                cg = { triangles: []};
                groups[cds[1]] = cg
            }else{
                cg = groups[cds[1]]
            }
        }
        if (cds[0] == "g2") {
            cg = {triangles: []};
            if (groups[cds[1]] == null) groups[cds[1]] = cg
        }
        if (cds[0] == "v") {
            var x = parseFloat(cds[1]);
            var y = parseFloat(cds[2]);
            var z = parseFloat(cds[3]);
            vertices.push([x, y, z]);
        }
        if (cds[0] == "vt") {
            var x = parseFloat(cds[1]);
            var y = 1 - parseFloat(cds[2]);
            coords.push([x, y]);
        }
        if (cds[0] == "vn") {
            var x = parseFloat(cds[1]);
            var y = parseFloat(cds[2]);
            var z = parseFloat(cds[3]);
            normals.push([x, y, z]);
        }
        if (cds[0] == "f") {
            indices = []
            for (var i = 1; i < cds.length; i++) {
                indices.push(_ind(cds[i]))
            }
            for (var i = 2; i < indices.length; i++) {
                cg.triangles.push([indices[0], indices[i - 1], indices[i]])
            }
        }
    }
    var returnGroup = {}
    for (var g in groups) {
        var currentGroup = groups[g]
        var vertexMap = {}
        var verts = []
        var uvs = []
        var norms = []
        var triangl = []
        var triangles = currentGroup.triangles
        for (var tt in triangles) {
            var abc = [0, 0, 0]
            var t = triangles[tt]
            for (var i = 0; i < 3; i++) {
                var v = t[i][0]
                var c = t[i][1]
                var n = t[i][2]
                vmap = [vertices[v], (n >= 0 && n < normals.length) ? normals[n] : [0, 0, 0], (c >= 0 && c < coords.length) ? coords[c] : [0, 0]]
                if (vmap in vertexMap) {

                } else {
                    vertexMap[vmap] = verts.length
                    verts.push(vmap[0])
                    norms.push(vmap[1])
                    uvs.push(vmap[2])
                }
                abc[i] = vertexMap[vmap]
            }
            triangl.push(abc)
        }
        returnGroup[g]={
            vertices: verts,
            coords: uvs,
            normals: norms,
            triangles: triangl
        }
    }

    return returnGroup;
}
Resource.parse.fromSTL = function(res) {
  console.log(res)
  var buffer = res;
  var vertices = [];
  var triangles = [];
  var vertexmap = {}
  var nTriBuff = buffer.slice(80, 84);
  var nTriView = new Uint32Array(nTriBuff);
  var nTri = nTriView[0];
  for (var i = 0; i < nTri; i++) {

    var triBuff = buffer.slice(84 + i * 50,
      84 + (i + 1) * 50 - 2);

    var triFloatBuff = new Float32Array(triBuff);

    var n = [triFloatBuff[0],
      triFloatBuff[1], triFloatBuff[2]
    ];
    var triangle = [];
    for (var j = 3; j < 12; j += 3) {
      var p = [triFloatBuff[j],
        triFloatBuff[j + 1], triFloatBuff[j + 2]
      ];
      if (vertexmap[p]) {} else {
        vertices.push(p)
        vertexmap[p] = vertices.length - 1
      }
      triangle.push(vertexmap[p])
    }
    triangles.push(triangle)
  }
  return [{
    "vertices": vertices,
    "triangles": triangles
  }];
};

Resource.parse.fromSTLASCI = function(res) {
  var vertices = [];
  var triangles = [];
  var state = '';
  var vertexmap = {}
  var lines = res.split('\n');
  for (var len = lines.length, i = 0; i < len; i++) {
    if (done) {
      break;
    }
    line = trim(lines[i]);
    parts = line.split(' ');
    switch (state) {
      case '':
        if (parts[0] !== 'solid') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "solid"');
          return;
        } else {
          name = parts[1];
          state = 'solid';
        }
        break;
      case 'solid':
        if (parts[0] !== 'facet' || parts[1] !== 'normal') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "facet normal"');
          return;
        } else {
          normal = [
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          ];
          state = 'facet normal';
        }
        break;
      case 'facet normal':
        if (parts[0] !== 'outer' || parts[1] !== 'loop') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "outer loop"');
          return;
        } else {
          state = 'vertex';
        }
        break;
      case 'vertex':
        if (parts[0] === 'vertex') {
          vertices.push([
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          ]);
        } else if (parts[0] === 'endloop') {
          triangles.push([vCount * 3, vCount * 3 + 1, vCount * 3 + 2]);
          vCount++;
          state = 'endloop';
        } else {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "vertex" or "endloop"');
          return;
        }
        break;
      case 'endloop':
        if (parts[0] !== 'endfacet') {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "endfacet"');
          return;
        } else {
          state = 'endfacet';
        }
        break;
      case 'endfacet':
        if (parts[0] === 'endsolid') {
          done = true;
        } else if (parts[0] === 'facet' && parts[1] === 'normal') {
          normal = [
            parseFloat(parts[2]),
            parseFloat(parts[3]),
            parseFloat(parts[4])
          ];
          state = 'facet normal';
        } else {
          console.error(line);
          console.error('Invalid state "' + parts[0] + '", should be "endsolid" or "facet normal"');
          return;
        }
        break;
      default:
        console.error('Invalid state "' + state + '"');
        break;
    }
  }
  return [{
    "vertices": vertices,
    "triangles": triangles
  }];
};
Resource.parse.from3DS = function (buff) {
    buff = new Uint8Array(buff);
    var res = {};
    if (Resource.bin.rsl(buff, 0) != 0x4d4d) return null;
    var lim = Resource.bin.ril(buff, 2);

    var off = 6;
    while (off < lim) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log(cid.toString(16), lng);

        if (cid == 0x3d3d) res.edit = Resource.parse.from3DS._edit3ds(buff, off, lng);
        if (cid == 0xb000) res.keyf = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._edit3ds = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t", cid.toString(16), lng);

        if (cid == 0x4000) {
            if (res.objects == null) res.objects = [];
            res.objects.push(Resource.parse.from3DS._edit_object(buff, off, lng));
        }
        //if(cid == 0xb000) res.KEYF3DS = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf3ds = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t", cid.toString(16), lng);

        //if(cid == 0x4000) { res.objects.push(Resource.parse.from3DS._edit_object(buff, off, lng)); }
        if (cid == 0xb002) {
            if (res.desc == null) res.desc = [];
            res.desc.push(Resource.parse.from3DS._keyf_objdes(buff, off, lng));
        }

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf_objdes = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t\t", cid.toString(16), lng);

        if (cid == 0xb010) res.hierarchy = Resource.parse.from3DS._keyf_objhierarch(buff, off, lng);
        if (cid == 0xb011) res.dummy_name = Resource.bin.rASCII0(buff, off + 6);
        off += lng;
    }
    return res;
}

Resource.parse.from3DS._keyf_objhierarch = function (buff, coff, clng) {
    var res = {};
    var off = coff + 6;
    res.name = Resource.bin.rASCII0(buff, off);
    off += res.name.length + 1;
    res.hierarchy = Resource.bin.rsl(buff, off + 4);
    return res;
}

Resource.parse.from3DS._edit_object = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    res.name = Resource.bin.rASCII0(buff, off);
    off += res.name.length + 1;
    //console.log(res.name);
    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t", cid.toString(16), lng);

        if (cid == 0x4100) res.mesh = Resource.parse.from3DS._obj_trimesh(buff, off, lng);
        //if(cid == 0xb000) res.KEYF3DS = Resource.parse.from3DS._keyf3ds(buff, off, lng);

        off += lng;
    }
    return res;
}

Resource.parse.from3DS._obj_trimesh = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;

    while (off < coff + clng) {
        var cid = Resource.bin.rsl(buff, off);
        var lng = Resource.bin.ril(buff, off + 2);
        //console.log("\t\t\t", cid.toString(16), lng);

        if (cid == 0x4110) res.vertices = Resource.parse.from3DS._tri_vertexl(buff, off, lng);
        if (cid == 0x4120) res.indices = Resource.parse.from3DS._tri_facel1(buff, off, lng);
        if (cid == 0x4140) res.uvt = Resource.parse.from3DS._tri_mappingcoors(buff, off, lng);
        if (cid == 0x4160) res.local = Resource.parse.from3DS._tri_local(buff, off, lng);
        off += lng;
    }
    return res;
}

Resource.parse.from3DS._tri_vertexl = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rf(buff, off));
        res.push(Resource.bin.rf(buff, off + 4));
        res.push(Resource.bin.rf(buff, off + 8));
        off += 12;
    }
    return res;
}

Resource.parse.from3DS._tri_facel1 = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rsl(buff, off));
        res.push(Resource.bin.rsl(buff, off + 2));
        res.push(Resource.bin.rsl(buff, off + 4));
        off += 8;
    }
    return res;
}

Resource.parse.from3DS._tri_mappingcoors = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = [];
    var off = coff + 6;
    var n = Resource.bin.rsl(buff, off);
    off += 2;
    for (var i = 0; i < n; i++) {
        res.push(Resource.bin.rf(buff, off));
        res.push(1 - Resource.bin.rf(buff, off + 4));
        off += 8;
    }
    return res;
}

Resource.parse.from3DS._tri_local = function (buff, coff, clng)	// buffer, chunk offset, length
{
    var res = {};
    var off = coff + 6;
    res.X = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.Y = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.Z = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    res.C = [Resource.bin.rf(buff, off), Resource.bin.rf(buff, off + 4), Resource.bin.rf(buff, off + 8)];
    off += 12;
    return res;
}
