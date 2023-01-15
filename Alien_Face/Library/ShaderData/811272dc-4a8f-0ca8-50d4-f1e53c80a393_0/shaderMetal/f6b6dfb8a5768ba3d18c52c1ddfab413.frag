#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 _BaseColor;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 g_vary_uv0;
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _BaseTexture [[texture(0)]], sampler _BaseTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 uv = in.g_vary_uv0;
    uv.y = 1.0 - uv.y;
    float4 texColor = _BaseTexture.sample(_BaseTextureSmplr, uv) * buffer._BaseColor;
    float3 _42 = texColor.xyz / float3(texColor.w);
    texColor = float4(_42.x, _42.y, _42.z, texColor.w);
    out.o_fragColor = texColor;
    return out;
}

