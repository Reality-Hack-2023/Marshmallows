#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D inputImageTexture;
uniform mediump sampler2D _MaskTexture;

in vec2 texCoord;
in vec2 maskTexCoord;
layout(location = 0) out vec4 o_FragColor;

void main()
{
    mediump vec4 src = texture(inputImageTexture, texCoord);
    mediump float alpha = texture(_MaskTexture, maskTexCoord).x;
    src *= alpha;
    o_FragColor = src;
}

