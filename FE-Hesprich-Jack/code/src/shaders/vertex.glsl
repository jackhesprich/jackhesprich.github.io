varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
    // Normal to View Space
    vNormal = normalize(normalMatrix * normal);

    // Vertex to View Space
    vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = viewPos.xyz;

    gl_Position = projectionMatrix * viewPos;

    vUv = uv;
}