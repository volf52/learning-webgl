import { createGlProgram, GlAttrib, initGL } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { createCubeVertices } from "./geometry";
import { Vec3 } from "./types";

const main = (): void => {
  const initResult = initGL("glCanvas");
  if (!initResult) return;

  const glProg = createGlProgram(initResult.gl);
  if (!glProg) return;

  const { canvas } = initResult;

  const { gl, program } = glProg;

  // vertex data
  const vertexData = createCubeVertices(0.5);

  const randomColor = (): Vec3 => [Math.random(), Math.random(), Math.random()];

  const colorData = [];
  for (let face = 0; face < 6; face++) {
    const faceCol = randomColor();
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

  const modelMatrix = Mat4.create();
  const viewMatrix = Mat4.create();
  const projMatrix = Mat4.create().perspective(
    (75 * Math.PI) / 180,
    canvas.width / canvas.height
  );

  modelMatrix.translate([0.2, 0.5, -2]);

  viewMatrix.translate([-3, 0, 1]);
  viewMatrix.invert();

  // Result of projMatrix * modelMatrix
  const finalMatrix = Mat4.create();

  const animate = () => {
    requestAnimationFrame(animate);
    modelMatrix.rotateZ(Math.PI / 2 / 70);
    modelMatrix.rotateX(Math.PI / 2 / 70);

    projMatrix.mul(modelMatrix, finalMatrix); // better to send Mat4 in the finalMatrix part
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix.get());
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length); // len / 3 for flattened array
  };

  animate();
};

window.addEventListener("load", (_) => main());
