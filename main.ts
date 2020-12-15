import * as utils from "./utils";

const main = (): void => {
  const initResult = utils.initGL("#glCanvas");

  if (!initResult) {
    return;
  }

  const { gl } = initResult;

  // vertex data
  const vertexData = [
    [0.5, 0.5],
    [-0.5, 0.5],
    [0.5, -0.5],
    [-0.5, -0.5],
    [-0.5, 0.5],
    [0.5, -0.5],
  ];

  const program = utils.initProgram(gl);
  if (!program) {
    console.error("Failed to create GL program");
    return;
  }
  gl.useProgram(program);

  // // create buffer
  utils.loadData(gl, vertexData);

  // // enable vertex attribs
  const posLoc = gl.getAttribLocation(program, utils.POS_ATTRIB);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  // draw
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, 6);
};

window.onload = main;
