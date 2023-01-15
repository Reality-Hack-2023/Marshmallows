#version 300 es

uniform mat4 uMVPMatrix;
uniform mat4 uSTMatrix;

layout(location = 0) in vec3 attPosition;
out vec2 texCoord;
layout(location = 1) in vec3 attTexcoord0;
out vec2 maskTexCoord;

void main()
{
    gl_Position = uMVPMatrix * vec4(attPosition.xy, 0.0, 1.0);
    texCoord = (gl_Position.xy * 0.5) + vec2(0.5);
    vec2 coord = (uSTMatrix * vec4(attTexcoord0.xy, 0.0, 1.0)).xy;
    maskTexCoord = vec2(coord.x, 1.0 - coord.y);
}

