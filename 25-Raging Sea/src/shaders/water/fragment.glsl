uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{    
    gl_FragColor = vec4(0.5,0.7,1.0, 1.0);
}