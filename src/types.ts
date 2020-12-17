type TVec3 = readonly [number, number, number];
type DataArray = Array<number | TVec3>;

// type DataArray = Array<number | DataArray>

export enum GlAttrib {
  POS = "vertex_position",
  COLOR = "color",
  VAR_COLOR = "v_color",
  M_MAT = "u_model_matrix",
  V_MAT = "u_view_matrix",
  P_MAT = "u_projection_matrix",
  FRAG_POS = "v_frag_pos",
}

export { DataArray, TVec3 };
