import { initProg } from "./gl-utils";
import { spherePointCloud } from "./utils";
import { Scene } from "./scene";
import { fShaderSrc, vShaderSrc } from "./shaders";
import { GlAttrib } from "./types";

const main = async (): Promise<void> => {
  console.log(vShaderSrc);
  const initProgResult = initProg("glCanvas", {
    vShaderSrc,
    fShaderSrc,
  });
  if (initProgResult === null) return;

  const { canvas, gl, glProg, glw } = initProgResult;

  const uniformLocations = {
    model_matrix: glProg.getUniformLoc(GlAttrib.M_MAT),
    view_matrix: glProg.getUniformLoc(GlAttrib.V_MAT),
    projection_matrix: glProg.getUniformLoc(GlAttrib.P_MAT),
  };
  const scene = new Scene(glw);
  scene.projMat.perspective(Math.PI / 2, 16 / 9);
  window.addEventListener("keypress", (e) => {
    let toAdd = 0.25;
    let idx = 2;
    switch (e.key) {
      case "w": // 2, .25
        break;
      case "s": // 2, -.25
        toAdd = -0.25;
        break;
      case "a": // 0, -.25
        toAdd = -0.25; // skipcq
      case "d": // 0, .25
        idx = 0;
        break;
      default:
        return;
    }

    scene.camera.translation.idxAdd(idx, toAdd);
  });

  canvas.addEventListener("mousemove", (e) => {
    const radX = (2 * (e.pageX - canvas.offsetLeft)) / canvas.width - 1;
    const radY = (2 * (e.pageY - canvas.offsetTop)) / canvas.height - 1;

    scene.rotateModel(radX, -radY);
  });

  // vertex data
  const vertexData = spherePointCloud(1e5, 0.75);
  // create and load vertex data to GPU buffer
  const posBuffer = glw.loadData(vertexData);
  // enable vertex and color attribs
  glProg.setVAttrib(GlAttrib.POS, posBuffer, 3, true);
  gl.enable(gl.DEPTH_TEST);

  const animate = (): void => {
    scene.update(uniformLocations);
    glw.drawPoints(vertexData.length);
    requestAnimationFrame(animate);
  };

  animate();
};

// skipcq
window.onload = async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
};
