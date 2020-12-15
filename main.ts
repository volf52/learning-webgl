import { createGlProgram, GlAttrib, initGL } from "./utils";
import * as glm from "gl-matrix";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (!initResult) return;

  const glProg = createGlProgram(initResult.gl);
  if (!glProg) return;

  const { gl, program } = glProg;

  const matrix = glm.mat4.create()
  console.log(matrix);

  // vertex data
  const vertexData = [
    [0, 1, 0], // v1.pos
    [1, -1, 0], // v2.pos
    [-1, -1, 0], // v3.pos
  ];

  const colorData = [
    [1, 0, 0], // v1.color
    [0, 1, 0], // v2.color
    [0, 0, 1], // v3.color
  ];

  // create and load vertex and color buffer
  const posBuffer = glProg.loadData(vertexData);
  const colorBuffer = glProg.loadData(colorData);

  // enable vertex attribs
  const posLoc = glProg.getAndEnableAttrib(GlAttrib.POS, posBuffer, true);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const colorLoc = glProg.getAndEnableAttrib(GlAttrib.COLOR, colorBuffer, true);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

  // draw
  glProg.use();
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

window.addEventListener("load", (_) => main());
