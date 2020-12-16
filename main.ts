import { GlAttrib, GlWrapper, initGL } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { spherePointCloud } from "./utils";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (initResult === null) return;

  const glw = new GlWrapper(initResult.gl);

  const { canvas } = initResult;

  // vertex data
  const vertexData = spherePointCloud();

  // create and load vertex data to GPU buffer
  const posBuffer = glw.loadData(vertexData);

  const shaders = glw.initShaders({
    vShaderSrc: `
    precision mediump float;
    
    attribute vec3 ${GlAttrib.POS};
    
    varying vec3 ${GlAttrib.VAR_COLOR};
    
    uniform mat4 ${GlAttrib.MAT};
    
    void main(){
      ${GlAttrib.VAR_COLOR} = vec3(${GlAttrib.POS}.xy, 1);
      gl_Position = ${GlAttrib.MAT} * vec4(${GlAttrib.POS}, 1);
    }
  `,
  });
  if (shaders === null) return;

  const { vShader, fShader } = shaders;
  const glProg = glw.createGlProgram(vShader, fShader);
  if (glProg === null) return;
  const { gl, program } = glProg;

  // enable vertex and color attribs
  glProg.setVAttrib(GlAttrib.POS, posBuffer, 3, true);

  glProg.use();
  gl.enable(gl.DEPTH_TEST);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, GlAttrib.MAT),
  };

  const modelMatrix = Mat4.create().translate([-1.5, 0, -2]);
  const viewMatrix = Mat4.create().translate([-3, 0, 1]).invert();
  const projMatrix = Mat4.create().perspective(
    (75 * Math.PI) / 180,
    canvas.width / canvas.height
  );

  const mvMatrix = Mat4.create();
  const mvpMatrix = Mat4.create();

  const animate = (): void => {
    requestAnimationFrame(animate);

    viewMatrix.mul(modelMatrix, mvMatrix);
    projMatrix.mul(mvMatrix, mvpMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix.get());

    gl.drawArrays(gl.POINTS, 0, vertexData.length); // len / 3 for flattened array
  };

  animate();
};

window.addEventListener("load", (_) => main());
