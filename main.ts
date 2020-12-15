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
    [0, 1, 0], // v1.pos
    [1, -1, 0], // v2.pos
    [-1, -1, 0], // v3.pos
  ];

  const randomColor = () => [Math.random(), Math.random(), Math.random()];

  const colorData = [
    randomColor(), // v1.color
    randomColor(), // v2.color
    randomColor(), // v3.color
  ];

  // create and load vertex and color buffer
  const posBuffer = glProg.loadData(vertexData);
  const colorBuffer = glProg.loadData(colorData);

  // enable vertex attribs
  const posLoc = glProg.getAndEnableAttrib(GlAttrib.POS, posBuffer, true);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const colorLoc = glProg.getAndEnableAttrib(GlAttrib.COLOR, colorBuffer, true);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

  glProg.use();

  const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
  };

  const matrix = Mat4.create()
    .translate([0.2, 0.5, 0])
    .scale([0.25, 0.25, 0.25]);

  console.log(matrix.str());
  const animate = () => {
    requestAnimationFrame(animate);
    matrix.rotateZ(Math.PI / 2 / 70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix.get());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  animate();
};

window.addEventListener("load", (_) => main());
