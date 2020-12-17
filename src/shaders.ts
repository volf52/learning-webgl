import { GlAttrib } from "./types";

const { M_MAT, POS, UV, V_UV, COLOR, V_COLOR, V_MAT, P_MAT } = GlAttrib;

export const vShaderSrc = `
  precision mediump float;
  
  attribute vec3 ${POS};
  //attribute vec3 ${COLOR};
  attribute vec2 ${UV};
  
  uniform mat4 ${M_MAT};
  uniform mat4 ${V_MAT};
  uniform mat4 ${P_MAT};
  
  varying vec2 ${V_UV};
  //varying vec3 ${V_COLOR};
  
  void main() {
      ${V_UV} = ${UV};
      //${V_COLOR} = ${COLOR};
      mat4 mvp = ${P_MAT} * ${V_MAT} * ${M_MAT};
      gl_Position = mvp * vec4(${POS}, 1);
  }
`;

export const fShaderSrc = `
  precision mediump float;
  
  //varying vec3 ${V_COLOR};
  varying vec2 ${V_UV};
  uniform sampler2D textureID;
  
  void main() {
      gl_FragColor = texture2D(textureID, ${V_UV});
      //gl_FragColor = vec4(${V_COLOR}, 1);
  }
`;
