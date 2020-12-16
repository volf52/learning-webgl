import { GlAttrib, initProg } from "./gl-utils";
import { Mat4 } from "./mat-utils";
import { spherePointCloud, toRadians } from "./utils";
import { quat } from "gl-matrix";

class Scene {
  modelMat = Mat4.create();
  viewMat = Mat4.create();
  projMat = Mat4.create();

  camera = {
    translation: [0, 0, 0],
    rotation: quat.create(),
  };
}

const main = async (): Promise<void> => {
  const initProgResult = initProg("glCanvas");
  if (initProgResult === null) return;

  const { canvas, gl, glProg, glw } = initProgResult;

  const attributes = {
    position: glProg.getAttribLoc(GlAttrib.POS),
  };

  const uniformLocations = {
    model_matrix: glProg.getUniformLoc(GlAttrib.M_MAT),
    view_matrix: glProg.getUniformLoc(GlAttrib.V_MAT),
    projection_matrix: glProg.getUniformLoc(GlAttrib.P_MAT),
  };

  // vertex data
  const vertexData = spherePointCloud();

  // create and load vertex data to GPU buffer
  const posBuffer = glw.loadData(vertexData);

  // enable vertex and color attribs
  glProg.setVAttrib(GlAttrib.POS, posBuffer, 3, true);

  glProg.use();
  gl.enable(gl.DEPTH_TEST);

  const modelMatrix = Mat4.create().translate([-1.5, 0, -2]);
  const viewMatrix = Mat4.create().translate([-3, 0, 1]).invert();
  const projMatrix = Mat4.create().perspective(
    toRadians(75),
    canvas.width / canvas.height
  );

  const mvMatrix = Mat4.create();
  const mvpMatrix = Mat4.create();

  const animate = (): void => {
    requestAnimationFrame(animate);

    viewMatrix.mul(modelMatrix, mvMatrix);
    projMatrix.mul(mvMatrix, mvpMatrix);

    gl.uniformMatrix4fv(uniformLocations.model_matrix, false, mvpMatrix.get());

    gl.drawArrays(gl.POINTS, 0, vertexData.length); // len / 3 for flattened array
  };

  animate();
};

window.addEventListener("load", (_) => main());
