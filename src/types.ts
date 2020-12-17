export type TVec2 = readonly [number, number];
export type TVec3 = readonly [number, number, number];
export type DataArray3D = Array<TVec3>;
export type DataArray2D = Array<TVec2>;

export type DataArray = DataArray2D | DataArray3D;

export enum GlAttrib {
  POS = "vertex_position",
  COLOR = "color",
  V_COLOR = "v_color",
  M_MAT = "u_model_matrix",
  V_MAT = "u_view_matrix",
  P_MAT = "u_projection_matrix",
  FRAG_POS = "v_frag_pos",
  UV = "uv",
  V_UV = "v_uv",
}

export type UniformLoc = WebGLUniformLocation | null;

export interface UniformLocations {
  model_matrix: UniformLoc;
  view_matrix: UniformLoc;
  projection_matrix: UniformLoc;
}
