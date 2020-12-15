import * as utils from "./utils";
import GLProgram, { GlAttrib, createGlProgram, initGL } from "./glutils";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (!initResult) return;

  const { gl } = initResult;

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
  const posBuffer = utils.loadData(gl, vertexData);
  const colorBuffer = utils.loadData(gl, colorData);

  console.log(posBuffer)

  const program = utils.initProgram(initResult.gl);
  if (!program) return;

  // enable vertex attribs
  const posLoc = utils.enableAndBind(gl, program, utils.POS_ATTRIB, posBuffer);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const colorLoc = utils.enableAndBind(
    gl,
    program,
    utils.COLOR_ATTRIB,
    colorBuffer
  );
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

  // draw
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program)
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

window.addEventListener("load", (_) => main());
