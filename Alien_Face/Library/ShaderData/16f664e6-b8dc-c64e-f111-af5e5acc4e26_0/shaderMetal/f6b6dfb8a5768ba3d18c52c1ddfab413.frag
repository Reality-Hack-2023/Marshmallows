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
};

struct main0_out
{
    float4 o_FragColor [[color(0)]];
};

struct main0_in
{
    float2 texCoord;
    float2 sucaiTexCoord;
};

static inline __attribute__((always_inline))
float4 textureFromInput(texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr, thread float2& texCoord)
{
    float4 result = u_FBOTexture.sample(u_FBOTextureSmplr, texCoord);
    return result;
}

static inline __attribute__((always_inline))
float3 ApplyBlendMode(thread const float3& base, thread const float3& blend, thread const float& opacity)
{
    float3 ret = blend;
    return ret;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_FBOTexture [[texture(0)]], texture2d<float> _BaseTexture [[texture(1)]], texture2d<float> _OpacityTexture [[texture(2)]], sampler u_FBOTextureSmplr [[sampler(0)]], sampler _BaseTextureSmplr [[sampler(1)]], sampler _OpacityTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 src = textureFromInput(u_FBOTexture, u_FBOTextureSmplr, in.texCoord);
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
    float3 blendColor = mix(srcColor, ApplyBlendMode(param, param_1, param_2), float3(sucai.w));
    float blendAlpha = src.w + (sucai.w * (1.0 - src.w));
    out.o_FragColor = float4(blendColor * blendAlpha, blendAlpha);
    return out;
}

