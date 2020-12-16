import { GlAttrib, initGL, GlWrapper } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { createCubeVertices } from "./geometry";
import { randomColorVec } from "./utils";
import { mat4 } from "gl-matrix";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (initResult === null) return;

  const glw = new GlWrapper(initResult.gl);

  const { canvas } = initResult;

  // vertex data
  const vertexData = createCubeVertices(0.5);

  const colorData = [];
  for (let face = 0; face < 6; face++) {
    const faceCol = randomColorVec();
    for (let vertex = 0; vertex < 6; vertex++) {
      colorData.push(faceCol);
    }
  }

  // create and load vertex and color buffer
  const posBuffer = glw.loadData(vertexData);
  const colorBuffer = glw.loadData(colorData);

  const shaders = glw.createShaders();
  if (shaders === null) return;

  const { vShader, fShader } = shaders;
  const glProg = glw.createGlProgram(vShader, fShader);
  if (glProg === null) return;
  const { gl, program } = glProg;

  // enable vertex and color attribs
  glProg.setVAttrib(GlAttrib.POS, posBuffer, 3, true);
  glProg.setVAttrib(GlAttrib.COLOR, colorBuffer, 3, true);

  glProg.use();
  gl.enable(gl.DEPTH_TEST);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
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

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length); // len / 3 for flattened array
  };

  animate();
};

window.addEventListener("load", (_) => main());
