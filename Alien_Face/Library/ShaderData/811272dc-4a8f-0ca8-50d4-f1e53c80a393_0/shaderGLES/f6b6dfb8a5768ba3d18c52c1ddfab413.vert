#version 300 es

uniform mat4 u_MVP;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_Model;

layout(location = 0) in vec3 attPosition;
out vec2 g_vary_uv0;
layout(location = 1) in vec2 attTexcoord0;
out vec3 v_worldPos;
out vec3 v_Normal;
layout(location = 2) in vec3 attNormal;
out vec4 v_sampling_pos;
out vec4 v_background_pos;

void main()
{
    vec3 modelPostiton = attPosition;
    vec4 homogeneous_modelPostiton = vec4(modelPostiton, 1.0);
    vec4 homogeneous_pos = vec4(attPosition, 1.0);
    g_vary_uv0 = attTexcoord0;
    gl_Position = u_MVP * homogeneous_pos;
    v_worldPos = homogeneous_pos.xyz;
    v_Normal = mat3(u_TransposeInvModel[0].xyz, u_TransposeInvModel[1].xyz, u_TransposeInvModel[2].xyz) * attNormal;
    v_sampling_pos = u_MVP * homogeneous_modelPostiton;
    v_background_pos = u_MVP * homogeneous_pos;
}

