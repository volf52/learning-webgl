import { createGlProgram, GlAttrib, initGL } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { createCubeVertices } from "./geometry";
import { Vec3 } from "./types";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (!initResult) return;

  const glProg = createGlProgram(initResult.gl);
  if (!glProg) return;

  const { gl, program } = glProg;

  // vertex data
  const vertexData = createCubeVertices(0.5);

  const randomColor = () =>
    [Math.random(), Math.random(), Math.random()] as Vec3;

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

  // enable vertex and color attribs
  glProg.setVAttrib(GlAttrib.POS, posBuffer, 3, true);
  glProg.setVAttrib(GlAttrib.COLOR, colorBuffer, 3, true);

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
