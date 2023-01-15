#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 o_FragColor [[color(0)]];
};

struct main0_in
{
    float2 texCoord;
    float2 maskTexCoord;
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> inputImageTexture [[texture(0)]], texture2d<float> _MaskTexture [[texture(1)]], sampler inputImageTextureSmplr [[sampler(0)]], sampler _MaskTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 src = inputImageTexture.sample(inputImageTextureSmplr, in.texCoord);
    float alpha = _MaskTexture.sample(_MaskTextureSmplr, in.maskTexCoord).x;
    src *= alpha;
    out.o_FragColor = src;
    return out;
}

