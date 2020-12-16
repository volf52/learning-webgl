import { GlAttrib } from "./types";

const { V_MAT, P_MAT, M_MAT, POS, FRAG_POS } = GlAttrib;

export const vShaderSrc = `
  precision mediump float;
  
  attribute vec3 ${POS};
  
  // transformations in world-space, like translating an object
  // Without the model matrix, all objects would remain at the origin (0,0,0)
  uniform mat4 ${M_MAT};
  
  // transformations in camera-space, like rotating the camera
  // The view matrix determines what region of the world will be on-screen.
  uniform mat4 ${V_MAT};
  
  // transformation in screen-space, like applying perspective.
  // Without the projection matrix, the world would be viewed orthographically
  uniform mat4 ${P_MAT};
  
  varying vec3 ${FRAG_POS};
  
  void main() {
      ${FRAG_POS} = ${POS};
  
      mat4 mvp = ${P_MAT} * ${V_MAT} * ${M_MAT};
      gl_Position = mvp * vec4(${POS}, 1);
      gl_PointSize = 1.0;
  }
`;

export const fShaderSrc = `
  precision mediump float;
  
  varying vec3 ${FRAG_POS};
  
  void main() {
      gl_FragColor = vec4(
          (${FRAG_POS}.x+1.0)*0.5,
          (${FRAG_POS}.y+1.0)*0.5, 
          1, 
          1);
  }
`;
