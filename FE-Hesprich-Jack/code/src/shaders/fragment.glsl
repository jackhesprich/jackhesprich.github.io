uniform sampler2D imageShadeTexture;
uniform sampler2D imageTexture;
uniform sampler2D copic1;
uniform sampler2D copic2;
uniform sampler2D copic3;
uniform sampler2D copic4;
uniform sampler2D copic5;
uniform sampler2D copic6;
uniform vec2 resolution;

uniform vec3 u_objectColor;
uniform vec3 u_shaderColor;
uniform vec3 u_lightPos;       
uniform vec3 u_lightColor;
uniform float u_ambientStrength;
uniform float u_diffuseStrength;
uniform float u_bandCount;
uniform float u_zoom;

uniform bool u_useEdges;
uniform float u_edgeThickness;
uniform float u_repeat;
uniform bool u_printMode;
uniform bool u_textureMode;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

// TAM Interpolation Function
vec4 interpolate(float intensity, vec3 objectColor, vec3 shaderColor) {
    vec2 nUV = gl_FragCoord.xy / resolution.xy;

    nUV.x *= resolution.x / resolution.y;

    nUV *= u_zoom;

    float mixPercent;
    float increment = 1.0 / u_bandCount;


    vec4 tile1;
    vec4 tile2;


    float currentStep = floor(intensity * u_bandCount);

    float start = currentStep * increment;
    float end = start + increment;


    if (u_bandCount == 1.0) {
        tile1 = texture2D(copic1, nUV);
        tile2 = texture2D(copic4, nUV);
        tile1 *= vec4(objectColor, 1.0);
        tile2 *= vec4(shaderColor, 1.0);
    } else if (u_bandCount == 2.0) {
        if (intensity < increment) {
            tile1 = texture2D(copic1, nUV);
            tile2 = texture2D(copic3, nUV);
            tile1 *= vec4(objectColor, 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.5), 1.0);
        } else {
            tile1 = texture2D(copic3, nUV);
            tile2 = texture2D(copic5, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.5), 1.0);
            tile2 *= vec4(shaderColor, 1.0);
        }
    } else if (u_bandCount == 3.0) {
        if (intensity < increment) {
            tile1 = texture2D(copic1, nUV);
            tile2 = texture2D(copic2, nUV);
            tile1 *= vec4(objectColor, 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.25), 1.0);
        } else if (intensity < (increment * 2.0)) {
            tile1 = texture2D(copic2, nUV);
            tile2 = texture2D(copic4, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.25), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.50), 1.0);
        } else {
            tile1 = texture2D(copic4, nUV);
            tile2 = texture2D(copic6, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.50), 1.0);
            tile2 *= vec4(shaderColor, 1.0);
        }
    } else if (u_bandCount == 4.0) {
        if (intensity < increment) {
            tile1 = texture2D(copic1, nUV);
            tile2 = texture2D(copic2, nUV);
            tile1 *= vec4(objectColor, 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.30), 1.0);
        } else if (intensity < (increment * 2.0)) {
            tile1 = texture2D(copic2, nUV);
            tile2 = texture2D(copic3, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.30), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.60), 1.0);
        } else if (intensity < (increment * 3.0)) {
            tile1 = texture2D(copic3, nUV);
            tile2 = texture2D(copic4, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.60), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.90), 1.0);
        } else {
            tile1 = texture2D(copic4, nUV);
            tile2 = texture2D(copic5, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.90), 1.0);
            tile2 *= vec4(shaderColor, 1.0);
        }
    } else if (u_bandCount == 5.0) {
        if (intensity < increment) {
            tile1 = texture2D(copic1, nUV);
            tile2 = texture2D(copic2, nUV);
            tile1 *= vec4(objectColor, 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.20), 1.0);
        } else if (intensity < (increment * 2.0)) {
            tile1 = texture2D(copic2, nUV);
            tile2 = texture2D(copic3, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.20), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.40), 1.0);
        } else if (intensity < (increment * 3.0)) {
            tile1 = texture2D(copic3, nUV);
            tile2 = texture2D(copic4, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.40), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.60), 1.0);
        } else if (intensity < (increment * 4.0)) {
            tile1 = texture2D(copic4, nUV);
            tile2 = texture2D(copic5, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.60), 1.0);
            tile2 *= vec4(mix(objectColor, shaderColor, 0.80), 1.0);
        }else {
            tile1 = texture2D(copic5, nUV);
            tile2 = texture2D(copic6, nUV);
            tile1 *= vec4(mix(objectColor, shaderColor, 0.80), 1.0);
            tile2 *= vec4(shaderColor, 1.0);
        }
    }

    float middle = (start + end) / 2.0;

    vec4 returner;

    if (intensity > middle) {
        mixPercent = 1.0 - ((intensity - middle) / (end - middle));
        returner = mix(tile2,tile1, mixPercent);
    } else {
        returner = tile1;
    }

    
    return returner;
}

// For Outline
float edgeFactor(vec2 p){
    vec2 grid = abs(fract(p * u_repeat) - 0.5) / (fwidth(p) * u_edgeThickness);
    float minGrid = min(grid.x, grid.y);
    return clamp(1.0 - minGrid, 0.0, 1.0);
}

// Main
void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vViewPosition);

    // Ambient
    vec4 ambient = vec4((u_ambientStrength * u_lightColor), 1.0);

    // Diffuse
    vec3 lightDir = normalize(u_lightPos - vViewPosition);
    float diff = max(dot(normal, lightDir), 0.0);
    vec4 diffuse = vec4((diff * u_diffuseStrength * u_lightColor), 1.0);

    vec4 result;

    // Print Mode
    if (u_printMode) {
        result = (ambient + diffuse) * vec4(1.0, 1.0, 1.0, 1.0);
        result = mix(result, vec4(0.0, 0.0, 0.0, 1.0), edgeFactor(vUv));

    } else {
        // Copic
        float brightness = clamp((diff * u_diffuseStrength) + u_ambientStrength, 0.0, 1.0);
        float intensity = 1.0 - brightness;

        // Image Textures
        if (u_textureMode) {
            vec4 imageTextureColor = texture2D(imageTexture, vUv);
            vec3 imageColorConvert = imageTextureColor.rgb;
            vec4 imageShadeTextureColor = texture2D(imageShadeTexture, vUv);
            vec3 imageShadeColorConvert = imageShadeTextureColor.rgb;

            result = interpolate(intensity, imageColorConvert, imageShadeColorConvert);
        } else {
            result = interpolate(intensity, u_objectColor, u_shaderColor);
        }
        
        // Edges
        float a = u_useEdges ? edgeFactor(vUv) : 0.0;
        result = mix(result, vec4(0.0, 0.0, 0.0, 1.0), a);
    }
    

    gl_FragColor = result;


}