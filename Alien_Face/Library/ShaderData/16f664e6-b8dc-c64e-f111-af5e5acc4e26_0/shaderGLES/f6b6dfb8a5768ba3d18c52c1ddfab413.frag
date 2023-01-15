#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D u_FBOTexture;
uniform mediump sampler2D _BaseTexture;
uniform float _Intensity;
uniform float _Opacity;
uniform float _EnableOpacity;
uniform mediump sampler2D _OpacityTexture;
uniform vec4 _BaseColor;

in vec2 texCoord;
in vec2 sucaiTexCoord;
layout(location = 0) out vec4 o_FragColor;

vec4 textureFromInput()
{
    vec4 result = texture(u_FBOTexture, texCoord);
    return result;
}

vec3 ApplyBlendMode(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
    return ret;
}

void main()
{
    vec4 src = textureFromInput();
    vec4 sucai = texture(_BaseTexture, sucaiTexCoord) * clamp(_Intensity * _Opacity, 0.0, 1.0);
    if (_EnableOpacity > 0.5)
    {
        vec4 opacity = texture(_OpacityTexture, sucaiTexCoord);
        sucai = (sucai * _BaseColor) * opacity.x;
    }
    vec3 srcColor = clamp(src.xyz / vec3((step(0.0, -src.w) * 9.9999999747524270787835121154785e-07) + src.w), vec3(0.0), vec3(1.0));
    vec3 sucaiColor = clamp(sucai.xyz / vec3((step(0.0, -sucai.w) * 9.9999999747524270787835121154785e-07) + sucai.w), vec3(0.0), vec3(1.0));
    vec3 param = srcColor;
    vec3 param_1 = sucaiColor;
    float param_2 = 1.0;
    vec3 blendColor = mix(srcColor, ApplyBlendMode(param, param_1, param_2), vec3(sucai.w));
    float blendAlpha = src.w + (sucai.w * (1.0 - src.w));
    o_FragColor = vec4(blendColor * blendAlpha, blendAlpha);
}

