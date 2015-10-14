/**
 @module ShaderLibrary
 */
var basicText = function () {
    return new Shader('\
			varying vec2 vTex;\
			varying vec4 vPosition;\
			varying vec3 vNormal;\
			void main(void) {\
			vNormal = Normal;\
			vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			vTex = TexCoord;\
			gl_Position = gl_ProjectionMatrix * vPosition;\
			}', 'varying vec2 vTex;\
			varying vec4 vPosition;\
			varying vec3 vNormal;\
			struct Material\
			{\
				vec3 color;\
				float shininess;\
				bool useDiffuse;\
				bool useSpecular;\
				bool useLights;\
				float specularWeight;\
				bool useBump;\
				float bumpWeight;\
				bool useDof;\
				float mappingType;\
				float dofWeight;\
				bool useRefraction;\
				float refraction;\
				float alpha;\
			};\
			uniform sampler2D diffuse;\
			uniform Material material;\
			uniform vec2 tiling;\
			void main(void) {\
				vec2 tiler;\
				if(tiling.x == 0.0){\
					tiler = vTex;\
				}\
				else{\
					tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
				}\
				vec4 clr = vec4(material.color,1.0);\
				if(material.useDiffuse){\
					clr = texture2D(diffuse, tiler);\
				};\
				gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
			}');
};
var basicShaderDepth = function () {
    return new Shader('\
			varying vec4 vPosition;\
			void main(void) {\
			vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			gl_Position = gl_ProjectionMatrix * vPosition;\
			}', 'varying vec4 vPosition;\
			uniform float zNear;\
			uniform float zFar;\
			float LinearDepthConstant = 1.0 / (zFar - zNear);\
			vec4 pack (float depth)\
			{\
				const vec4 bias = vec4(1.0 / 255.0,\
							1.0 / 255.0,\
							1.0 / 255.0,\
							0.0);\
			\
				float r = depth;\
				float g = fract(r * 255.0);\
				float b = fract(g * 255.0);\
				float a = fract(b * 255.0);\
				vec4 colour = vec4(r, g, b, a);\
				\
				return colour - (colour.yzww * bias);\
			}\
			float rand(vec2 co){\
    			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
			}\
			void main(void) {\
				float linearDepth = length(vPosition) * LinearDepthConstant;\
				vec4 clr = vec4(normalize(vPosition.xyz)/10.0,1.0);\
				gl_FragColor = vec4(linearDepth,linearDepth,linearDepth,1.0);\
			}');
};
/**
 * Constructs shader - This is done this way to minify the shader structure
 * @method basicShader
 * @param {Object} options Options of shader construction
 * @example
 *     //Simple shader considering light and diffuse texture
 *     var shader = basicShader({
 *          useBump: false,
 *          useDiffuse: false,
 *          useAtlas: false,
 *          useSpecular: false,
 *          useLights: false,
 *          useTiling: false,
 *          useReflection:false,
 *          useSky:false
 *     });
 */
var basicShader = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false
    }
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("float", "nrmY")
    bShader.addVarying("vec3", "dZ")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "vNormal")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVertexSource('\
			void main(void) {\
			    normalEye = normalize(NormalMatrix*Normal);\
			    vNormal = Normal;\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    dZ = (gl_ProjectionMatrix * vPosition).xyz;\
			    nrmY = abs(Normal.y);\
			    vTex = TexCoord;\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    if (settings.useLights) {
        bShader.addStruct("Light")
        bShader.addToStruct("Light", "vec3", "lightPosition")
        bShader.addToStruct("Light", "vec3", "color")
        bShader.addToStruct("Light", "float", "attenuation")
        bShader.addToStruct("Light", "float", "intensity")
        bShader.addToStruct("Light", "float", "lightType")
        bShader.addUniform("float", "numlights")
        bShader.addUniform("Light", "lights[32]")
        bShader.addToStruct("Light", "bool", "shadow")
        if (settings.useShadow) {
            bShader.addUniform("samplerCube", "shadows")
        }
    }
    bShader.addToStruct("Material", "float", "shininess")
    bShader.addToStruct("Material", "float", "mappingType")
    bShader.addToStruct("Material", "float", "alpha")
    bShader.addToStruct("Material", "float", "specularWeight")
    bShader.addUniform("Material", "material")
    bShader.addUniform("float", "cameraNear")
    bShader.addUniform("float", "cameraFar")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    if (settings.useSpecular) {
        bShader.addUniform("sampler2D", "specular")
    }
    if (settings.useBump) {
        bShader.addUniform("sampler2D", "bump")
        bShader.addToStruct("Material", "float", "bumpWeight")
    }
    if (settings.useReflection || settings.useSky) {
        bShader.addUniform("samplerCube", "cube")
        bShader.addToStruct("Material", "float", "reflectionWeight")
    }
    if (settings.useFog) {
        bShader.addStruct("Fog")
        bShader.addToStruct("Fog", "vec2", "zMinMax")
        bShader.addToStruct("Fog", "vec3", "color")
        bShader.addToStruct("Fog", "float", "intensity")
        bShader.addUniform("Fog", "fog")
    }
    var fragSource = '\
			float rand(vec2 co){\
    			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
			}' + (settings.useShadow ? 'float shadowFac(vec3 ld){\
			vec3 ld2 = vec3(-ld.x,ld.y,ld.z);\
			float sd = textureCube(shadows,ld2).r;\
			float eps = 1.0/cameraFar;\
			float distance = length(ld)/cameraFar;\
			if(distance<=(sd+eps)){\
			    return 1.0;\
			}\
			else{\
			    return 0.5;\
			}\
			}' : '') +
        (settings.useLights ?
            'vec3 lightPow(Light li,vec2 til){\
                vec3 vpos = vPosition.xyz;\
                vec3 lp = li.lightPosition;\
                vec3 lightSub = lp-vpos;\
                float distance = length(lightSub);\
                float att = max(li.attenuation-distance,0.0)/li.attenuation;\
				vec3 lightDirection = normalize(lightSub);\
				vec3 eyeDirection = normalize(-dZ.xyz);\
				float dW = max(0.0,dot(normalEye,lightDirection));\
        		vec3 reflectionDirection = reflect(-lightDirection, normalEye);\
        		float shininess = material.shininess;\
            float specularT = 0.0;\
            vec3 returnedLight = vec3(0.0,0.0,0.0);\
        		' + (settings.useBump ? '\
				vec3 bmpp = texture2D(bump, til).xyz;\
				bmpp = (bmpp -0.5) * 2.0;\
				dW = dW*bmpp.x*(material.bumpWeight)+dW*(1.0-material.bumpWeight);' : '') +
                'if(dW>0.0){'
                + (settings.useSpecular ? '\
       				specularT = texture2D(specular, til).r*pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess/4.0);\
             }' : '\
        		    specularT = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess/4.0);\
              }\
        		') + (settings.useShadow ? '\
        		    if(li.shadow){\
       				    dW = dW*shadowFac(lightSub);\
       				}' : '') +
                'returnedLight = li.color*dW + specularT*material.specularWeight;\
                returnedLight *= att;\
                returnedLight *= li.intensity;\
                return returnedLight;\
            }' : '') +
        'void main(void) {\
            vec2 tiler;' + (settings.useAtlas ? "\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
            " : "\
            tiler = vTex;") +
        (settings.useTiling ?
            'tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
            ' : '') + (settings.boxMapping ? '\
					if(abs(vNormal.z)>0.5){\
						tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
					}else{\
						if(abs(vNormal.y)>0.5){\
							tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
						}\
						else{\
							tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
						}\
					}' : '') + '\
				vec3 dWei = vec3(0.0,0.0,0.0);\
				vec4 clr = vec4(material.color,1.0);\
				' + (settings.useDiffuse ? 'clr = texture2D(diffuse, tiler);\
				clr = vec4(clr.rgb*material.color,clr.a);' : '') + (settings.useReflection ? '\
        vec3 thh = reflect(dZ,normalEye);\
		vec4 txc = textureCube(cube,thh);\
		clr = vec4(clr.rgb*(1.0-material.reflectionWeight)+txc.rgb*material.reflectionWeight,clr.a);\
        ' : '') + (settings.useLights ?
        '\
        for(int i = 0;i<32;i++){\
            if( i >= int(numlights)){\
            break;\
            };\
            Light li = lights[i];\
            if(li.lightType == 1.0){\
            dWei += lightPow(li,tiler);\
            }else{\
            dWei += li.color*li.intensity;\
            }\
        };' : 'dWei = vec3(1.0,1.0,1.0);') + (settings.useSky ? '\
        vec3 thh = vPosition.xyz;\
		vec4 txc = textureCube(cube,thh);\
		clr = vec4(clr.rgb*(1.0-material.reflectionWeight)+txc.rgb*material.reflectionWeight,clr.a);\
        ' : '') + 'clr = vec4(clr.rgb*dWei,clr.a);' + (settings.useFog ? '\
        float depth = vPosition.z/fog.zMinMax.y;\
		clr = vec4(clr.rgb+fog.color*depth*fog.intensity,clr.a);\
        ' : '') + '\
        gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
 var OrenNayar = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false
    }
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVertexSource('\
            void main(void) {\
                normalEye = normalize(NormalMatrix*Normal);\
                vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
                vTex = TexCoord;\
                gl_Position = gl_ProjectionMatrix * vPosition;\
            }')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    bShader.addStruct("Light")
    bShader.addToStruct("Light", "vec3", "lightPosition")
    bShader.addToStruct("Light", "vec3", "color")
    bShader.addToStruct("Light", "float", "attenuation")
    bShader.addToStruct("Light", "float", "intensity")
    bShader.addToStruct("Light", "float", "lightType")
    bShader.addUniform("float", "numlights")
    bShader.addUniform("Light", "lights[32]")
    bShader.addToStruct("Light", "bool", "shadow")
    bShader.addToStruct("Material", "float", "roughness")
    bShader.addToStruct("Material", "float", "albedo")
    bShader.addToStruct("Material", "float", "alpha")
    bShader.addUniform("Material", "material")
    bShader.addUniform("float", "cameraNear")
    bShader.addUniform("float", "cameraFar")
    bShader.addUniform("vec3", "cameraPosition")
    bShader.addUniform("vec3", "cameraDirection")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    if (settings.useReflection || settings.useSky) {
        bShader.addUniform("samplerCube", "cube")
        bShader.addToStruct("Material", "float", "reflectionWeight")
    }
    var fragSource =  '\
    float orenNayarDiffuse(\
      vec3 lightDirection,\
      vec3 viewDirection,\
      vec3 surfaceNormal,\
      float roughness,\
      float albedo) {\
      float LdotV = dot(lightDirection, viewDirection);\
      float NdotL = dot(lightDirection, surfaceNormal);\
      float NdotV = dot(surfaceNormal, viewDirection);\
      float s = LdotV - NdotL * NdotV;\
      float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));\
      float sigma2 = roughness * roughness;\
      float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\
      float B = 0.45 * sigma2 / (sigma2 + 0.09);\
      return albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14;\
    }\
    void main(void) {\
            vec2 tiler;' + (settings.useAtlas ? "\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
            " : "\
            tiler = vTex;") +
        (settings.useTiling ?
            'tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
            ' : '') + (settings.boxMapping ? '\
                    if(abs(vNormal.z)>0.5){\
                        tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
                    }else{\
                        if(abs(vNormal.y)>0.5){\
                            tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
                        }\
                        else{\
                            tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
                        }\
                    }' : '') + '\
                vec3 dWei = vec3(0.0,0.0,0.0);\
                vec4 clr = vec4(material.color,1.0);\
                ' + (settings.useLights ?
        '\
        for(int i = 0;i<32;i++){\
            if( i >= int(numlights)){\
            break;\
            };\
            Light li = lights[i];\
            if(li.lightType == 1.0){\
            dWei += orenNayarDiffuse(normalize(li.lightPosition-vPosition.xyz),normalize(cameraPosition-vPosition.xyz),normalEye,material.roughness,material.albedo);\
            }else{\
            dWei += li.color*li.intensity;\
            }\
        };' : 'dWei = vec3(1.0,1.0,1.0);') + 'clr = vec4(clr.rgb*dWei,clr.a);' + '\
        gl_FragColor = vec4(clr.rgb,clr.a*material.alpha);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
var basicMobileShader = function (options) {
    var settings = {
        useBump: false,
        useDiffuse: false,
        useAtlas: false,
        useSpecular: false,
        useLights: false,
        useTiling: false,
        useReflection: false,
        useSky: false
    }
    if (options) {
        for (var o in options) {
            settings[o] = options[o]
        }
    }
    var bShader = new Shader("", "", 1)
    bShader.addVarying("vec2", "vTex")
    bShader.addVarying("vec4", "vPosition")
    bShader.addVarying("vec3", "vNormal")
    bShader.addVarying("vec3", "normalEye")
    bShader.addVertexSource('\
			void main(void) {\
			    normalEye = normalize(Normal*NormalMatrix);\
			    vNormal = Normal;\
			    vPosition = gl_ModelViewMatrix * vec4(Vertex, 1.0);\
			    vTex = TexCoord;\
			    gl_Position = gl_ProjectionMatrix * vPosition;\
			}')

    bShader.addStruct("Material")
    bShader.addToStruct("Material", "vec3", "color")
    bShader.addUniform("Material", "material")
    if (settings.useAtlas) {
        bShader.addUniform("vec4", "atlas")
    }
    if (settings.useTiling) {
        bShader.addUniform("vec2", "tiling")
    }
    if (settings.useDiffuse) {
        bShader.addUniform("sampler2D", "diffuse")
    }
    var fragSource =
        'void main(void) {\
            vec2 tiler;' + (settings.useAtlas ? "\
            float aU = atlas.y-atlas.x;\
            float aV = atlas.w-atlas.z;\
            tiler = vec2(atlas.x+vTex.x*aU,atlas.z+vTex.y*aV);\
            " : "\
            tiler = vTex;") +
        (settings.useTiling ?
            'tiler = vec2(vTex.s*tiling.x,vTex.t*tiling.y);\
            ' : '') + (settings.boxMapping ? '\
					if(abs(vNormal.z)>0.5){\
						tiler = vec2(vPosition.x*tiling.x,vPosition.y*tiling.y);\
					}else{\
						if(abs(vNormal.y)>0.5){\
							tiler = vec2(vPosition.z*tiling.x,vPosition.x*tiling.x);\
						}\
						else{\
							tiler = vec2(vPosition.z*tiling.x,vPosition.y*tiling.y);\
						}\
					}' : '') + '\
				vec3 dWei = vec3(0.0,0.0,0.0);\
				vec4 clr = vec4(material.color,1.0);\
				' + (settings.useDiffuse ? 'clr = texture2D(diffuse, tiler);\
				clr = vec4(clr.rgb*material.color,clr.a);' : '') + 'dWei = vec3(1.0,1.0,1.0);\
				clr = vec4(clr.rgb*dot(normalEye,normalize(vec3(2.0,10.0,10.0))),clr.a);' + '\
        gl_FragColor = vec4(clr.rgb,clr.a);\
    }';
    bShader.addFragmentSource(fragSource)
    bShader._build();
    return bShader
}
