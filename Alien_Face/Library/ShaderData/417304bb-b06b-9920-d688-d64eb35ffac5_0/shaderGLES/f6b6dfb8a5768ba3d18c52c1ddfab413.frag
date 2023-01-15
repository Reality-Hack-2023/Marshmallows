#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D _InputTexture;
uniform mediump sampler2D _BaseTexture;
uniform float _Intensity;
uniform float _Opacity;
uniform float _EnableOpacity;
uniform mediump sampler2D _OpacityTexture;
uniform vec4 _BaseColor;
uniform float _EnableReflection;
uniform mediump sampler2D _ReflectionTexture;
uniform float _ReflectionIntensity;
uniform float _ReflectionOpacity;

in vec2 texCoord;
in vec2 sucaiTexCoord;
layout(location = 0) out vec4 o_FragColor;
in float weight;

vec3 ApplyBlendMode(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
    return ret;
}

vec3 BlendAdd(vec3 base, vec3 blend)
{
    return min(base + blend, vec3(1.0));
}

vec3 BlendAdd(vec3 base, vec3 blend, float opacity)
{
    vec3 param = base;
    vec3 param_1 = blend;
    return (BlendAdd(param, param_1) * opacity) + (base * (1.0 - opacity));
}

vec3 ApplyReflectBlendMode(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
    vec3 param = base;
    vec3 param_1 = blend;
    float param_2 = opacity;
    ret = BlendAdd(param, param_1, param_2);
    return ret;
}

void main()
{
    vec4 src = texture(_InputTexture, texCoord);
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
    vec3 dstColor = mix(srcColor, ApplyBlendMode(param, param_1, param_2), vec3(sucai.w));
    if (_EnableReflection > 0.5)
    {
        vec4 _reflect = texture(_ReflectionTexture, sucaiTexCoord) * clamp(_ReflectionIntensity * _ReflectionOpacity, 0.0, 1.0);
        vec3 reflectColor = clamp(_reflect.xyz / vec3((step(0.0, -_reflect.w) * 9.9999999747524270787835121154785e-07) + _reflect.w), vec3(0.0), vec3(1.0));
        vec3 param_3 = dstColor;
        vec3 param_4 = reflectColor;
        float param_5 = 1.0;
        dstColor = mix(dstColor, ApplyReflectBlendMode(param_3, param_4, param_5), vec3(_reflect.w));
    }
    o_FragColor = vec4(mix(src.xyz, dstColor, vec3(weight)), src.w);
}

