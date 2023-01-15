#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float _Intensity;
    float _Opacity;
    float _EnableOpacity;
    float4 _BaseColor;
    float _EnableReflection;
    float _ReflectionIntensity;
    float _ReflectionOpacity;
};

struct main0_out
{
    float4 o_FragColor [[color(0)]];
};

struct main0_in
{
    float2 texCoord;
    float2 sucaiTexCoord;
    float weight;
};

static inline __attribute__((always_inline))
float3 ApplyBlendMode(thread const float3& base, thread const float3& blend, thread const float& opacity)
{
    float3 ret = blend;
    return ret;
}

static inline __attribute__((always_inline))
float3 BlendAdd(thread const float3& base, thread const float3& blend)
{
    return fast::min(base + blend, float3(1.0));
}

static inline __attribute__((always_inline))
float3 BlendAdd(thread const float3& base, thread const float3& blend, thread const float& opacity)
{
    float3 param = base;
    float3 param_1 = blend;
    return (BlendAdd(param, param_1) * opacity) + (base * (1.0 - opacity));
}

static inline __attribute__((always_inline))
float3 ApplyReflectBlendMode(thread const float3& base, thread const float3& blend, thread const float& opacity)
{
    float3 ret = blend;
    float3 param = base;
    float3 param_1 = blend;
    float param_2 = opacity;
    ret = BlendAdd(param, param_1, param_2);
    return ret;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _InputTexture [[texture(0)]], texture2d<float> _BaseTexture [[texture(1)]], texture2d<float> _OpacityTexture [[texture(2)]], texture2d<float> _ReflectionTexture [[texture(3)]], sampler _InputTextureSmplr [[sampler(0)]], sampler _BaseTextureSmplr [[sampler(1)]], sampler _OpacityTextureSmplr [[sampler(2)]], sampler _ReflectionTextureSmplr [[sampler(3)]])
{
    main0_out out = {};
    float4 src = _InputTexture.sample(_InputTextureSmplr, in.texCoord);
    float4 sucai = _BaseTexture.sample(_BaseTextureSmplr, in.sucaiTexCoord) * fast::clamp(buffer._Intensity * buffer._Opacity, 0.0, 1.0);
    if (buffer._EnableOpacity > 0.5)
    {
        float4 opacity = _OpacityTexture.sample(_OpacityTextureSmplr, in.sucaiTexCoord);
        sucai = (sucai * buffer._BaseColor) * opacity.x;
    }
    float3 srcColor = fast::clamp(src.xyz / float3((step(0.0, -src.w) * 9.9999999747524270787835121154785e-07) + src.w), float3(0.0), float3(1.0));
    float3 sucaiColor = fast::clamp(sucai.xyz / float3((step(0.0, -sucai.w) * 9.9999999747524270787835121154785e-07) + sucai.w), float3(0.0), float3(1.0));
    float3 param = srcColor;
    float3 param_1 = sucaiColor;
    float param_2 = 1.0;
    float3 dstColor = mix(srcColor, ApplyBlendMode(param, param_1, param_2), float3(sucai.w));
    if (buffer._EnableReflection > 0.5)
    {
        float4 _reflect = _ReflectionTexture.sample(_ReflectionTextureSmplr, in.sucaiTexCoord) * fast::clamp(buffer._ReflectionIntensity * buffer._ReflectionOpacity, 0.0, 1.0);
        float3 reflectColor = fast::clamp(_reflect.xyz / float3((step(0.0, -_reflect.w) * 9.9999999747524270787835121154785e-07) + _reflect.w), float3(0.0), float3(1.0));
        float3 param_3 = dstColor;
        float3 param_4 = reflectColor;
        float param_5 = 1.0;
        dstColor = mix(dstColor, ApplyReflectBlendMode(param_3, param_4, param_5), float3(_reflect.w));
    }
    out.o_FragColor = float4(mix(src.xyz, dstColor, float3(in.weight)), src.w);
    return out;
}

