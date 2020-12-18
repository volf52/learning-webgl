export type TVec2 = readonly [number, number];
export type TVec3 = readonly [number, number, number];
export type DataArray2D = TVec2[];
export type DataArray3D = TVec3[];

export type DataArray = DataArray2D | DataArray3D;

export enum GlAttrib {
  POS = "attrib_position",
  COLOR = "attrib_color",
  NORMAL = "attrib_normal",
  UV = "attrib_uv",
  V_COLOR = "v_color",
  MAT_MODEL = "u_model_mat",
  MAT_VIEW = "u_view_mat",
  MAT_PROJ = "u_proj_mat",
  MAT_NORMAL = "u_normal_mat",
  MAT_MVP = "u_mvp_mat",
  FRAG_POS = "v_frag_pos",
  V_UV = "v_uv",
  V_BRIGHT = "v_brightness",
}

export type UniformLoc = WebGLUniformLocation | null;
export type GlBuff = WebGLBuffer | null;

export interface UniformLocations {
  mvp_matrix: UniformLoc;
  normal_matrix: UniformLoc;
}
