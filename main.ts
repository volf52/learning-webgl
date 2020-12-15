import { createGlProgram, GlAttrib, initGL } from "./gl-utils";
import { Mat4 } from "./mat-utils";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (!initResult) return;

  const glProg = createGlProgram(initResult.gl);
  if (!glProg) return;

  const { gl, program } = glProg;

  // vertex data
  const vertexData = [
    // Front
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],

    // Left
    [-0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],

    // Back
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],

    // Right
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],

    // Top
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],

    // Bottom
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
  ];

  const randomColor = () => [Math.random(), Math.random(), Math.random()];

  const colorData = [];
  for (let face = 0; face < 6; face++) {
    let faceCol = randomColor();
    for (let vertex = 0; vertex < 6; vertex++) {
      colorData.push(faceCol);
    }
  }

  // create and load vertex and color buffer
  const posBuffer = glProg.loadData(vertexData);
  const colorBuffer = glProg.loadData(colorData);

  // enable vertex attribs
  const posLoc = glProg.getAndEnableAttrib(GlAttrib.POS, posBuffer, true);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const colorLoc = glProg.getAndEnableAttrib(GlAttrib.COLOR, colorBuffer, true);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

  glProg.use();
  gl.enable(gl.DEPTH_TEST);

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
  };

  const matrix = Mat4.create()
    .translate([0.2, 0.5, 0])
    .scale([0.25, 0.25, 0.25]);

  const animate = () => {
    requestAnimationFrame(animate);
    matrix.rotateZ(Math.PI / 2 / 70);
    matrix.rotateX(Math.PI / 2 / 70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix.get());
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length); // len / 3 for flattened array
  };

  animate();
};

window.addEventListener("load", (_) => main());
